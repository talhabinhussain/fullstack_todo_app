import { NextRequest, NextResponse } from 'next/server';

// Define which paths require authentication
const protectedPaths = ['/dashboard/:path*', '/api/tasks/:path*'];
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

  // For API routes, we'll check for the presence of authorization header
  if (req.nextUrl.pathname.startsWith('/api/') && !req.nextUrl.pathname.startsWith('/api/auth')) {
    // This is a simplified approach - in practice, you might want to validate the JWT token
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Return a JSON response for API routes
      if (req.nextUrl.pathname.startsWith('/api/')) {
        return new Response(JSON.stringify({ error: 'Authentication required' }), {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        // Redirect to login for non-API routes without proper auth
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
      }
    }

    // Extract token and validate (simplified validation)
    const token = authHeader.substring(7);

    // In a real app, you would validate the token against your auth service
    // For now, we'll just check if it exists
    if (!token) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Token is present, allow the request to proceed
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

// Apply middleware to specific paths
export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*', '/login', '/signup']
};