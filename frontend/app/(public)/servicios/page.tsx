import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Flask, Gauge, Ruler, Scales, ShieldCheck, Thermometer } from '@phosphor-icons/react/dist/ssr';
import { ButtonLink, CtaBand, PageHero, Section, SectionHeading } from '@/components/public/ui';

export const metadata: Metadata = {
  title: 'Servicios de calibración | Labtronix',
  description:
    'Servicios de calibración para masa, temperatura, humedad, presión, volumen, dimensional, tiempo, frecuencia y variables eléctricas.',
  alternates: { canonical: '/servicios' },
};

const services = [
  { icon: Thermometer, title: 'Temperatura y humedad', text: 'Caracterización y calibración de termómetros digitales, termohigrómetros, cuartos fríos, hornos, incubadoras, autoclaves y baños termostáticos.' },
  { icon: Gauge, title: 'Presión y vacío', text: 'Calibración de manómetros análogos y digitales, transmisores de presión, presostatos y vacuómetros en un amplio rango de operación.' },
  { icon: Flask, title: 'Volumen y vidriería', text: 'Calibración gravimétrica de micropipetas monocanal y multicanal, dispensadores, buretas digitales y material de vidrio volumétrico.' },
  { icon: Ruler, title: 'Longitud y dimensional', text: 'Calibración de calibradores pie de rey, micrómetros de exteriores e interiores, comparadores de carátula y cintas métricas industriales.' },
  { icon: Clock, title: 'Tiempo, frecuencia y eléctrica', text: 'Calibración de cronómetros digitales, tacómetros ópticos o de contacto, multímetros y analizadores de parámetros eléctricos.' },
];

export default function ServiciosPage() {
  return (
    <>
      <PageHero
        eyebrow="Servicios metrológicos"
        title="Una solución técnica para cada magnitud."
        lead="Atendemos instrumentos en nuestro laboratorio y en las instalaciones del cliente, de acuerdo con el alcance y las condiciones del servicio."
      >
        <ButtonLink href="/#contacto" arrow>Solicitar cotización</ButtonLink>
        <ButtonLink href="/acreditacion" variant="secondary">Ver acreditación</ButtonLink>
      </PageHero>

      {/* Servicio acreditado destacado */}
      <Section tone="muted">
        <article className="grid overflow-hidden rounded-lg border border-slate-200 bg-white lg:grid-cols-12">
          <div className="relative min-h-[280px] bg-slate-100 lg:col-span-5 lg:min-h-full">
            <Image
              src="/images/original/balanzas-alta-exactitud.png"
              alt="Balanzas de alta exactitud calibradas por Labtronix"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="p-7 sm:p-10 lg:col-span-7 lg:p-14">
            <span className="inline-flex items-center gap-2 rounded-sm bg-brand px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
              <ShieldCheck size={14} weight="fill" /> Acreditado ONAC
            </span>
            <div className="mt-6 flex items-center gap-3">
              <Scales size={32} weight="duotone" className="text-brand" />
              <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Masa y balanzas</h2>
            </div>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Calibración de balanzas analíticas, semianalíticas, de precisión, básculas y pesas patrón clases E2, F1, F2 y
              M1, de 0 g a 2.000 kg.
            </p>
            <dl className="mt-8 grid max-w-lg grid-cols-2 border-t border-slate-200 pt-6">
              <div>
                <dt className="text-sm text-slate-500">Rango</dt>
                <dd className="mt-1 font-mono text-lg font-semibold">0 g – 2.000 kg</dd>
              </div>
              <div className="border-l border-slate-200 pl-6">
                <dt className="text-sm text-slate-500">Pesas patrón</dt>
                <dd className="mt-1 font-mono text-lg font-semibold">E2 · F1 · F2 · M1</dd>
              </div>
            </dl>
            <div className="mt-9">
              <ButtonLink href="/#contacto" arrow>Cotizar calibración</ButtonLink>
            </div>
          </div>
        </article>
      </Section>

      {/* Otras magnitudes */}
      <Section>
        <SectionHeading
          align="split"
          eyebrow="Otras magnitudes"
          title="Cobertura para todo tu parque de instrumentos."
          lead="Gestionamos calibraciones trazables para responder a las exigencias de cada proceso, en laboratorio o in situ."
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className="group flex flex-col bg-white p-7 transition-colors hover:bg-slate-50 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-md bg-red-50 text-brand">
                  <Icon size={26} weight="duotone" />
                </span>
                <span className="font-mono text-sm text-slate-400">0{index + 2}</span>
              </div>
              <h3 className="mt-7 text-xl font-semibold tracking-tight">{title}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">{text}</p>
              <Link
                href="/#contacto"
                className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand hover:text-brand-dark"
              >
                Cotizar <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </article>
          ))}
          {/* Celda de cierre para completar la cuadrícula */}
          <div className="flex flex-col justify-center bg-slate-950 p-7 text-white sm:p-8">
            <p className="text-lg font-semibold">¿Otra magnitud?</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">Cuéntanos qué instrumento necesitas y confirmamos la capacidad técnica.</p>
            <Link href="/#contacto" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-red-300 hover:text-white">
              Consultar <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>
      </Section>

      <CtaBand
        title="¿No encuentras tu instrumento?"
        text="Envíanos su descripción, marca, modelo, rango y cantidad. Nuestro equipo confirmará la capacidad técnica aplicable."
        label="Consultar alcance"
      />
    </>
  );
}
