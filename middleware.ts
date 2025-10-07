import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/auth/session'

// Routes that require authentication
const protectedRoutes = ['/student', '/teacher', '/admin']
// Routes that should redirect if already authenticated
const authRoutes = ['/login']

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isAuthRoute = authRoutes.some(route => path.startsWith(route))

  // Get session from cookie
  const cookie = req.cookies.get('session')?.value
  const session = cookie ? await decrypt(cookie).catch(() => null) : null

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Redirect to appropriate dashboard if accessing auth routes with valid session
  if (isAuthRoute && session) {
    const role = session.role.toLowerCase()
    if (role === 'student') {
      return NextResponse.redirect(new URL('/student', req.nextUrl))
    } else if (role === 'lecturer' || role === 'teacher') {
      return NextResponse.redirect(new URL('/teacher', req.nextUrl))
    } else if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.nextUrl))
    }
  }

  // Role-based access control for protected routes
  if (isProtectedRoute && session) {
    const role = session.role.toLowerCase()
    
    if (path.startsWith('/student') && role !== 'student') {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    
    if (path.startsWith('/teacher') && !['lecturer', 'teacher'].includes(role)) {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
    
    if (path.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}


