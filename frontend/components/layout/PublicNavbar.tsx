'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Envelope, List, SignIn, WhatsappLogo, X } from '@phosphor-icons/react';

const NAV_LINKS = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/equipos', label: 'Equipos' },
  { href: '/acreditacion', label: 'Acreditación ONAC' },
  { href: '/sobre-nosotros', label: 'Nosotros' },
  { href: '/#contacto', label: 'Contacto' },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith('/#')) return false;
    return href === '/' ? pathname === '/' : pathname.startsWith(href);
  };

  return (
    <>
      {/* Barra de contacto */}
      <div className="bg-slate-950 text-slate-300">
        <div className="mx-auto flex min-h-10 w-full max-w-7xl items-center justify-between gap-4 px-5 text-xs sm:px-8 lg:px-10">
          <p className="flex items-center gap-2">
            <Link href="/acreditacion" className="font-semibold text-white hover:text-red-300">
              Acreditación ONAC 21-LAC-011
            </Link>
            <span className="hidden text-slate-500 sm:inline">·</span>
            <span className="hidden text-slate-400 sm:inline">ISO/IEC 17025:2017 · Bogotá, Colombia</span>
          </p>
          <div className="flex items-center gap-5">
            <a
              href="https://wa.me/573160249528"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-white"
            >
              <WhatsappLogo size={15} weight="fill" className="text-red-400" />
              <span>+57 316 024 9528</span>
            </a>
            <a
              href="mailto:comercial1@labtronix.com.co"
              className="hidden items-center gap-1.5 transition-colors hover:text-white md:flex"
            >
              <Envelope size={15} className="text-red-400" />
              <span>comercial1@labtronix.com.co</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navegación principal */}
      <nav
        aria-label="Navegación principal"
        className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
          isScrolled ? 'border-slate-200 shadow-[0_6px_24px_rgba(15,23,42,0.06)]' : 'border-slate-100'
        }`}
      >
        <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
          <Link href="/" className="shrink-0" aria-label="Labtronix Metrology, inicio">
            <Image
              src="/images/original/labtronix-logo.png"
              alt="Labtronix Metrology"
              width={196}
              height={56}
              className="h-auto w-[148px] sm:w-[172px]"
              priority
            />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative inline-flex min-h-11 items-center px-3 text-sm font-medium transition-colors after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:origin-left after:bg-brand after:transition-transform ${
                      active
                        ? 'text-slate-950 after:scale-x-100'
                        : 'text-slate-600 after:scale-x-0 hover:text-slate-950 hover:after:scale-x-100'
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/#contacto"
              className="hidden min-h-11 items-center rounded-md px-4 text-sm font-semibold text-slate-900 transition-colors hover:text-brand xl:inline-flex"
            >
              Cotizar calibración
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-brand px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <SignIn size={17} weight="bold" />
              Portal clientes
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-slate-800 transition-colors hover:bg-slate-50 lg:hidden"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div id="mobile-menu" className="border-t border-slate-100 bg-white lg:hidden">
            <ul className="mx-auto w-full max-w-7xl px-5 py-3 sm:px-8">
              {NAV_LINKS.map(({ href, label }) => {
                const active = isActive(href);
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={active ? 'page' : undefined}
                      className={`flex min-h-12 items-center border-b border-slate-100 text-base font-medium ${
                        active ? 'text-brand' : 'text-slate-800'
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mx-auto w-full max-w-7xl px-5 pb-6 pt-2 sm:hidden">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-brand text-sm font-semibold text-white"
              >
                <SignIn size={18} weight="bold" />
                Portal clientes
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
