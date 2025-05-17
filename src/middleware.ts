import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Create a response object that we'll manipulate
  const res = NextResponse.next();

  // Create a Supabase client specifically for the middleware
  const supabase = createMiddlewareClient({ req, res });

  // Refresh the session - this will set the cookie if it exists
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If no session and trying to access protected routes
  if (!session && (
    req.nextUrl.pathname.startsWith('/dashboard') ||
    req.nextUrl.pathname === '/'
  )) {
    const redirectUrl = new URL('/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If session exists and trying to access auth pages
  if (session && (
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/register')
  )) {
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Return the response with the session
  return res;
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/login', '/register'],
};
