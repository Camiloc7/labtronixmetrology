/**
 * Fuente única de verdad de las rutas públicas (accesibles sin sesión).
 *
 * IMPORTANTE — al crear una nueva página pública (landing, legales, docs, etc.)
 * agrégala AQUÍ, y solo aquí. Este listado lo consumen dos capas:
 *
 *   1) `proxy.ts` (middleware): permite el acceso sin cookie `jwt`.
 *      Si una ruta no está en la lista, redirige server-side a `/login`.
 *   2) `lib/api.ts` (interceptor de axios): evita el redirect cliente a
 *      `/login` cuando `/auth/me` responde 401 estando en una ruta pública.
 *
 * Si olvidas registrar una ruta pública, será expulsada a `/login`: de inmediato
 * (middleware) o tras ~2 s (interceptor, al fallar `/auth/me` + `/auth/refresh`).
 * Con este módulo, basta editar un solo archivo para que ambas capas queden
 * sincronizadas.
 *
 *   - `/` se compara EXACTO (solo la raíz, para no abrir todo el sitio).
 *   - El resto se compara por PREFIJO (p. ej. `/sobre-nosotros/intro`).
 */
export const PUBLIC_PATHS = ['/', '/login', '/sobre-nosotros', '/images'] as const;

export function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.some((p) => path === p || (p !== '/' && path.startsWith(`${p}/`)));
}
