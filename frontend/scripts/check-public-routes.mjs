/**
 * Test de guardia: toda página bajo `app/(public)` debe estar registrada en
 * `lib/public-paths.ts`.
 *
 * Motivo: si una ruta pública no está registrada, el middleware (`proxy.ts`) y/o
 * el interceptor de axios (`lib/api.ts`) la expulsan a `/login`. Este test falla
 * en ese caso para que el deploy no continúe.
 *
 * Carga el módulo REAL (`PUBLIC_PATHS` / `isPublicPath`) transpilándolo con
 * TypeScript, de modo que prueba el comportamiento verdadero.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const publicPathsFile = path.join(root, 'lib', 'public-paths.ts');
const publicPagesDir = path.join(root, 'app', '(public)');

const transpiled = ts.transpileModule(fs.readFileSync(publicPathsFile, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;

const { PUBLIC_PATHS, isPublicPath } = await import(
  'data:text/javascript;base64,' + Buffer.from(transpiled).toString('base64')
);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const isPage = (file) => /^page\.(tsx|ts|jsx|js)$/.test(path.basename(file));

function routeFor(file) {
  const segments = path
    .relative(publicPagesDir, file)
    .split(path.sep)
    .slice(0, -1)
    .filter((s) => !/^\(.*\)$/.test(s)); // ignora route groups anidados, p. ej. (marketing)
  return '/' + segments.join('/');
}

const pages = walk(publicPagesDir)
  .filter(isPage)
  .map((file) => ({ file: path.relative(root, file).replace(/\\/g, '/'), route: routeFor(file) }))
  .sort((a, b) => a.route.localeCompare(b.route));

const missing = pages.filter((p) => !isPublicPath(p.route));
const unsafePrefixMatches = PUBLIC_PATHS
  .filter((route) => route !== '/')
  .map((route) => `${route}-no-debe-ser-publica`)
  .filter(isPublicPath);

console.log('Rutas registradas en lib/public-paths.ts:', JSON.stringify(PUBLIC_PATHS));
console.log('Páginas encontradas en app/(public):');
for (const p of pages) console.log(`  ${p.route}  ->  ${p.file}`);

if (missing.length > 0) {
  console.log('\n❌ FALTAN rutas públicas por registrar en frontend/lib/public-paths.ts:');
  for (const p of missing) console.log(`  - ${p.route}  (${p.file})`);
  console.log('\nAgrégalas a PUBLIC_PATHS; si no, serán redirigidas a /login.');
  process.exit(1);
}

if (unsafePrefixMatches.length > 0) {
  console.log('\n❌ Hay coincidencias públicas por prefijo sin límite de segmento:');
  for (const route of unsafePrefixMatches) console.log(`  - ${route}`);
  process.exit(1);
}

console.log('\n✅ Todas las páginas públicas están registradas.');
