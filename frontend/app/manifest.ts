import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Labtronix Metrology',
    short_name: 'Labtronix',
    description: 'Servicios de calibración metrológica en Colombia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#ec060b',
    lang: 'es-CO',
    icons: [{ src: '/logo.png', sizes: '512x512', type: 'image/png' }],
  };
}
