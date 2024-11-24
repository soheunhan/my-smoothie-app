import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authCookie = request.cookies.get('user_id');
  const isAuthenticated = !!authCookie?.value;

  if (isAuthenticated && pathname === '/signin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!isAuthenticated && pathname === '/') {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/signin'],
};
