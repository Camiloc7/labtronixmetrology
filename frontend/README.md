This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Rutas públicas (autenticación)

Las rutas accesibles **sin sesión** se declaran una sola vez en
[`lib/public-paths.ts`](./lib/public-paths.ts) (`PUBLIC_PATHS` + `isPublicPath`).

Al crear una nueva página pública (landing, legales, docs, etc.) **agrégala ahí**. Esa lista la consumen dos capas que deben mantenerse sincronizadas:

1. `proxy.ts` (middleware de Next): deja pasar la ruta sin cookie `jwt`; si no está en la lista, redirige server-side a `/login`.
2. `lib/api.ts` (interceptor de axios): evita el redirect cliente a `/login` cuando `/auth/me` responde `401` estando en una ruta pública.

> Si olvidas registrar una ruta pública, se expulsará a `/login`: al instante (middleware) o tras ~2 s (interceptor, al fallar `/auth/me` + `/auth/refresh`). Centralizando la lista en `lib/public-paths.ts` basta editar **un solo archivo**.

## Sitio público y SEO

Configura `NEXT_PUBLIC_SITE_URL` con el origen canónico, sin barra final. Este valor se usa para metadata, enlaces canónicos, `robots.txt`, `sitemap.xml` y datos estructurados. Consulta `.env.example`.

El formulario público envía las solicitudes a `POST /api/v1/public/contact`; el backend las guarda en la bandeja existente de solicitudes por email para que el equipo comercial pueda procesarlas.
