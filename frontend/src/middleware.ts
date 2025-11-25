import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Allow public access to landing and auth pages
  if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/auth') {
    return NextResponse.next();
  }

  // For other protected routes, check authentication on client side
  // Server-side check would require getting token from cookies
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

