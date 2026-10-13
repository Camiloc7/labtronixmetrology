import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Envelope, FacebookLogo, InstagramLogo, LinkedinLogo, MapPin, Phone } from '@phosphor-icons/react/dist/ssr';

const links = [
  ['/servicios', 'Servicios de calibración'],
  ['/acreditacion', 'Acreditación ONAC'],
  ['/equipos', 'Equipos e instrumentación'],
  ['/sobre-nosotros', 'Sobre Labtronix'],
];

export default function PublicFooter() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-20 sm:px-8 sm:pt-24 lg:px-10">
        <div className="grid gap-14 border-b border-slate-800 pb-16 lg:grid-cols-[1.2fr_.65fr_.85fr] lg:gap-20">
          <div>
            <Image src="/images/original/labtronix-logo.png" alt="Labtronix Metrology" width={210} height={60} className="h-auto w-[190px] brightness-0 invert" />
            <p className="mt-7 max-w-md text-base leading-7 text-slate-300">
              Servicios metrológicos y equipamiento de medición para organizaciones que necesitan resultados trazables y decisiones confiables.
            </p>
            <div className="mt-8 inline-flex border-l-2 border-brand pl-4">
              <div><p className="text-xs font-bold uppercase tracking-[.14em] text-red-400">Laboratorio acreditado</p><p className="mt-1 text-sm text-slate-300">ONAC 21-LAC-011 · ISO/IEC 17025:2017</p></div>
            </div>
          </div>

          <nav aria-label="Navegación del pie de página">
            <h2 className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">Explorar</h2>
            <ul className="mt-7 space-y-4">{links.map(([href, label]) => <li key={href}><Link href={href} className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white">{label}<ArrowRight size={14} className="text-brand" /></Link></li>)}</ul>
          </nav>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[.16em] text-slate-500">Contacto</h2>
            <div className="mt-7 space-y-5">
              <div className="flex gap-3"><MapPin size={19} className="mt-0.5 shrink-0 text-brand" /><p className="text-sm leading-6 text-slate-300">Calle 69 B #90B-48, oficina 202<br />Bogotá D.C., Colombia</p></div>
              <div className="flex gap-3"><Phone size={19} className="shrink-0 text-brand" /><div><a href="tel:+573125730305" className="block text-sm text-slate-300 hover:text-white">+57 312 573 0305</a><a href="https://wa.me/573160249528" className="mt-1 block text-sm text-slate-400 hover:text-white">WhatsApp +57 316 024 9528</a></div></div>
              <div className="flex gap-3"><Envelope size={19} className="shrink-0 text-brand" /><a href="mailto:comercial1@labtronix.com.co" className="break-all text-sm text-slate-300 hover:text-white">comercial1@labtronix.com.co</a></div>
              <p className="border-t border-slate-800 pt-5 text-xs leading-5 text-slate-400">Lunes a viernes<br /><span className="text-slate-300">8:00 a. m. – 5:30 p. m.</span></p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-500">© {new Date().getFullYear()} Labtronix Metrology S.A.S. Todos los derechos reservados.</p>
          <div className="flex items-center gap-3">
            {[
              ['https://www.facebook.com/LabtronixMetrology', 'Facebook', FacebookLogo],
              ['https://www.linkedin.com/in/labtronix-metrology-sas-28bba8244/', 'LinkedIn', LinkedinLogo],
              ['https://www.instagram.com/labtronix_metrologysas/', 'Instagram', InstagramLogo],
            ].map(([href, label, Icon]) => {
              const SocialIcon = Icon as typeof FacebookLogo;
              return <a key={String(label)} href={String(href)} target="_blank" rel="noreferrer" aria-label={String(label)} className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-800 text-slate-400 transition hover:border-brand hover:text-white"><SocialIcon size={18} /></a>;
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
