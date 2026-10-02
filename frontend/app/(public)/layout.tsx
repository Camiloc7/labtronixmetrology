'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  // Aseguramos que inicie sin la clase dark
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  return (
    <div className="font-sans bg-slate-50 text-slate-900 min-h-screen overflow-x-hidden selection:bg-sky-500/30 transition-colors duration-300">
      {/* Public Navbar */}
      <nav className="fixed top-0 left-0 w-full h-20 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-full flex justify-between items-center">
          <Link href="/" className="font-bold text-2xl tracking-tight flex items-center gap-1">
            <span className="text-sky-600">Lab</span>tronix
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <Link href="#servicios" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors relative group">
              Servicios
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 transition-all group-hover:w-full"></span>
            </Link>
            <Link href="#productos" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors relative group">
              Productos
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 transition-all group-hover:w-full"></span>
            </Link>
            <Link href="#nosotros" className="text-sm font-semibold text-slate-600 hover:text-sky-600 transition-colors relative group">
              Nosotros
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 transition-all group-hover:w-full"></span>
            </Link>
            <Link href="/login" className="bg-gradient-to-br from-blue-600 to-sky-500 text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-[0_4px_15px_rgba(14,165,233,0.2)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(14,165,233,0.35)] transition-all">
              Acceso Clientes
            </Link>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      {/* Public Footer */}
      <footer className="border-t border-slate-200 bg-white pt-16 pb-8 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="font-bold text-2xl mb-4 text-slate-900">Labtronix</div>
            <p className="text-slate-600 text-sm max-w-sm">Confianza y exactitud en cada calibración. Más de 10 años asegurando la calidad de tus procesos industriales.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Enlaces Rápidos</h4>
            <div className="flex flex-col gap-3">
              <Link href="#servicios" className="text-slate-600 hover:text-sky-600 font-medium text-sm transition-colors">Servicios de Calibración</Link>
              <Link href="#productos" className="text-slate-600 hover:text-sky-600 font-medium text-sm transition-colors">Catálogo de Equipos</Link>
              <Link href="/dashboard" className="text-slate-600 hover:text-sky-600 font-medium text-sm transition-colors">Portal de Clientes</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-6">Contacto</h4>
            <div className="flex flex-col gap-3 text-sm text-slate-600 font-medium">
              <p>contacto@labtronix.com.co</p>
              <p>+57 300 000 0000</p>
              <p>Bogotá, Colombia</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 text-center text-slate-500 text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} Labtronix Metrology SAS. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
