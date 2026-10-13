import type { Metadata } from 'next';
import Image from 'next/image';
import { Building, Check, Target } from '@phosphor-icons/react/dist/ssr';
import { Container, CtaBand, Eyebrow, PageHero, Section, SectionHeading } from '@/components/public/ui';

export const metadata: Metadata = {
  title: 'Sobre Labtronix Metrology',
  description: 'Historia, propósito, valores y respaldo técnico de Labtronix Metrology S.A.S.',
  alternates: { canonical: '/sobre-nosotros' },
};

const values = ['Calidad', 'Confiabilidad', 'Transparencia', 'Pasión', 'Compromiso', 'Liderazgo'];

const figures = [
  { value: '2019', label: 'Año de fundación' },
  { value: '17025', label: 'Norma acreditada' },
  { value: 'ONAC', label: 'Acreditación 21-LAC-011' },
  { value: '24/7', label: 'Portal de certificados' },
];

export default function SobreNosotrosPage() {
  return (
    <>
      <PageHero
        eyebrow="Nuestra compañía"
        title="Excelencia metrológica al servicio de la industria."
        lead="Labtronix es un aliado técnico para organizaciones que exigen calidad, trazabilidad y cumplimiento en sus procesos de medición."
      />

      {/* Historia */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-6">
            <Eyebrow>Nuestra historia</Eyebrow>
            <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-4xl lg:text-[2.75rem]">
              Una empresa construida alrededor de la confianza técnica.
            </h2>
            <div className="mt-7 space-y-5 text-base leading-8 text-slate-600 sm:text-lg">
              <p>
                Desde nuestros inicios en 2019 en Bogotá identificamos la necesidad de las industrias farmacéutica,
                alimentaria, química y manufacturera de contar con calibración transparente, rigurosa y con tiempos de
                respuesta adecuados.
              </p>
              <p>
                Nos hemos enfocado en inversión continua en patrones de alta gama trazables internacionalmente al INM y al
                PTB de Alemania, sistemas de gestión digitalizados y capacitación especializada de nuestros metrólogos.
              </p>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src="/images/original/termohigrometros.jpg"
                  alt="Equipos de medición atendidos por Labtronix"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              <span aria-hidden="true" className="absolute -bottom-3 -right-3 h-16 w-16 border-b-4 border-r-4 border-brand" />
            </div>
          </div>
        </div>
      </Section>

      {/* Cifras */}
      <section className="bg-slate-950 text-white">
        <Container>
          <dl className="grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
            {figures.map((f) => (
              <div key={f.value} className="flex flex-col bg-slate-950 px-5 py-10 sm:px-8 sm:py-12">
                <dt className="order-2 mt-2 text-sm text-slate-400">{f.label}</dt>
                <dd className="order-1 font-mono text-3xl font-semibold text-red-400 sm:text-4xl">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Misión, visión y valores */}
      <Section tone="muted">
        <SectionHeading eyebrow="Propósito" title="Lo que nos mueve y hacia dónde vamos." />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <article className="rounded-lg border border-slate-200 bg-white p-8 sm:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-red-50 text-brand">
              <Target size={26} weight="duotone" />
            </span>
            <h3 className="mt-7 text-2xl font-semibold tracking-tight">Misión</h3>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Proveer servicios metrológicos de la más alta exactitud y confiabilidad técnica, respaldados por personal
              calificado y patrones de referencia trazables a organismos internacionales.
            </p>
          </article>
          <article className="rounded-lg border border-slate-200 bg-white p-8 sm:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-950 text-white">
              <Building size={26} weight="duotone" />
            </span>
            <h3 className="mt-7 text-2xl font-semibold tracking-tight">Visión</h3>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Consolidarnos como el laboratorio de metrología referente en Colombia y la región andina, reconocidos por la
              innovación digital en la gestión de calibraciones y la transparencia técnica.
            </p>
          </article>
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-8 sm:p-10">
          <h3 className="text-2xl font-semibold tracking-tight">Valores corporativos</h3>
          <ul className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {values.map((value) => (
              <li key={value} className="flex items-center gap-2.5 text-base font-medium text-slate-800">
                <Check size={18} weight="bold" className="shrink-0 text-brand" />
                {value}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand
        title="Conoce cómo podemos apoyar tu operación."
        text="Consulta nuestras magnitudes, alcance acreditado y soluciones de equipamiento."
        href="/servicios"
        label="Ver servicios"
      />
    </>
  );
}
