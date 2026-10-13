import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  FileText,
  Gauge,
  Medal,
  Ruler,
  Scales,
  ShieldCheck,
  Thermometer,
} from '@phosphor-icons/react/dist/ssr';
import ContactSection from '@/components/layout/ContactSection';
import { ButtonLink, Container, Eyebrow, Section, SectionHeading } from '@/components/public/ui';

export const metadata: Metadata = {
  title: 'Laboratorio de calibración acreditado ONAC | Labtronix',
  description:
    'Calibración acreditada de instrumentos de pesaje y servicios metrológicos para la industria colombiana. ONAC 21-LAC-011.',
  alternates: { canonical: '/' },
};

const stats = [
  { value: '21-LAC-011', label: 'Código de acreditación ONAC' },
  { value: 'ISO/IEC 17025', label: 'Competencia técnica demostrada' },
  { value: 'Hasta 2.000 kg', label: 'Alcance acreditado en pesaje' },
];

const secondaryServices = [
  {
    icon: Thermometer,
    title: 'Temperatura y humedad',
    text: 'Calibración de termómetros, termohigrómetros y equipos de medición ambiental para procesos controlados.',
    image: '/images/original/termohigrometros.jpg',
  },
  {
    icon: Gauge,
    title: 'Presión y otras magnitudes',
    text: 'Soluciones para presión, volumen, dimensional, tiempo y frecuencia con trazabilidad documentada.',
    image: '/images/original/termometros-contacto.jpg',
  },
];

const process = [
  { n: '01', title: 'Cuéntanos qué necesitas', text: 'Identificamos equipo, magnitud, rango y lugar del servicio.' },
  { n: '02', title: 'Recibe una propuesta clara', text: 'Definimos alcance, tiempos y condiciones antes de iniciar.' },
  { n: '03', title: 'Calibramos y documentamos', text: 'Ejecutamos el servicio y entregamos el certificado trazable.' },
];

export default function LandingPage() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-24">
          <div className="lg:col-span-6">
            <Eyebrow>Metrología para decisiones confiables</Eyebrow>
            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.03] tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-[4.25rem]">
              Precisión que respalda <span className="text-brand">tu operación.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
              Calibramos instrumentos de medición con competencia técnica, trazabilidad y atención especializada para
              laboratorios e industria en Colombia.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#contacto" arrow>
                Solicitar cotización
              </ButtonLink>
              <ButtonLink href="/servicios" variant="secondary">
                Explorar servicios
              </ButtonLink>
            </div>

            <dl className="mt-14 grid grid-cols-1 border-t border-slate-200 sm:grid-cols-3">
              {stats.map((stat, i) => (
                <div
                  key={stat.value}
                  className={`flex flex-col py-5 sm:py-6 ${i > 0 ? 'border-t border-slate-200 sm:border-l sm:border-t-0 sm:pl-6' : ''} ${
                    i < stats.length - 1 ? 'sm:pr-6' : ''
                  }`}
                >
                  <dt className="order-2 mt-1 text-sm text-slate-500">{stat.label}</dt>
                  <dd className="order-1 text-lg font-semibold tracking-tight text-slate-950">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-6 lg:pl-6">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-slate-100 sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src="/images/original/pesas-m1.jpg"
                  alt="Técnico de Labtronix calibrando una balanza con una pesa patrón"
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              {/* Detalle de marca: escuadra roja */}
              <span aria-hidden="true" className="absolute -left-3 -top-3 h-16 w-16 border-l-4 border-t-4 border-brand" />
              <div className="absolute -bottom-6 left-4 right-4 rounded-md border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.14)] sm:left-auto sm:right-6 sm:max-w-xs">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={26} weight="fill" className="mt-0.5 shrink-0 text-brand" />
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Calibración acreditada</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Reconocimiento ONAC e ILAC-MRA para pesaje no automático.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Acreditación ────────────────────────────────────── */}
      <section id="acreditacion" className="scroll-mt-24 border-b border-slate-200 bg-slate-50">
        <Container className="grid gap-8 py-12 sm:py-14 lg:grid-cols-12 lg:items-center">
          <div className="flex items-center gap-4 lg:col-span-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-white text-brand ring-1 ring-slate-200">
              <Medal size={30} weight="duotone" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Acreditación vigente</p>
              <p className="mt-1 text-xl font-semibold tracking-tight text-slate-950">ONAC 21-LAC-011</p>
            </div>
          </div>
          <p className="text-base leading-7 text-slate-600 lg:col-span-6 lg:border-l lg:border-slate-300 lg:pl-8">
            Nuestro alcance acreditado demuestra competencia técnica bajo ISO/IEC 17025:2017 y aporta confianza
            internacional a los resultados de calibración.
          </p>
          <div className="lg:col-span-2 lg:text-right">
            <ButtonLink href="/acreditacion" variant="link" arrow>
              Ver alcance
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* ─── Servicios ───────────────────────────────────────── */}
      <Section id="servicios">
        <SectionHeading
          align="split"
          eyebrow="Capacidad técnica"
          title="Medimos lo que sostiene tu calidad."
          lead="Servicios pensados para responsables de calidad, mantenimiento y producción que necesitan resultados claros, tiempos definidos y soporte experto."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          {/* Servicio principal: acreditado */}
          <article className="group relative flex min-h-[460px] flex-col justify-end overflow-hidden rounded-lg bg-slate-950 lg:col-span-7 lg:min-h-[560px]">
            <Image
              src="/images/original/balanzas.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover opacity-70 transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/0" />
            <div className="relative p-7 text-white sm:p-10">
              <span className="inline-flex items-center gap-2 rounded-sm bg-brand px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider">
                <ShieldCheck size={14} weight="fill" /> Acreditado ONAC
              </span>
              <div className="mt-5 flex items-center gap-3">
                <Scales size={30} weight="duotone" className="text-red-400" />
                <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">Masa y pesaje</h3>
              </div>
              <p className="mt-4 max-w-lg text-base leading-7 text-slate-200">
                Calibración acreditada de balanzas e instrumentos de pesaje de funcionamiento no automático, desde alta
                exactitud hasta 2.000 kg.
              </p>
              <Link
                href="/#contacto"
                className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white underline decoration-brand decoration-2 underline-offset-[6px] hover:text-red-300"
              >
                Cotizar calibración <ArrowRight size={16} weight="bold" />
              </Link>
            </div>
          </article>

          {/* Servicios secundarios */}
          <div className="grid gap-6 lg:col-span-5">
            {secondaryServices.map(({ icon: Icon, title, text, image }) => (
              <article
                key={title}
                className="group grid overflow-hidden rounded-lg border border-slate-200 bg-white transition-colors hover:border-slate-300 sm:grid-cols-[180px_1fr] lg:grid-cols-1 xl:grid-cols-[170px_1fr]"
              >
                <div className="relative h-44 bg-slate-100 sm:h-auto lg:h-40 xl:h-auto">
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 170px, (min-width: 1024px) 40vw, 180px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 sm:p-7">
                  <Icon size={26} weight="duotone" className="text-brand" />
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <ButtonLink href="/servicios" variant="link" arrow>
            Ver todas las magnitudes
          </ButtonLink>
        </div>
      </Section>

      {/* ─── Equipos ─────────────────────────────────────────── */}
      <section id="productos" className="scroll-mt-24 bg-slate-950 text-white">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-2">
          <div className="relative min-h-[360px] sm:min-h-[460px] lg:min-h-[640px]">
            <Image
              src="/images/equipment_scale_1790955120303.jpg"
              alt="Balanza de precisión para laboratorio"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex items-center px-5 py-16 sm:px-10 sm:py-20 lg:px-16 xl:px-20">
            <div className="max-w-xl">
              <Eyebrow dark>Equipamiento de medición</Eyebrow>
              <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-4xl lg:text-[2.75rem]">
                El equipo correcto, respaldado técnicamente.
              </h2>
              <p className="mt-6 text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                Suministramos balanzas, básculas y soluciones de medición con acompañamiento para seleccionar, instalar y
                mantener cada equipo.
              </p>
              <ul className="mt-9 divide-y divide-white/10 border-y border-white/10">
                {[
                  'Selección según proceso y exactitud requerida',
                  'Calibración e instalación coordinadas',
                  'Soporte técnico después de la compra',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 py-4 text-sm text-slate-200 sm:text-base">
                    <Check size={18} weight="bold" className="shrink-0 text-red-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <ButtonLink href="/equipos" variant="ghost-dark" arrow>
                  Ver equipos y soluciones
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Proceso ─────────────────────────────────────────── */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Así trabajamos"
          title="Un proceso claro de principio a fin."
          lead="Tres etapas, un responsable técnico y visibilidad sobre lo que ocurrirá con tus instrumentos."
        />

        <ol className="mt-14 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 md:grid-cols-3">
          {process.map((step) => (
            <li key={step.n} className="bg-white p-7 sm:p-9">
              <span className="font-mono text-4xl font-semibold text-brand/90">{step.n}</span>
              <h3 className="mt-8 text-xl font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">{step.text}</p>
            </li>
          ))}
        </ol>

        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            { icon: FileText, label: 'Certificados digitales trazables' },
            { icon: Ruler, label: 'Servicio en laboratorio e in situ' },
            { icon: ShieldCheck, label: 'Acompañamiento técnico especializado' },
          ].map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3 text-sm font-medium text-slate-800">
              <Icon size={22} weight="duotone" className="shrink-0 text-brand" />
              {label}
            </li>
          ))}
        </ul>
      </Section>

      <ContactSection />
    </>
  );
}
