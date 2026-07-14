import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/hooks/useAuth';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Labtronix Metrología | Sistema de Gestión',
  description: 'Plataforma integral de gestión para laboratorio de metrología. Clientes, cotizaciones, equipos, órdenes de trabajo y más.',
  keywords: ['metrología', 'calibración', 'laboratorio', 'gestión', 'labtronix'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#ffffff',
                border: '1px solid #2a2a2a',
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
