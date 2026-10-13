import type { Metadata } from 'next';
import Image from 'next/image';
import { Check } from '@phosphor-icons/react/dist/ssr';
import { ButtonLink, CtaBand, PageHero, Section, SectionHeading } from '@/components/public/ui';

export const metadata: Metadata = {
  title: 'Equipos e instrumentación de medición | Labtronix',
  description: 'Venta de balanzas, básculas, pesas patrón e instrumentación con soporte técnico y calibración.',
  alternates: { canonical: '/equipos' },
};

const catalog = [
  { title: 'Balanzas analíticas, semianalíticas y de precisión', image: '/images/original/balanzas.png' },
  { title: 'Básculas industriales', image: '/images/original/basculas.png' },
  { title: 'Pesas patrón OIML clases E2, F1, F2 y M1 en acero inoxidable', image: '/images/original/pesas-m1.jpg' },
  { title: 'Termohigrómetros y data loggers con trazabilidad', image: '/images/original/termohigrometros.jpg' },
];

const moreItems = ['Manómetros digitales de alta exactitud', 'Sistemas de adquisición y software metrológico'];

const steps = [
  { n: '01', title: 'Selección técnica', text: 'Revisamos uso, capacidad, división y condiciones del proceso antes de recomendar.' },
  { n: '02', title: 'Entrega preparada', text: 'Coordinamos instalación, configuración y calibración inicial cuando aplique.' },
  { n: '03', title: 'Soporte posterior', text: 'Acompañamos mantenimiento, recalibración y continuidad metrológica.' },
];

export default function EquiposPage() {
  return (
    <>
      <PageHero
        eyebrow="Equipamiento de medición"
        title="Instrumentos seleccionados para tu proceso."
        lead="Suministramos equipos de medición con acompañamiento técnico para elegir la capacidad, exactitud y configuración adecuadas."
        media={
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
            <Image
              src="/images/equipment_scale_1790955120303.jpg"
              alt="Balanza de alta precisión para laboratorio"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        }
      >
        <ButtonLink href="/#contacto" arrow>Solicitar cotización</ButtonLink>
      </PageHero>

      <Section>
        <SectionHeading
          align="split"
          eyebrow="Portafolio"
          title="Soluciones para laboratorio e industria."
          lead="Trabajamos con instrumentación de fabricantes reconocidos y coordinamos protocolo de calificación y certificado de calibración inicial según la solución adquirida. Consulta disponibilidad con nuestro equipo comercial."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {catalog.map((item) => (
            <article key={item.title} className="group overflow-hidden rounded-lg border border-slate-200 bg-white">
              <div className="relative aspect-[4/3] bg-slate-100">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="p-5 text-base font-semibold leading-6 tracking-tight">{item.title}</h3>
            </article>
          ))}
        </div>

        <ul className="mt-8 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2">
          {moreItems.map((item) => (
            <li key={item} className="flex items-center gap-3 text-base font-medium text-slate-800">
              <Check size={18} weight="bold" className="shrink-0 text-brand" />
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Acompañamiento" title="Del requerimiento al equipo en operación." />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.n} className="bg-white p-7 sm:p-9">
              <span className="font-mono text-4xl font-semibold text-brand/90">{step.n}</span>
              <h3 className="mt-8 text-xl font-semibold tracking-tight">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">{step.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand
        title="¿Buscas un equipo específico?"
        text="Indícanos capacidad, división, uso y cantidad. Te proponemos la opción adecuada con su calibración inicial."
        label="Solicitar cotización"
      />
    </>
  );
}
