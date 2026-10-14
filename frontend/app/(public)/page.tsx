import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Clock,
  Drop,
  FileText,
  Gauge,
  Lightning,
  Medal,
  Ruler,
  Scales,
  ShieldCheck,
  Thermometer,
} from '@phosphor-icons/react/dist/ssr';
import ContactSection from '@/components/layout/ContactSection';
import HomeHeroSlider from '@/components/public/HomeHeroSlider';
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

const primaryServices = [
  {
    id: 'basculas',
    title: 'BÁSCULAS',
    subtitle: 'Calibración con acreditación ONAC',
    description:
      'Calibración de instrumentos de pesaje de funcionamiento no automático, básculas camioneras, de plataforma y colgantes hasta 2.000 kg utilizadas en cualquier ámbito industrial.',
    image: '/images/original/basculas.png',
    scope: 'Hasta 2.000 kg',
    accredited: true,
  },
  {
    id: 'balanzas',
    title: 'BALANZAS',
    subtitle: 'Calibración con acreditación ONAC',
    description:
      'Calibración acreditada de balanzas de diferentes capacidades y exactitud para laboratorios de ensayo, control de calidad e investigación en todo el país.',
    image: '/images/original/balanzas.png',
    scope: 'Analíticas y de precisión',
    accredited: true,
  },
  {
    id: 'balanzas-alta-exactitud',
    title: 'BALANZAS DE ALTA EXACTITUD',
    subtitle: 'Calibración con acreditación ONAC',
    description:
      'Calibración con acreditación a instrumentos de pesaje de funcionamiento no automático y balanzas de alta exactitud, microbalanzas y semimicrobalanzas bajo estrictas condiciones.',
    image: '/images/original/balanzas-alta-exactitud.png',
    scope: 'Clase I y Clase II',
    accredited: true,
  },
];

// Servicios Trazables en la página principal con imágenes reales
const homeTraceableServices = [
  {
    title: 'CALIBRACIÓN DE TERMOHIGRÓMETROS',
    desc: 'Calibración trazable para termohigrómetros analógicos y digitales en cuartos fríos, bodegas y laboratorios.',
    image: '/images/original/termohigrometros.jpg',
  },
  {
    title: 'CALIBRACIÓN DE TERMÓMETROS DE CONTACTO',
    desc: 'Calibración trazable de termómetros digitales, sondas termopares y PT100 para control de procesos.',
    image: '/images/original/termometros-contacto.jpg',
  },
  {
    title: 'CALIBRACIÓN DE PESAS M1',
    desc: 'Calibración de masas patrón individuales y juegos en acero inoxidable o fundición clase M1.',
    image: '/images/original/pesas-m1.jpg',
  },
];

// Catálogo de magnitudes complementarias en la página principal
const homeOtherMagnitudes = [
  {
    category: 'VOLUMEN',
    icon: Drop,
    items: ['Probetas', 'Buretas', 'Micropipetas', 'Picnómetros', 'Dispensadores'],
  },
  {
    category: 'PRESIÓN',
    icon: Gauge,
    items: ['Manómetros', 'Vacuómetros', 'Diferencial de presión', 'Transmisores'],
  },
  {
    category: 'ELÉCTRICA',
    icon: Lightning,
    items: ['Pinzas voltiamperimétricas', 'Multímetros', 'Megómetros'],
  },
  {
    category: 'LONGITUD',
    icon: Ruler,
    items: ['Pie de rey', 'Reglas graduadas', 'Micrómetros', 'Cintas métricas'],
  },
  {
    category: 'TEMPERATURA Y HUMEDAD',
    icon: Thermometer,
    items: ['Termómetros de contacto', 'Infrarrojos', 'Ambientales', 'Bloques secos'],
  },
  {
    category: 'TIEMPO Y FRECUENCIA',
    icon: Clock,
    items: ['Tacómetros', 'Cronómetros', 'Temporizadores industriales'],
  },
  {
    category: 'PESAS PATRÓN OIML',
    icon: Scales,
    items: ['Clase E2', 'Clase F1', 'Clase M1', 'Pesas ASTM'],
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
      {/* ─── Hero Slider Principal Dinámico con Video de Fondo ─ */}
      <HomeHeroSlider />

      {/* ─── Franja de Acreditación ONAC ──────────────────────── */}
      <section id="acreditacion" className="scroll-mt-24 border-b border-slate-200 bg-white">
        <Container className="grid gap-8 py-10 sm:py-12 lg:grid-cols-12 lg:items-center">
          <div className="flex items-center gap-4 lg:col-span-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-red-50 text-brand ring-1 ring-brand/20">
              <Medal size={32} weight="duotone" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">Acreditación vigente</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">ONAC 21-LAC-011</p>
            </div>
          </div>
          <p className="text-base leading-7 text-slate-600 lg:col-span-6 lg:border-l lg:border-slate-200 lg:pl-8">
            Nuestro alcance acreditado demuestra competencia técnica bajo la norma internacional <strong className="text-slate-900 font-semibold">ISO/IEC 17025:2017</strong> y aporta confianza y trazabilidad a tus auditorías y procesos de calidad.
          </p>
          <div className="lg:col-span-2 lg:text-right">
            <ButtonLink href="/acreditacion" variant="secondary" arrow>
              Ver alcance
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* ─── Sección NOSOTROS con Sello Visual 4-Grid & Dot Pattern ─ */}
      <Section id="nosotros" tone="muted" className="border-b border-slate-200">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-6">
            <Eyebrow>Sobre Labtronix</Eyebrow>
            <h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-slate-950 sm:text-4xl lg:text-[2.65rem]">
              NOSOTROS
            </h2>
            <div className="mt-6 space-y-4 text-base sm:text-lg leading-relaxed text-slate-600">
              <p>
                En <strong className="font-semibold text-slate-900">Labtronix Metrology S.A.S.</strong>, contamos con la acreditación ONAC vigente a la fecha, con código de acreditación <strong className="font-semibold text-brand">21-LAC-011</strong>, bajo la norma <strong className="font-semibold text-slate-900">ISO/IEC 17025:2017</strong>, para calibración de equipos de pesaje de funcionamiento no automático.
              </p>
              <p className="text-base text-slate-600 leading-relaxed">
                Brindamos soluciones integrales de metrología con personal calificado, patrones trazables y una plataforma tecnológica moderna para la emisión y trazabilidad de certificados digitales.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonLink href="/sobre-nosotros" arrow>
                LEER MÁS
              </ButtonLink>
              <ButtonLink href="/acreditacion" variant="secondary">
                Certificado ONAC
              </ButtonLink>
            </div>

            {/* Estadísticas rápidas de la empresa */}
            <dl className="mt-12 grid grid-cols-1 border-t border-slate-200 sm:grid-cols-3">
              {stats.map((stat, i) => (
                <div
                  key={stat.value}
                  className={`flex flex-col py-4 ${
                    i > 0 ? 'border-t border-slate-200 sm:border-l sm:border-t-0 sm:pl-6' : ''
                  } ${i < stats.length - 1 ? 'sm:pr-6' : ''}`}
                >
                  <dt className="order-2 mt-1 text-xs text-slate-500 font-medium">{stat.label}</dt>
                  <dd className="order-1 text-base font-bold tracking-tight text-slate-950">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Sello visual: Composición cuadrícula de 4 recuadros + patrón de puntos */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <div className="relative p-6 sm:p-8">
              {/* Patrón de puntos técnico (Dot Matrix / Grid Sello de identidad) */}
              <div 
                aria-hidden="true" 
                className="absolute top-0 right-0 sm:right-6 w-48 sm:w-56 h-48 sm:h-56 bg-[radial-gradient(#94a3b8_2px,transparent_2px)] [background-size:16px_16px] opacity-70 z-0" 
              />
              <div 
                aria-hidden="true" 
                className="absolute bottom-2 left-0 sm:left-4 w-32 sm:w-40 h-32 sm:h-40 bg-[radial-gradient(#ec060b_2px,transparent_2px)] [background-size:16px_16px] opacity-40 z-0" 
              />

              {/* Contenedor de la imagen recortada en 4 cuadrantes estilo matriz */}
              <div className="relative z-10 w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] grid grid-cols-2 grid-rows-2 gap-3.5 bg-transparent drop-shadow-xl">
                {/* Cuadrante 1: Superior Izquierdo */}
                <div className="relative overflow-hidden rounded-md bg-white border border-slate-200/80 shadow-sm group">
                  <div className="absolute inset-0 w-[200%] h-[200%] -top-0 -left-0">
                    <Image
                      src="/images/original/pesas-m1.jpg"
                      alt="Calibración de patrones de masa"
                      fill
                      className="object-cover object-[0%_0%] transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 640px) 420px, 300px"
                    />
                  </div>
                </div>

                {/* Cuadrante 2: Superior Derecho */}
                <div className="relative overflow-hidden rounded-md bg-white border border-slate-200/80 shadow-sm group">
                  <div className="absolute inset-0 w-[200%] h-[200%] -top-0 -left-[100%]">
                    <Image
                      src="/images/original/pesas-m1.jpg"
                      alt="Técnico metrólogo en procedimiento de pesaje"
                      fill
                      className="object-cover object-[100%_0%] transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 640px) 420px, 300px"
                    />
                  </div>
                </div>

                {/* Cuadrante 3: Inferior Izquierdo */}
                <div className="relative overflow-hidden rounded-md bg-white border border-slate-200/80 shadow-sm group">
                  <div className="absolute inset-0 w-[200%] h-[200%] -top-[100%] -left-0">
                    <Image
                      src="/images/original/pesas-m1.jpg"
                      alt="Instrumento de pesaje no automático"
                      fill
                      className="object-cover object-[0%_100%] transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 640px) 420px, 300px"
                    />
                  </div>
                </div>

                {/* Cuadrante 4: Inferior Derecho */}
                <div className="relative overflow-hidden rounded-md bg-white border border-slate-200/80 shadow-sm group">
                  <div className="absolute inset-0 w-[200%] h-[200%] -top-[100%] -left-[100%]">
                    <Image
                      src="/images/original/pesas-m1.jpg"
                      alt="Verificación técnica y calibración acreditada"
                      fill
                      className="object-cover object-[100%_100%] transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 640px) 420px, 300px"
                    />
                  </div>
                </div>
              </div>

              {/* Badge flotante de acreditación */}
              <div className="absolute -bottom-2 sm:bottom-2 left-2 sm:left-4 z-20 flex items-center gap-2.5 rounded-md border border-slate-200 bg-white px-4 py-2.5 shadow-lg">
                <ShieldCheck size={24} weight="fill" className="text-brand shrink-0" />
                <span className="text-xs font-bold text-slate-900 tracking-wide">
                  ONAC 21-LAC-011 · ISO 17025
                </span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── NUESTROS SERVICIOS: Cards Uniformes y de Alto Impacto ─── */}
      <Section id="servicios" className="bg-white">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
            CAPACIDAD TÉCNICA Y COBERTURA
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-[2.75rem]">
            NUESTROS SERVICIOS
          </h2>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-red-50 border border-brand/20 px-4 py-1">
            <ShieldCheck size={16} weight="fill" className="text-brand" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand">
              Calibración acreditada por Organismo Nacional de Acreditación (ONAC)
            </span>
          </div>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            En Labtronix metrology SAS, contamos con la acreditación ONAC, vigente a la fecha, con código de acreditación <strong>21-LAC-011</strong>, bajo la norma <strong>IEC 17025:2017</strong>.
          </p>
        </div>

        {/* Grid de 3 Cards Principales Uniformes */}
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {primaryServices.map((service) => (
            <article
              key={service.id}
              className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_16px_36px_rgba(236,6,11,0.08)] overflow-hidden"
            >
              {/* Esquina superior estilizada con pestaña distintiva */}
              <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-red-50 to-transparent rounded-bl-3xl -z-0" />

              {/* Contenedor uniforme de la imagen del equipo */}
              <div className="relative mb-6 flex h-52 w-full items-center justify-center rounded-xl bg-slate-50/80 p-4 transition-colors group-hover:bg-red-50/30">
                <div className="relative h-44 w-full">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  />
                </div>
                {service.accredited && (
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                    ONAC 21-LAC-011
                  </span>
                )}
              </div>

              {/* Títulos y Contenido */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-slate-950 group-hover:text-brand transition-colors">
                    {service.title}
                  </h3>
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-brand">
                    Alcance: {service.scope}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-4">
                    {service.description}
                  </p>
                </div>

                {/* Botón de acción */}
                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="#contacto"
                    className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand-dark transition-colors"
                  >
                    Cotizar servicio <ArrowRight size={16} weight="bold" className="transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/servicios"
                    className="text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    Detalles
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* ─── SERVICIOS TRAZABLES (Fotos Reales de Procedimientos) ─ */}
        <div className="mt-20 border-t border-slate-200 pt-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">TRAZABILIDAD COMPROBADA</p>
            <h3 className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-950">SERVICIOS TRAZABLES</h3>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              Calibración trazable a patrones nacionales e internacionales con emisión de certificados válidos para auditorías.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {homeTraceableServices.map((srv) => (
              <div
                key={srv.title}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-brand/40 hover:shadow-md"
              >
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={srv.image}
                    alt={srv.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h4 className="font-bold text-sm text-slate-950 uppercase tracking-tight group-hover:text-brand transition-colors">
                    {srv.title}
                  </h4>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{srv.desc}</p>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href="/servicios"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-dark"
                    >
                      Ver alcance <ArrowRight size={13} weight="bold" />
                    </Link>
                    <Link
                      href="#contacto"
                      className="text-xs font-medium text-slate-500 hover:text-slate-800"
                    >
                      Cotizar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ─── OTROS SERVICIOS POR MAGNITUD (Cuadrícula con Nombres de Equipos) ─ */}
        <div className="mt-16 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand">PORTAFOLIO MULTIMAGNITUD</span>
              <h4 className="mt-1 text-2xl font-bold text-slate-950">Otros servicios de calibración técnica</h4>
              <p className="text-sm text-slate-600 mt-1">Instrumentación atendida con trazabilidad documentada para laboratorios y plantas.</p>
            </div>
            <ButtonLink href="/servicios" variant="primary" arrow>
              Ver todas las magnitudes
            </ButtonLink>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {homeOtherMagnitudes.map((mag) => {
              const Icon = mag.icon;
              return (
                <div
                  key={mag.category}
                  className="rounded-xl border border-slate-200 bg-white p-5 transition-all hover:border-brand/40 hover:shadow-sm"
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-brand">
                      <Icon size={18} weight="duotone" />
                    </div>
                    <h5 className="font-bold text-xs uppercase tracking-tight text-slate-900">{mag.category}</h5>
                  </div>
                  <ul className="space-y-1.5 border-t border-slate-100 pt-3">
                    {mag.items.map((it) => (
                      <li key={it} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <span className="h-1 w-1 rounded-full bg-brand shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ─── Equipos y Venta ──────────────────────────────────── */}
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

      {/* ─── Proceso de Trabajo ──────────────────────────────── */}
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
