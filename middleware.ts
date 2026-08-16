import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'rofra-secret-key-123456');

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('auth_token')?.value;

  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isAdminRoute = pathname.startsWith('/admin');

  if (!isDashboardRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Strict Admin Authorization Check
    if (isAdminRoute && payload.email !== 'Admin@rofra.com') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
