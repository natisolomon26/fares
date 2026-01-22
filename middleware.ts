// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('churchflow_token')
  const { pathname } = request.nextUrl

  // Define public paths that don't require authentication
  const publicPaths = ['/', '/api/auth/login', '/api/auth/register']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  // If user is not authenticated and trying to access protected route
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is authenticated and trying to access auth page
  if (token && pathname === '/auth') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}