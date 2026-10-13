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
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-950 antialiased selection:bg-brand selection:text-white">
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
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-[0_10px_28px_rgba(236,6,11,.28)] transition hover:-translate-y-1 hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <WhatsappLogo size={25} weight="fill" />
      </a>
    </div>
  );
}
