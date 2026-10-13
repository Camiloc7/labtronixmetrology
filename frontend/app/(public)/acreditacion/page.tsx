import type { Metadata } from 'next';
import { Check, Medal, ShieldCheck } from '@phosphor-icons/react/dist/ssr';
import { ButtonLink, Container, CtaBand, Eyebrow, Section } from '@/components/public/ui';

export const metadata: Metadata = {
  title: 'Acreditación ONAC 21-LAC-011 | Labtronix',
  description: 'Información sobre la acreditación de Labtronix bajo NTC-ISO/IEC 17025:2017 para instrumentos de pesaje.',
  alternates: { canonical: '/acreditacion' },
};

const benefits = [
  'Resultados confiables para sistemas de gestión y auditorías',
  'Patrones con trazabilidad documentada al INM y PTB',
  'Personal técnico calificado',
  'Estimación y declaración de incertidumbre de medición',
  'Certificados con información para demostrar trazabilidad',
];

const facts = [
  { value: '0–2.000 kg', label: 'Rango informado para pesaje no automático.', accent: true },
  { value: '21-LAC-011', label: 'Código de acreditación ONAC.' },
  { value: 'ILAC-MRA', label: 'Reconocimiento internacional de resultados.' },
];

export default function AcreditacionPage() {
  return (
    <>
      <header className="border-b border-slate-200 bg-white">
        <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:items-center lg:py-24">
          <div className="lg:col-span-7">
            <Eyebrow>Respaldo institucional</Eyebrow>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[3.5rem]">
              Acreditación ONAC <span className="text-brand">21-LAC-011.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Competencia técnica demostrada bajo la norma NTC-ISO/IEC 17025:2017 para calibración de instrumentos de pesaje.
            </p>
            <div className="mt-9">
              <ButtonLink href="/#contacto" arrow>Solicitar alcance técnico</ButtonLink>
            </div>
          </div>

          {/* Ficha de acreditación */}
          <div className="lg:col-span-5">
            <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-8 sm:p-10">
              <span aria-hidden="true" className="absolute left-0 top-8 h-16 w-1 bg-brand" />
              <Medal size={44} weight="duotone" className="text-brand" />
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Norma</p>
              <p className="mt-1 font-mono text-2xl font-semibold text-slate-950">ISO/IEC 17025</p>
              <div className="mt-6 border-t border-slate-200 pt-6">
                <p className="text-sm leading-6 text-slate-600">
                  Alcance de 0 g a 2.000 kg, con reconocimiento internacional ILAC-MRA.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </header>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ShieldCheck size={40} weight="duotone" className="text-brand" />
            <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-4xl">
              ¿Qué significa para nuestros clientes?
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-lg leading-8 text-slate-700">
              La acreditación otorgada por el Organismo Nacional de Acreditación de Colombia confirma que Labtronix cuenta con
              personal competente, métodos controlados, trazabilidad metrológica y capacidad para producir resultados
              técnicamente válidos dentro de su alcance.
            </p>
            <p className="mt-5 text-base leading-7 text-slate-600">
              Estos resultados respaldan la evidencia metrológica requerida en sistemas de gestión y procesos de auditoría ante
              organizaciones como ISO, INVIMA, ICA y entidades de inspección, según los requisitos aplicables de cada proceso.
            </p>
            <ul className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
              {benefits.map((item) => (
                <li key={item} className="flex items-center gap-4 py-4 text-base font-medium text-slate-800">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-50 text-brand">
                    <Check size={15} weight="bold" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <section className="border-y border-slate-200 bg-slate-50">
        <Container>
          <dl className="grid divide-y divide-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {facts.map((fact) => (
              <div key={fact.value} className="flex flex-col py-10 sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <dt className="order-2 mt-2 text-sm leading-6 text-slate-600">{fact.label}</dt>
                <dd className={`order-1 font-mono text-2xl font-semibold sm:text-3xl ${fact.accent ? 'text-brand' : 'text-slate-950'}`}>
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <CtaBand
        title="Solicita el alcance técnico aplicable."
        text="Confirmaremos rango, capacidad de medición y condiciones para tu instrumento."
        label="Solicitar información"
      />
    </>
  );
}
