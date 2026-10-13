'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  List, 
  X, 
  ShieldCheck, 
  SignIn, 
  Envelope, 
  WhatsappLogo,
  CaretRight
} from '@phosphor-icons/react';

export default function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Banner Notice */}
      <div className="bg-slate-950 px-4 py-2.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <Link href="/acreditacion" className="inline-flex items-center gap-1.5 font-semibold text-red-400">
              Acreditación ONAC 21-LAC-011
            </Link>
            <span className="hidden sm:inline text-slate-400">
              Norma ISO/IEC 17025:2017 &bull; Bogotá, Colombia
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-medium text-slate-300">
            <a href="https://wa.me/573160249528" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1 transition-colors">
              <WhatsappLogo size={14} weight="fill" className="text-red-400" />
              <span>+57 316 024 9528</span>
            </a>
            <a href="mailto:comercial1@labtronix.com.co" className="hover:text-white hidden md:flex items-center gap-1 transition-colors">
              <Envelope size={13} weight="bold" className="text-brand-light" />
              <span>comercial1@labtronix.com.co</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav 
        className={`sticky top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200 py-3'
            : 'bg-white border-b border-slate-200 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="group shrink-0">
              <Image
                src="/images/original/labtronix-logo.png"
                alt="Labtronix Metrology" 
                width={196}
                height={56}
                className="w-[156px] sm:w-[196px] h-auto object-contain group-hover:scale-[1.02] transition-transform"
                priority
              />
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-sm font-semibold text-slate-700 hover:text-brand transition-colors"
            >
              Inicio
            </Link>
            <Link 
              href="/servicios"
              className="text-sm font-semibold text-slate-700 hover:text-brand transition-colors"
            >
              Servicios
            </Link>
            <Link 
              href="/equipos"
              className="text-sm font-semibold text-slate-700 hover:text-brand transition-colors"
            >
              Equipos
            </Link>
            <Link 
              href="/acreditacion"
              className="text-sm font-semibold text-slate-700 hover:text-brand transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck size={16} weight="duotone" className="text-brand" />
              Acreditación ONAC
            </Link>
            <Link 
              href="/sobre-nosotros"
              className="text-sm font-semibold text-slate-700 hover:text-brand transition-colors"
            >
              Nosotros
            </Link>
            <Link 
              href="/#contacto" 
              className="text-sm font-semibold text-slate-700 hover:text-brand transition-colors"
            >
              Contacto
            </Link>
          </div>

          {/* CTA & Client Access */}
          <div className="hidden sm:flex items-center gap-3">
            <Link 
              href="/#contacto" 
              className="hidden xl:inline-flex min-h-11 items-center justify-center border border-slate-300 px-4 text-xs font-bold text-slate-800 transition-colors hover:border-slate-950"
            >
              Cotizar Calibración
            </Link>
            <Link 
              href="/login" 
              className="inline-flex min-h-11 items-center gap-2 bg-brand px-5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-dark"
            >
              <SignIn size={16} weight="bold" />
              <span>Portal Clientes</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link 
              href="/login" 
              className="inline-flex sm:hidden items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs text-white bg-brand"
            >
              <SignIn size={14} weight="bold" />
              <span>Portal</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-6 shadow-xl animate-in slide-in-from-top-4">
            <div className="flex flex-col gap-4 font-semibold text-slate-800">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 border-b border-slate-100 hover:text-brand"
              >
                <span>Inicio</span>
                <CaretRight size={16} className="text-slate-400" />
              </Link>
              <Link 
                href="/servicios"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 border-b border-slate-100 hover:text-brand"
              >
                <span>Servicios y Magnitudes</span>
                <CaretRight size={16} className="text-slate-400" />
              </Link>
              <Link 
                href="/equipos"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 border-b border-slate-100 hover:text-brand"
              >
                <span>Venta de Equipos</span>
                <CaretRight size={16} className="text-slate-400" />
              </Link>
              <Link 
                href="/acreditacion"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 border-b border-slate-100 hover:text-brand text-brand font-bold"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck size={18} weight="fill" />
                  Acreditación ONAC 17025
                </span>
                <CaretRight size={16} />
              </Link>
              <Link 
                href="/sobre-nosotros"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 border-b border-slate-100 hover:text-brand"
              >
                <span>Sobre Nosotros</span>
                <CaretRight size={16} className="text-slate-400" />
              </Link>
              <Link 
                href="/#contacto" 
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 border-b border-slate-100 hover:text-brand"
              >
                <span>Solicitar Cotización / Contacto</span>
                <CaretRight size={16} className="text-slate-400" />
              </Link>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-3">
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl font-bold text-center text-sm text-white bg-gradient-to-r from-brand to-brand-light shadow-md flex items-center justify-center gap-2"
              >
                <SignIn size={18} weight="bold" />
                Acceder al Portal Clientes
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
