import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Compass,
  Drop,
  Gauge,
  Lightning,
  Ruler,
  Scales,
  ShieldCheck,
  Thermometer,
} from '@phosphor-icons/react/dist/ssr';
import { ButtonLink, Container, CtaBand, Eyebrow, PageHero, Section, SectionHeading } from '@/components/public/ui';

export const metadata: Metadata = {
  title: 'Servicios de calibración trazables y acreditados | Labtronix',
  description:
    'Calibración acreditada ONAC en balanzas y básculas, y calibración trazable en pesas patrón, temperatura, humedad, presión, volumen, eléctrica, tiempo y longitud.',
  alternates: { canonical: '/servicios' },
};

// Servicios Trazables con Fotos Reales (Captura 1)
const featuredTraceable = [
  {
    title: 'CALIBRACIÓN DE TERMOHIGRÓMETROS',
    desc: 'Calibración trazable para termohigrómetros analógicos y digitales utilizados en cuartos fríos, bodegas de almacenamiento farmacéutico y laboratorios.',
    image: '/images/original/termohigrometros.jpg',
    category: 'Temperatura y Humedad',
  },
  {
    title: 'CALIBRACIÓN DE TERMÓMETROS DE CONTACTO',
    desc: 'Calibración con trazabilidad documentada para termómetros digitales, sondas termopares, PT100 y termómetros de inmersión para control de procesos.',
    image: '/images/original/termometros-contacto.jpg',
    category: 'Temperatura',
  },
  {
    title: 'CALIBRACIÓN DE PESAS M1',
    desc: 'Calibración de patrones de masa individuales y juegos de pesas en acero inoxidable o fundición clase M1 para verificación y ajuste de balanzas.',
    image: '/images/original/pesas-m1.jpg',
    category: 'Masa y Pesaje',
  },
];

// Calibración de Pesas Patrón (Captura 3)
const weightsServices = [
  {
    title: 'CALIBRACIÓN DE JUEGO DE PESAS PATRÓN OIML CLASE E2',
    desc: 'Calibración de masas patrón OIML E2, pesas individuales y juegos, en todo el rango comercial bajo condiciones ambientales estrictamente controladas.',
    badge: 'Alta Exactitud',
  },
  {
    title: 'CALIBRACIÓN DE PESAS PATRÓN INDIVIDUALES OIML CLASE F1',
    desc: 'Calibración de masas patrón individuales OIML F1, en todo el rango comercial para la verificación periódica de balanzas de precisión y analíticas.',
    badge: 'Uso en Laboratorios',
  },
  {
    title: 'CALIBRACIÓN DE PESAS PATRÓN OIML CLASE M1',
    desc: 'Calibración de masas patrón en acero inoxidable o fundición, individuales OIML M1 (5 kg, 10 kg, 20 kg y pesas paralelepípedas) para básculas industriales.',
    badge: 'Industrial y Pesaje',
  },
];

// Otros Servicios por Magnitud con listas exactas de equipos (Captura 2)
const otherServices = [
  {
    category: 'CALIBRACIÓN EN VOLUMEN',
    icon: Drop,
    items: ['Probetas', 'Buretas', 'Micropipetas (mono y multicanal)', 'Picnómetros', 'Dispensadores y matraces'],
  },
  {
    category: 'CALIBRACIÓN EN PRESIÓN',
    icon: Gauge,
    items: ['Manómetros analógicos y digitales', 'Vacuómetros', 'Diferencial de presión', 'Transmisores de presión'],
  },
  {
    category: 'ELÉCTRICA',
    icon: Lightning,
    items: ['Pinzas voltiamperimétricas', 'Multímetros digitales', 'Megómetros (medidores de aislamiento)', 'Otros instrumentos eléctricos'],
  },
  {
    category: 'CALIBRACIÓN EN LONGITUD',
    icon: Ruler,
    items: ['Pie de rey (calibradores)', 'Reglas graduadas', 'Micrómetros de exteriores e interiores', 'Cintas métricas y flexómetros', 'Comparadores de carátula'],
  },
  {
    category: 'CALIBRACIÓN EN TEMPERATURA Y HUMEDAD RELATIVA',
    icon: Thermometer,
    items: ['Termómetros de contacto y penetración', 'Termómetros infrarrojos', 'Termómetros ambientales', 'Bloques secos y baños térmicos', 'Termohigrómetros'],
  },
  {
    category: 'CALIBRACIÓN EN TIEMPO Y FRECUENCIA',
    icon: Clock,
    items: ['Tacómetros ópticos y de contacto', 'Cronómetros digitales', 'Temporizadores industriales', 'Estroboscopios'],
  },
  {
    category: 'CALIBRACIÓN EN MASA',
    icon: Scales,
    items: ['Pesas clase E, F, M', 'Pesas no normalizadas', 'Pesas ASTM (Clase 1 a 6)', 'Masas paralelepípedas'],
  },
];

export default function ServiciosPage() {
  return (
    <>
      <PageHero
        eyebrow="Servicios metrológicos integrales"
        title="Exactitud, trazabilidad y alcance para cada instrumento."
        lead="Labtronix Metrology SAS presta servicios de calibración acreditada y con trazabilidad a instrumentos de medición en magnitudes como masa y balanzas, temperatura, humedad, presión, volumen, longitud, eléctrica y tiempo, contando con personal calificado y brindando confianza en sus mediciones."
      >
        <ButtonLink href="/#contacto" arrow>Solicitar cotización</ButtonLink>
        <ButtonLink href="/acreditacion" variant="secondary">Ver alcance ONAC</ButtonLink>
      </PageHero>

      {/* ─── Servicio Acreditado ONAC (Principal) ─────────────── */}
      <Section tone="muted">
        <article className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white lg:grid-cols-12 shadow-sm">
          <div className="relative min-h-[300px] bg-slate-100 lg:col-span-5 lg:min-h-full">
            <Image
              src="/images/original/balanzas-alta-exactitud.png"
              alt="Balanzas de alta exactitud calibradas por Labtronix"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-contain p-6"
            />
          </div>
          <div className="p-7 sm:p-10 lg:col-span-7 lg:p-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 border border-brand/20 px-3 py-1 text-xs font-bold text-brand">
              <ShieldCheck size={16} weight="fill" /> ACREDITACIÓN VIGENTE ONAC 21-LAC-011
            </div>
            <div className="mt-5 flex items-center gap-3">
              <Scales size={32} weight="duotone" className="text-brand" />
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
                Calibración de Básculas y Balanzas
              </h2>
            </div>
            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Calibración acreditada bajo la norma internacional <strong className="text-slate-900">ISO/IEC 17025:2017</strong> para instrumentos de pesaje de funcionamiento no automático, desde microbalanzas analíticas hasta básculas industriales de 2.000 kg.
            </p>
            <dl className="mt-7 grid max-w-lg grid-cols-2 border-t border-slate-200 pt-5">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Alcance Acreditado</dt>
                <dd className="mt-1 font-mono text-lg font-bold text-slate-950">Hasta 2.000 kg</dd>
              </div>
              <div className="border-l border-slate-200 pl-6">
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">Clases de Exactitud</dt>
                <dd className="mt-1 font-mono text-lg font-bold text-slate-950">I, II, III y IIII</dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink href="/#contacto" arrow>Cotizar calibración</ButtonLink>
              <ButtonLink href="/acreditacion" variant="secondary">Consultar certificado ONAC</ButtonLink>
            </div>
          </div>
        </article>
      </Section>

      {/* ─── Servicios Trazables con Fotos Reales (Captura 1) ─── */}
      <Section id="trazables" className="bg-white">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">TRAZABILIDAD METROLÓGICA</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            SERVICIOS TRAZABLES
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Procedimientos rigurosos con patrones calibrados contra institutos nacionales de metrología como el INM de Colombia y el PTB de Alemania.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTraceable.map((item) => (
            <article
              key={item.title}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
            >
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <span className="absolute top-3 left-3 rounded-full bg-slate-950/70 backdrop-blur px-3 py-1 text-[11px] font-semibold text-white">
                  {item.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                <div>
                  <h3 className="text-base font-bold uppercase tracking-tight text-slate-950 group-hover:text-brand transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-6 pt-5 border-t border-slate-100">
                  <Link
                    href="/#contacto"
                    className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-dark"
                  >
                    Cotizar este servicio <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* ─── Calibración de Pesas Patrón (Captura 3) ───────────── */}
      <Section tone="muted" className="border-y border-slate-200">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <Eyebrow>Patrones de Referencia</Eyebrow>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              CALIBRACIÓN DE PESAS PATRÓN
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed sm:text-lg">
              Ofrecemos calibración metrológica con trazabilidad documentada para masas individuales y juegos completos de pesas bajo la recomendación internacional OIML R 111.
            </p>

            <div className="mt-8 space-y-4">
              {weightsServices.map((ws) => (
                <div
                  key={ws.title}
                  className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition-all hover:border-brand/30"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-950 uppercase tracking-tight">
                      {ws.title}
                    </h3>
                    <span className="rounded-full bg-red-50 text-brand px-2.5 py-0.5 text-xs font-semibold">
                      {ws.badge}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {ws.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <ButtonLink href="/#contacto" arrow>
                Solicitar cotización de calibración de pesas
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white">
              <Image
                src="/images/original/pesas-m1.jpg"
                alt="Técnico metrólogo en procedimiento con pesas patrón"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 90vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="inline-block rounded bg-brand px-2.5 py-1 text-xs font-bold uppercase tracking-wider mb-2">
                  ISO/IEC 17025
                </span>
                <p className="text-base font-semibold leading-snug">
                  Garantía de exactitud y trazabilidad para tus auditorías.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── OTROS SERVICIOS: Clasificación por Magnitud (Captura 2) ─ */}
      <Section id="otros-servicios" className="bg-white">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">PORTAFOLIO MULTIMAGNITUD</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            OTROS SERVICIOS DE CALIBRACIÓN
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Detalle de instrumentos atendidos para responder a todas las necesidades técnicas y de mantenimiento de tu planta.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {otherServices.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.category}
                className={`group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-md ${
                  idx === 3 ? 'lg:col-span-1' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-brand">
                    <Icon size={24} weight="duotone" />
                  </div>
                  <h3 className="font-extrabold text-xs uppercase tracking-tight text-slate-900 leading-snug">
                    {cat.category}
                  </h3>
                </div>

                <ul className="mt-2 space-y-2 flex-1 border-t border-slate-100 pt-4">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    href="/#contacto"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-dark"
                  >
                    Cotizar magnitud <ArrowRight size={13} weight="bold" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <CtaBand
        title="¿Tienes un instrumento específico o requieres servicio in situ?"
        text="Envíanos el listado de tus equipos con marca, modelo, capacidad y lugar de servicio para enviarte una cotización formal detallada."
        href="/#contacto"
        label="Solicitar cotización técnica"
      />
    </>
  );
}
