import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const EXACT_PUBLIC_PATHS = ['/'];
const PREFIX_PUBLIC_PATHS = ['/login', '/sobre-nosotros', '/images'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir rutas públicas
  if (EXACT_PUBLIC_PATHS.includes(pathname) || PREFIX_PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Verificar cookie JWT
  const jwt = request.cookies.get('jwt');
  if (!jwt) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)'],
};
