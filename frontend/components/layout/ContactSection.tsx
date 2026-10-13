'use client';
import { useState } from 'react';
import { ArrowRight, CheckCircle, Envelope, MapPin, Phone, ShieldCheck } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { publicContactApi } from '@/lib/api';

const inputClass =
  'mt-2 block min-h-12 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-normal normal-case tracking-normal text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-brand/10';
const labelClass = 'block text-sm font-medium text-slate-800';

export default function ContactSection() {
  const [formData, setFormData] = useState({ nombre: '', empresa: '', email: '', telefono: '', servicio: 'calibracion-balanzas', mensaje: '', website: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await publicContactApi.create(formData);
      setIsSuccess(true);
      toast.success('Solicitud recibida. Nuestro equipo se pondrá en contacto.');
    } catch {
      toast.error('No pudimos enviar la solicitud. Inténtalo de nuevo o escríbenos por correo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactItems: { icon: typeof Phone; title: string; lines: { label: string; href?: string }[] }[] = [
    {
      icon: Phone,
      title: 'Teléfono y WhatsApp',
      lines: [
        { label: '+57 312 573 0305', href: 'tel:+573125730305' },
        { label: '+57 316 024 9528', href: 'https://wa.me/573160249528' },
      ],
    },
    {
      icon: Envelope,
      title: 'Correos corporativos',
      lines: [
        { label: 'comercial1@labtronix.com.co', href: 'mailto:comercial1@labtronix.com.co' },
        { label: 'admon@labtronix.com.co', href: 'mailto:admon@labtronix.com.co' },
      ],
    },
    {
      icon: MapPin,
      title: 'Laboratorio',
      lines: [{ label: 'Calle 69 B #90B-48, oficina 202' }, { label: 'Bogotá D.C., Colombia' }],
    },
  ];

  return (
    <section id="contacto" className="scroll-mt-24 border-t border-slate-200 bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <aside className="lg:col-span-5">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              <span aria-hidden="true" className="h-px w-8 bg-brand" />
              Hablemos de tu necesidad
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-slate-950 sm:text-4xl lg:text-[2.75rem]">
              Una cotización clara empieza con los datos correctos.
            </h2>
            <p className="mt-6 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Cuéntanos qué equipos necesitas calibrar o adquirir. Revisaremos magnitud, rango, cantidad y lugar del servicio
              antes de preparar la propuesta.
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Contamos con capacidad operativa in situ a nivel nacional y atención en nuestras instalaciones permanentes.
            </p>

            <ul className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
              {contactItems.map(({ icon: Icon, title, lines }) => (
                <li key={title} className="flex gap-4 py-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-red-50 text-brand">
                    <Icon size={20} weight="duotone" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{title}</p>
                    {lines.map((line) =>
                      line.href ? (
                        <a key={line.label} href={line.href} className="mt-1 block text-sm text-slate-600 hover:text-brand">
                          {line.label}
                        </a>
                      ) : (
                        <p key={line.label} className="mt-1 text-sm text-slate-600">{line.label}</p>
                      ),
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-start gap-3">
              <ShieldCheck size={22} weight="fill" className="mt-0.5 shrink-0 text-brand" />
              <div>
                <p className="text-sm font-semibold text-slate-950">Laboratorio acreditado ONAC</p>
                <p className="mt-0.5 text-sm leading-6 text-slate-600">Código 21-LAC-011 bajo NTC-ISO/IEC 17025:2017.</p>
              </div>
            </div>
          </aside>

          <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-6 sm:p-10 lg:col-span-7 lg:p-12">
            {isSuccess ? (
              <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
                <CheckCircle size={56} weight="fill" className="text-brand" />
                <h3 className="mt-6 text-3xl font-semibold tracking-tight">Solicitud recibida</h3>
                <p className="mt-3 max-w-md text-base leading-7 text-slate-600">
                  Registramos tus datos. Nuestro equipo técnico o comercial se pondrá en contacto durante el siguiente día hábil.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 min-h-12 rounded-md border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-900 transition-colors hover:border-slate-900"
                >
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Honeypot anti-spam */}
                <div className="absolute left-[-9999px]" aria-hidden="true">
                  <label htmlFor="contact-website">Sitio web</label>
                  <input id="contact-website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-semibold tracking-tight text-slate-950">Datos de contacto y equipos</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Los campos marcados con * son necesarios para responderte.</p>
                </div>

                <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
                  <label className={labelClass}>
                    Nombre completo *
                    <input type="text" required autoComplete="name" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className={inputClass} />
                  </label>
                  <label className={labelClass}>
                    Empresa o razón social *
                    <input type="text" required autoComplete="organization" value={formData.empresa} onChange={(e) => setFormData({ ...formData, empresa: e.target.value })} className={inputClass} />
                  </label>
                  <label className={labelClass}>
                    Correo electrónico *
                    <input type="email" required autoComplete="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
                  </label>
                  <label className={labelClass}>
                    Teléfono de contacto *
                    <input type="tel" required autoComplete="tel" value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className={inputClass} />
                  </label>
                  <label className={labelClass + ' sm:col-span-2'}>
                    Tipo de requerimiento *
                    <select value={formData.servicio} onChange={(e) => setFormData({ ...formData, servicio: e.target.value })} className={inputClass}>
                      <option value="calibracion-balanzas">Calibración de balanzas y básculas</option>
                      <option value="calibracion-temperatura">Temperatura y humedad</option>
                      <option value="calibracion-presion">Presión y vacío</option>
                      <option value="calibracion-volumen">Volumen y vidriería</option>
                      <option value="venta-equipos">Compra de equipos</option>
                      <option value="otro">Otro servicio o asesoría</option>
                    </select>
                  </label>
                  <label className={labelClass + ' sm:col-span-2'}>
                    Equipos o mensaje
                    <textarea rows={5} value={formData.mensaje} onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })} className={inputClass + ' resize-y'} placeholder="Equipo, marca, modelo, rango, cantidad y ciudad..." />
                  </label>
                </div>

                <div className="mt-8 flex flex-col gap-5 border-t border-slate-200 pt-7 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-sm text-xs leading-5 text-slate-500">
                    La información será utilizada únicamente para gestionar tu solicitud comercial.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-brand px-7 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60"
                  >
                    {isSubmitting ? 'Enviando…' : 'Enviar solicitud'} <ArrowRight size={18} weight="bold" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
