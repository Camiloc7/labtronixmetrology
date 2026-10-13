'use client';
import { useEffect } from 'react';
import PublicNavbar from '@/components/layout/PublicNavbar';
import PublicFooter from '@/components/layout/PublicFooter';
import { siteConfig } from '@/lib/site';
import { WhatsappLogo } from '@phosphor-icons/react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    image: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address,
      addressLocality: 'Bogotá',
      addressCountry: 'CO',
    },
    areaServed: { '@type': 'Country', name: 'Colombia' },
    sameAs: Object.values(siteConfig.social),
  };

  useEffect(() => {
    // Forzar tema claro en el portal público para máxima legibilidad y estética corporativa
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <div className="font-sans bg-slate-50 text-slate-900 min-h-screen flex flex-col selection:bg-brand selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      <a
        href="https://wa.me/573160249528?text=Hola%20Labtronix%2C%20quiero%20solicitar%20informaci%C3%B3n%20sobre%20sus%20servicios."
        target="_blank"
        rel="noreferrer"
        aria-label="Contactar a Labtronix por WhatsApp"
        className="fixed right-5 bottom-5 z-50 w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-[0_10px_35px_rgba(16,185,129,0.45)] hover:-translate-y-1 transition-all"
      >
        <WhatsappLogo size={30} weight="fill" />
      </a>
    </div>
  );
}
