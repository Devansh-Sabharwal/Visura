import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export {default} from "next-auth/middleware"
import { getToken } from 'next-auth/jwt'
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({req:request})
  const url = request.nextUrl
  if(token && 
    (
        url.pathname.startsWith('/signin')||
        url.pathname.startsWith('/signup')
    )){
        return NextResponse.redirect(new URL('/'))
    }
  if (!token && url.pathname.startsWith('/chat')) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  // Allow through otherwise
  return NextResponse.next();

}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/chat'

  ]
}