import Link from 'next/link';
import Image from 'next/image';
import { 
  Envelope, 
  Phone,
  MapPin, 
  ShieldCheck, 
  Clock, 
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  ArrowUpRight 
} from '@phosphor-icons/react/dist/ssr';

export default function PublicFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-16 pb-12 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[150px] bg-brand/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm">
                <Image 
                  src="/logo.png" 
                  alt="Labtronix Metrology" 
                  width={34} 
                  height={34} 
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white flex items-center">
                  LABTRONIX<span className="text-brand ml-0.5">.</span>
                </span>
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block -mt-1">
                  Metrology S.A.S.
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              Laboratorio de Metrología con acreditación ONAC bajo la norma ISO/IEC 17025:2017. 
              Servicios de calibración de alta exactitud y comercialización de equipamiento de medición industrial.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <ShieldCheck size={18} weight="fill" className="text-brand-light" />
              <span>Acreditación ONAC Código <strong>21-LAC-011</strong></span>
            </div>
            <div className="flex items-center gap-2">
              {[
                { href: 'https://www.facebook.com/LabtronixMetrology', label: 'Facebook', icon: <FacebookLogo size={18} weight="fill" /> },
                { href: 'https://www.linkedin.com/in/labtronix-metrology-sas-28bba8244/', label: 'LinkedIn', icon: <LinkedinLogo size={18} weight="fill" /> },
                { href: 'https://www.instagram.com/labtronix_metrologysas/', label: 'Instagram', icon: <InstagramLogo size={18} weight="bold" /> },
              ].map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand transition-colors">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/#servicios" className="hover:text-white transition-colors flex items-center gap-1">
                  Servicios de Calibración
                </Link>
              </li>
              <li>
                <Link href="/#productos" className="hover:text-white transition-colors flex items-center gap-1">
                  Equipamiento y Balanzas
                </Link>
              </li>
              <li>
                <Link href="/#acreditacion" className="hover:text-white transition-colors flex items-center gap-1">
                  Acreditación ONAC
                </Link>
              </li>
              <li>
                <Link href="/sobre-nosotros" className="hover:text-white transition-colors flex items-center gap-1">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-brand-light hover:text-white font-semibold transition-colors flex items-center gap-1">
                  Portal de Clientes
                  <ArrowUpRight size={14} weight="bold" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Magnitudes */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Magnitudes
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="hover:text-white transition-colors">Masa y Balanzas (ONAC)</li>
              <li className="hover:text-white transition-colors">Temperatura y Humedad</li>
              <li className="hover:text-white transition-colors">Presión y Vacío</li>
              <li className="hover:text-white transition-colors">Volumen y Vidriería</li>
              <li className="hover:text-white transition-colors">Dimensional y Longitud</li>
              <li className="hover:text-white transition-colors">Tiempo y Frecuencia</li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">
              Contacto
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin size={18} weight="duotone" className="text-brand-light shrink-0 mt-0.5" />
                <span className="text-slate-300">Calle 69 B #90B-48, oficina 202<br />Bogotá D.C.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={18} weight="duotone" className="text-brand-light shrink-0" />
                <a href="tel:+573125730305" className="text-slate-300 hover:text-white transition-colors">+57 312 573 0305</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Envelope size={18} weight="duotone" className="text-brand-light shrink-0" />
                <a href="mailto:comercial1@labtronix.com.co" className="text-slate-300 hover:text-white transition-colors break-all">
                  comercial1@labtronix.com.co
                </a>
              </div>
              <div className="flex items-start gap-2.5 pt-2">
                <Clock size={18} weight="duotone" className="text-brand-light shrink-0 mt-0.5" />
                <div className="text-xs text-slate-400">
                  <span className="block font-medium text-slate-300">Lunes a Viernes</span>
                  8:00 AM - 5:30 PM
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} Labtronix Metrology S.A.S. Todos los derechos reservados.</p>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Sistemas Operativos 24/7
            </span>
            <Link href="/login" className="hover:text-white transition-colors">
              Intranet Corporativa
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
