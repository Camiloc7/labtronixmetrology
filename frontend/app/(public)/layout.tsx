'use client';
import { useEffect } from 'react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Forzar tema claro en el portal público para máxima legibilidad y estética corporativa
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <div className="font-sans bg-slate-50 text-slate-900 min-h-screen flex flex-col selection:bg-brand selection:text-white">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
