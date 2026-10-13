import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/hooks/useAuth';
import { Toaster } from 'react-hot-toast';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Labtronix Metrology | Calibración metrológica',
    template: '%s | Labtronix Metrology',
  },
  description: siteConfig.description,
  keywords: ['metrología', 'calibración', 'laboratorio', 'gestión', 'labtronix'],
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: siteConfig.name,
    title: 'Labtronix Metrology | Calibración metrológica',
    description: siteConfig.description,
    url: '/',
    images: [{ url: '/images/original/pesas-m1.jpg', alt: 'Calibración de equipos en Labtronix Metrology' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Labtronix Metrology | Calibración metrológica',
    description: siteConfig.description,
    images: ['/images/original/pesas-m1.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme'))) {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (_) {}
          `
        }} />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--color-surface-2)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: '10px',
                fontSize: '0.875rem',
              },
              success: {
                iconTheme: { primary: '#22c55e', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#ec060b', secondary: '#fff' },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
