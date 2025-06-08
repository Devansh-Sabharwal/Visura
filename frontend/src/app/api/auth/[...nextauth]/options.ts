import { getServerSession, NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'


const FASTAPI_URL = process.env.FASTAPI_URL
export const authOptions:NextAuthOptions = {
  // Providers array will be configured in the next steps
   providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name:{label:'Name',type:'text',placeholder:"Enter your name"},
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if(!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }
        
        try {
          const response = await fetch(`${FASTAPI_URL}/auth/signin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: credentials.name,
              email: credentials.email,
              password: credentials.password
            })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            const errorMessage = data.detail || data.message || `HTTP ${response.status}: ${response.statusText}`;
            throw new Error(errorMessage);
          }
    
          return {
            id: data.id,
            name: data.name,
            fastApiToken: data.token, 
          };
          
        } catch (error:any) {
          console.error('Auth error:', error);
          
          if (error.message && error.message !== 'fetch failed') {
            throw error;
          }
          
          throw new Error('Authentication service unavailable');
        }
      }
    }),
 
  ],
  callbacks:{
    async jwt({ token, user, account }) {

      if (user) {
        if (account?.provider === 'google') {
        
          try {
            const response = await fetch(`${FASTAPI_URL}/auth/google`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                googleId: user.id,
                image:user.image
              }),
            })

            if (response.ok) {
              const data = await response.json()
              token.fastApiToken = data.token
              token.userId = data.id
              token.name = data.name

              console.log("Google signin successfull")
            }
            else {
              console.log('sign in failed',response.statusText)
              throw new Error(`FastAPI error: ${response.status}`);

            }

          } catch (error) {
            console.error('Google auth error:', error)
            throw new Error('External auth failed');
          }
        } else if (account?.provider === 'credentials') {
    
          token.fastApiToken = user.fastApiToken
          token.userId = user.id
          token.name = user.name ?? ''
        }
      }

      return token
    },
    async session({session,token}){
        session.fastApiToken = token.fastApiToken
        session.userId = token.userId
        session.name = token.name
        return session
    }
  },
  session: {
    strategy: 'jwt',
    maxAge:1 * 24 * 60 * 60,
  },
  secret:process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin', 
  },
}
