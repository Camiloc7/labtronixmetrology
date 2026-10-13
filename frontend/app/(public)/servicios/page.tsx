import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock, Flask, Gauge, Ruler, Scales, Thermometer } from '@phosphor-icons/react/dist/ssr';

export const metadata: Metadata = { title: 'Servicios de calibración | Labtronix', description: 'Servicios de calibración para masa, temperatura, humedad, presión, volumen, dimensional, tiempo, frecuencia y variables eléctricas.', alternates: { canonical: '/servicios' } };

const services = [
  { icon: Scales, title: 'Masa y balanzas', badge: 'Acreditado ONAC', text: 'Calibración de balanzas analíticas, semianalíticas, de precisión, básculas y pesas patrón clases E2, F1, F2 y M1, de 0 g a 2.000 kg.' },
  { icon: Thermometer, title: 'Temperatura y humedad', text: 'Caracterización y calibración de termómetros digitales, termohigrómetros, cuartos fríos, hornos, incubadoras, autoclaves y baños termostáticos.' },
  { icon: Gauge, title: 'Presión y vacío', text: 'Calibración de manómetros análogos y digitales, transmisores de presión, presostatos y vacuómetros en un amplio rango de operación.' },
  { icon: Flask, title: 'Volumen y vidriería', text: 'Calibración gravimétrica de micropipetas monocanal y multicanal, dispensadores, buretas digitales y material de vidrio volumétrico.' },
  { icon: Ruler, title: 'Longitud y dimensional', text: 'Calibración de calibradores pie de rey, micrómetros de exteriores e interiores, comparadores de carátula y cintas métricas industriales.' },
  { icon: Clock, title: 'Tiempo, frecuencia y eléctrica', text: 'Calibración de cronómetros digitales, tacómetros ópticos o de contacto, multímetros y analizadores de parámetros eléctricos.' },
];

export default function ServiciosPage() {
  return <main className="bg-white text-slate-950">
    <header className="border-b border-slate-200 bg-slate-50"><div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28"><p className="text-xs font-bold uppercase tracking-[.16em] text-brand">Servicios metrológicos</p><h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-.04em] sm:text-6xl">Una solución técnica para cada magnitud.</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">Atendemos instrumentos en nuestro laboratorio y en las instalaciones del cliente, de acuerdo con el alcance y las condiciones del servicio.</p></div></header>
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24"><div className="border-t border-slate-300">{services.map((service, index) => { const Icon = service.icon; return <article key={service.title} className="grid gap-6 border-b border-slate-300 py-9 md:grid-cols-[64px_.7fr_1.3fr_auto] md:items-start"><span className="font-mono text-sm text-slate-400">0{index + 1}</span><div className="flex gap-4"><Icon size={30} weight="duotone" className="shrink-0 text-brand" /><div><h2 className="text-xl font-semibold">{service.title}</h2>{service.badge && <span className="mt-2 inline-block bg-brand px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">{service.badge}</span>}</div></div><p className="text-base leading-7 text-slate-600">{service.text}</p><Link href="/#contacto" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-brand">Cotizar <ArrowRight size={17} /></Link></article>; })}</div></section>
    <section className="bg-slate-950 text-white"><div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center"><div><h2 className="text-3xl font-semibold">¿No encuentras tu instrumento?</h2><p className="mt-3 text-slate-300">Envíanos su descripción, marca, modelo, rango y cantidad. Nuestro equipo confirmará la capacidad técnica aplicable.</p></div><Link href="/#contacto" className="inline-flex min-h-12 items-center justify-center gap-2 bg-brand px-6 text-sm font-bold">Consultar alcance <ArrowRight size={18} /></Link></div></section>
  </main>;
}
