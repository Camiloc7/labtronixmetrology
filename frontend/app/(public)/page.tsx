import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, FileText, Gauge, Medal, Ruler, Scales, ShieldCheck, Thermometer } from '@phosphor-icons/react/dist/ssr';
import ContactSection from '@/components/layout/ContactSection';

export const metadata: Metadata = {
  title: 'Laboratorio de calibración acreditado ONAC | Labtronix',
  description: 'Calibración acreditada de instrumentos de pesaje y servicios metrológicos para la industria colombiana. ONAC 21-LAC-011.',
  alternates: { canonical: '/' },
};

const services = [
  { icon: Scales, number: '01', title: 'Masa y pesaje', text: 'Calibración acreditada de balanzas e instrumentos de pesaje de funcionamiento no automático, desde alta exactitud hasta 2.000 kg.', image: '/images/original/balanzas.png', accredited: true },
  { icon: Thermometer, number: '02', title: 'Temperatura y humedad', text: 'Calibración de termómetros, termohigrómetros y equipos de medición ambiental para procesos controlados.', image: '/images/original/termohigrometros.jpg' },
  { icon: Gauge, number: '03', title: 'Presión y otras magnitudes', text: 'Soluciones para presión, volumen, dimensional, tiempo y frecuencia con trazabilidad documentada.', image: '/images/original/termometros-contacto.jpg' },
];

const process = [
  ['01', 'Cuéntanos qué necesitas', 'Identificamos equipo, magnitud, rango y lugar del servicio.'],
  ['02', 'Recibe una propuesta clara', 'Definimos alcance, tiempos y condiciones antes de iniciar.'],
  ['03', 'Calibramos y documentamos', 'Ejecutamos el servicio y entregamos el certificado trazable.'],
];

export default function LandingPage() {
  return (
    <main className="bg-white text-slate-950">
      <section className="border-b border-slate-200 bg-white py-12 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-16">
          <div className="flex items-center py-4 lg:py-10">
            <div className="max-w-3xl">
              <div className="mb-8 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-600"><span className="h-px w-10 bg-brand" />Metrología para decisiones confiables</div>
              <h1 className="max-w-3xl text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-5xl xl:text-[4rem]">Precisión que respalda <span className="text-brand">tu operación.</span></h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">Calibramos instrumentos de medición con competencia técnica, trazabilidad y atención especializada para laboratorios e industria en Colombia.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="#contacto" className="inline-flex min-h-12 items-center justify-center gap-2 bg-brand px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">Solicitar cotización <ArrowRight size={18} weight="bold" /></Link>
                <Link href="/servicios" className="inline-flex min-h-12 items-center justify-center border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-900 transition-colors hover:border-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950">Explorar servicios</Link>
              </div>
              <div className="mt-12 grid max-w-2xl grid-cols-1 gap-5 border-t border-slate-200 pt-7 sm:grid-cols-3">
                <div><strong className="block text-lg">21-LAC-011</strong><span className="text-sm text-slate-500">Código ONAC</span></div>
                <div><strong className="block text-lg">ISO/IEC 17025</strong><span className="text-sm text-slate-500">Competencia técnica</span></div>
                <div><strong className="block text-lg">Hasta 2.000 kg</strong><span className="text-sm text-slate-500">Alcance en pesaje</span></div>
              </div>
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden bg-slate-100 sm:min-h-[440px] lg:min-h-[540px]">
            <Image src="/images/original/pesas-m1.jpg" alt="Patrones de masa usados en calibración metrológica" fill priority sizes="(min-width: 1024px) 48vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
              <div className="max-w-sm border-l-4 border-brand bg-white p-5 shadow-lg"><div className="flex items-start gap-4"><ShieldCheck size={28} weight="fill" className="mt-0.5 shrink-0 text-brand" /><div><strong className="block text-sm">Calibración acreditada</strong><p className="mt-1 text-xs leading-5 text-slate-600">Reconocimiento ONAC e ILAC-MRA para pesaje no automático.</p></div></div></div>
            </div>
          </div>
        </div>
      </section>

      <section id="acreditacion" className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[.75fr_1.25fr] lg:items-center lg:py-16">
          <div className="flex items-center gap-4"><Medal size={44} weight="duotone" className="text-brand" /><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">Acreditación vigente</p><p className="mt-1 text-xl font-semibold">ONAC 21-LAC-011</p></div></div>
          <p className="border-l border-slate-300 pl-6 text-base leading-7 text-slate-600 lg:text-lg">Nuestro alcance acreditado demuestra competencia técnica bajo ISO/IEC 17025:2017 y aporta confianza internacional a los resultados de calibración.</p>
        </div>
      </section>

      <section id="servicios" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Capacidad técnica</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Medimos lo que sostiene tu calidad.</h2></div>
          <p className="max-w-2xl text-base leading-7 text-slate-600 lg:justify-self-end">Servicios pensados para responsables de calidad, mantenimiento y producción que necesitan resultados claros, tiempos definidos y soporte experto.</p>
        </div>
        <div className="mt-14 border-t border-slate-300">
          {services.map((service) => { const Icon = service.icon; return (
            <article key={service.title} className="group grid gap-6 border-b border-slate-300 py-8 sm:grid-cols-[56px_1fr_160px] sm:items-center lg:grid-cols-[72px_1fr_1.2fr_210px]">
              <span className="font-mono text-sm text-slate-400">{service.number}</span>
              <div className="flex items-center gap-4"><Icon size={30} weight="duotone" className="shrink-0 text-brand" /><h3 className="text-xl font-semibold sm:text-2xl">{service.title}</h3></div>
              <p className="text-sm leading-6 text-slate-600 sm:col-start-2 lg:col-start-auto lg:text-base lg:leading-7">{service.text}</p>
              <div className="relative hidden h-28 overflow-hidden bg-slate-100 sm:block"><Image src={service.image} alt="" fill sizes="210px" className="object-cover transition-transform duration-500 group-hover:scale-105" />{service.accredited && <span className="absolute bottom-2 left-2 bg-brand px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">Acreditado</span>}</div>
            </article>
          ); })}
        </div>
        <Link href="/servicios" className="mt-10 inline-flex min-h-12 items-center gap-2 border-b-2 border-brand text-sm font-bold text-slate-950">Ver todas las magnitudes <ArrowRight size={18} weight="bold" /></Link>
      </section>

      <section id="productos" className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <div className="relative min-h-[420px] lg:min-h-[620px]"><Image src="/images/equipment_scale_1790955120303.jpg" alt="Balanza de precisión para laboratorio" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /><div className="absolute inset-0 bg-slate-950/20" /></div>
          <div className="flex items-center px-5 py-16 sm:px-10 sm:py-20 lg:px-16"><div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-400">Equipamiento de medición</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">El equipo correcto, respaldado técnicamente.</h2>
            <p className="mt-6 text-base leading-7 text-slate-300">Suministramos balanzas, básculas y soluciones de medición con acompañamiento para seleccionar, instalar y mantener cada equipo.</p>
            <ul className="mt-8 space-y-4 text-sm text-slate-200">{['Selección según proceso y exactitud requerida', 'Calibración e instalación coordinadas', 'Soporte técnico después de la compra'].map((item) => <li key={item} className="flex gap-3"><Check size={19} weight="bold" className="shrink-0 text-red-400" />{item}</li>)}</ul>
            <Link href="/equipos" className="mt-9 inline-flex min-h-12 items-center gap-2 border-b-2 border-brand pb-2 text-sm font-bold text-white transition-colors hover:text-red-300">Ver equipos y soluciones <ArrowRight size={18} weight="bold" /></Link>
          </div></div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Así trabajamos</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">Un proceso claro de principio a fin.</h2><p className="mt-5 text-base leading-7 text-slate-600">Tres etapas, un responsable técnico y visibilidad sobre lo que ocurrirá con tus instrumentos.</p></div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">{process.map(([number, title, text]) => <div key={number} className="border-t-2 border-slate-950 bg-white p-7 sm:p-8"><span className="font-mono text-sm text-brand">{number}</span><h3 className="mt-10 text-xl font-semibold">{title}</h3><p className="mt-4 text-sm leading-6 text-slate-600">{text}</p></div>)}</div>
          <div className="mt-12 grid gap-5 border-t border-slate-300 pt-8 sm:grid-cols-3">
            <div className="flex items-center gap-3"><FileText size={24} className="text-brand" /><span className="text-sm font-semibold">Certificados digitales trazables</span></div>
            <div className="flex items-center gap-3"><Ruler size={24} className="text-brand" /><span className="text-sm font-semibold">Servicio en laboratorio e in situ</span></div>
            <div className="flex items-center gap-3"><ShieldCheck size={24} className="text-brand" /><span className="text-sm font-semibold">Acompañamiento técnico especializado</span></div>
          </div>
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
