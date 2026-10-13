import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Building, Check, Target, UsersThree } from '@phosphor-icons/react/dist/ssr';

export const metadata: Metadata = {
  title: 'Sobre Labtronix Metrology',
  description: 'Historia, propósito, valores y respaldo técnico de Labtronix Metrology S.A.S.',
  alternates: { canonical: '/sobre-nosotros' },
};

export default function SobreNosotrosPage() {
  return (
    <main className="bg-white text-slate-950">
      <header className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-brand">Nuestra compañía</p>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-.04em] sm:text-6xl">Excelencia metrológica al servicio de la industria.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">Labtronix es un aliado técnico para organizaciones que exigen calidad, trazabilidad y cumplimiento en sus procesos de medición.</p>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-brand">Nuestra historia</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-[-.035em]">Una empresa construida alrededor de la confianza técnica.</h2>
          <div className="mt-7 space-y-5 text-base leading-8 text-slate-600">
            <p>Desde nuestros inicios en 2019 en Bogotá identificamos la necesidad de las industrias farmacéutica, alimentaria, química y manufacturera de contar con calibración transparente, rigurosa y con tiempos de respuesta adecuados.</p>
            <p>Nos hemos enfocado en inversión continua en patrones de alta gama trazables internacionalmente al INM y al PTB de Alemania, sistemas de gestión digitalizados y capacitación especializada de nuestros metrólogos.</p>
          </div>
        </div>
        <div className="relative min-h-[360px] overflow-hidden bg-slate-100 sm:min-h-[460px]"><Image src="/images/original/termohigrometros.jpg" alt="Equipos de medición atendidos por Labtronix" fill className="object-cover" /></div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="border-t-2 border-brand bg-white p-8 sm:p-10"><Target size={32} weight="duotone" className="text-brand" /><h2 className="mt-8 text-2xl font-semibold">Misión</h2><p className="mt-4 text-base leading-8 text-slate-600">Proveer servicios metrológicos de la más alta exactitud y confiabilidad técnica, respaldados por personal calificado y patrones de referencia trazables a organismos internacionales.</p></article>
            <article className="border-t-2 border-slate-950 bg-white p-8 sm:p-10"><Building size={32} weight="duotone" className="text-brand" /><h2 className="mt-8 text-2xl font-semibold">Visión</h2><p className="mt-4 text-base leading-8 text-slate-600">Consolidarnos como el laboratorio de metrología referente en Colombia y la región andina, reconocidos por la innovación digital en la gestión de calibraciones y la transparencia técnica.</p></article>
          </div>
          <div className="mt-14 grid gap-8 lg:grid-cols-[.6fr_1.4fr] lg:items-start">
            <div><UsersThree size={32} weight="duotone" className="text-brand" /><h2 className="mt-5 text-2xl font-semibold">Valores corporativos</h2></div>
            <div className="grid grid-cols-2 gap-px bg-slate-300 sm:grid-cols-3">{['Calidad', 'Confiabilidad', 'Transparencia', 'Pasión', 'Compromiso', 'Liderazgo'].map(value => <div key={value} className="flex items-center gap-3 bg-slate-50 px-5 py-5 text-sm font-semibold"><Check size={18} className="text-brand" />{value}</div>)}</div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-px bg-slate-800 sm:grid-cols-2 lg:grid-cols-4">
          {[['2019', 'Año de fundación'], ['17025', 'Norma acreditada'], ['ONAC', 'Acreditación 21-LAC-011'], ['24/7', 'Portal de certificados']].map(([value, label]) => <div key={value} className="bg-slate-950 p-8 sm:p-10"><p className="font-mono text-3xl font-bold text-red-400">{value}</p><p className="mt-2 text-sm text-slate-400">{label}</p></div>)}
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-20 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div><h2 className="text-3xl font-semibold">Conoce cómo podemos apoyar tu operación.</h2><p className="mt-3 text-slate-600">Consulta nuestras magnitudes, alcance acreditado y soluciones de equipamiento.</p></div>
        <Link href="/servicios" className="inline-flex min-h-12 items-center justify-center gap-2 bg-brand px-6 text-sm font-bold text-white">Ver servicios <ArrowRight size={18} /></Link>
      </section>
    </main>
  );
}
