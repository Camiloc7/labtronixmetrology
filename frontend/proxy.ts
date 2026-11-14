import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isPublicPath } from './lib/public-paths';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir rutas públicas (fuente única: lib/public-paths.ts)
  if (isPublicPath(pathname)) {
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
  // Excluye la API, los assets de Next, socket.io y cualquier archivo con
  // extensión (vídeo del hero, .svg, robots.txt, sitemap.xml, manifest, etc.):
  // el middleware solo debe proteger páginas, no recursos estáticos.
  matcher: ['/((?!api|_next/static|_next/image|socket.io|favicon.ico|.*\\..*).*)'],
};
