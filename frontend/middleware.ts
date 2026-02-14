import { NextRequest, NextResponse } from 'next/server';

// Define which paths require authentication
const protectedPaths = ['/dashboard/:path*']; // Removed /api/tasks/:path* since API calls go to external backend
const authPaths = ['/login', '/signup'];

export async function middleware(req: NextRequest) {
  // Check if the current path is protected
  const isProtectedPath = protectedPaths.some(path =>
    new RegExp(`^${path.replace(/\*/g, '.*')}`).test(req.nextUrl.pathname)
  );

  // Check if the current path is an auth path (login/signup)
  const isAuthPath = authPaths.some(path =>
    req.nextUrl.pathname.startsWith(path)
  );

  // Skip middleware for API routes - these should go directly to the backend
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // For frontend routes, check session
  if (isProtectedPath) {
    // Check for our custom auth token
    const authToken = req.cookies.get('auth-token');

    if (!authToken) {
      // Redirect to login if no session exists
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.search = `return=${encodeURIComponent(req.url)}`;
      return NextResponse.redirect(url);
    }
  }

  // If user is on auth page but already logged in, redirect to dashboard
  if (isAuthPath) {
    const authToken = req.cookies.get('auth-token');
    if (authToken) {
      const url = req.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Apply middleware to specific paths - only for frontend routes, not external API calls
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (these should go to your external backend)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static (static assets)
     */
    '/((?!api\\/|_next\\/|static\\/|favicon\\.ico|.*\\..*).*)',
  ]
};