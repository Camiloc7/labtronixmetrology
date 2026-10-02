'use client';
import { useEffect } from 'react';
import './public.css';
import Link from 'next/link';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  // Ensure we can have a cool dark mode by default for the public site
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="public-layout">
      {/* Public Navbar */}
      <nav className="public-nav">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <span className="logo-accent">Lab</span>tronix
          </Link>
          <div className="nav-links">
            <Link href="#servicios" className="nav-link">Servicios</Link>
            <Link href="#productos" className="nav-link">Productos</Link>
            <Link href="#nosotros" className="nav-link">Nosotros</Link>
            <Link href="/login" className="nav-btn-primary">Acceso Clientes</Link>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      {/* Public Footer */}
      <footer className="public-footer">
        <div className="footer-container">
          <div className="footer-col">
            <div className="footer-logo">Labtronix</div>
            <p>Confianza y exactitud en cada calibración. Más de 10 años asegurando la calidad de tus procesos.</p>
          </div>
          <div className="footer-col">
            <h4>Enlaces Rápidos</h4>
            <Link href="#servicios">Servicios de Calibración</Link>
            <Link href="#productos">Catálogo de Equipos</Link>
            <Link href="/dashboard">Portal de Clientes</Link>
          </div>
          <div className="footer-col">
            <h4>Contacto</h4>
            <p>Email: contacto@labtronix.com.co</p>
            <p>Teléfono: +57 300 000 0000</p>
            <p>Bogotá, Colombia</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Labtronix Metrology SAS. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
