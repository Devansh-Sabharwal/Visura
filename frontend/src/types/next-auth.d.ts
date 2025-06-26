import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    fastApiToken?: string
    userId?: string
    name:string
  }

  interface User {
    fastApiToken?: string
  }
} 

declare module "next-auth/jwt" {
  interface JWT {
    fastApiToken?: string
    userId?: string
    name:string
  }
}
