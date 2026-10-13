'use client';
import { useState } from 'react';
import { ArrowRight, CheckCircle, Envelope, MapPin, Phone } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { publicContactApi } from '@/lib/api';

const inputClass = 'mt-2 min-h-12 w-full border border-slate-300 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/15';
const labelClass = 'block text-xs font-bold uppercase tracking-[0.1em] text-slate-700';

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

  return (
    <section id="contacto" className="border-t border-slate-200 bg-slate-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <aside className="lg:pt-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand">Hablemos de tu necesidad</p>
            <h2 className="mt-5 max-w-lg text-4xl font-semibold leading-[1.08] tracking-[-0.04em] text-slate-950 sm:text-5xl">Una cotización clara empieza con los datos correctos.</h2>
            <p className="mt-6 max-w-md text-base leading-7 text-slate-600">Cuéntanos qué equipos necesitas calibrar o adquirir. Revisaremos magnitud, rango, cantidad y lugar del servicio antes de preparar la propuesta.</p>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">Contamos con capacidad operativa in situ a nivel nacional y atención en nuestras instalaciones permanentes.</p>
            <div className="mt-12 space-y-7 border-t border-slate-300 pt-8">
              <div className="flex gap-4"><Phone size={22} className="mt-0.5 shrink-0 text-brand" /><div><p className="text-sm font-semibold">Teléfono y WhatsApp</p><a href="tel:+573125730305" className="mt-1 block text-sm text-slate-600">+57 312 573 0305</a><a href="https://wa.me/573160249528" className="mt-1 block text-sm text-slate-600">+57 316 024 9528</a></div></div>
              <div className="flex gap-4"><Envelope size={22} className="mt-0.5 shrink-0 text-brand" /><div><p className="text-sm font-semibold">Correos corporativos</p><a href="mailto:comercial1@labtronix.com.co" className="mt-1 block text-sm text-slate-600">comercial1@labtronix.com.co</a><a href="mailto:admon@labtronix.com.co" className="mt-1 block text-sm text-slate-600">admon@labtronix.com.co</a></div></div>
              <div className="flex gap-4"><MapPin size={22} className="mt-0.5 shrink-0 text-brand" /><div><p className="text-sm font-semibold">Laboratorio</p><p className="mt-1 text-sm leading-6 text-slate-600">Calle 69 B #90B-48, oficina 202<br />Bogotá D.C., Colombia</p></div></div>
            </div>
            <div className="mt-9 border-l-2 border-brand pl-4"><p className="text-xs font-bold uppercase tracking-[.12em] text-brand">Laboratorio acreditado ONAC</p><p className="mt-1 text-sm leading-6 text-slate-600">Código 21-LAC-011 bajo NTC-ISO/IEC 17025:2017.</p></div>
          </aside>
          <div className="border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,.08)] sm:p-10 lg:p-12">
            {isSuccess ? (
              <div className="flex min-h-[480px] flex-col items-center justify-center text-center">
                <CheckCircle size={54} weight="fill" className="text-brand" /><h3 className="mt-6 text-3xl font-semibold">Solicitud recibida</h3><p className="mt-3 max-w-md text-base leading-7 text-slate-600">Registramos tus datos. Nuestro equipo técnico o comercial se pondrá en contacto durante el siguiente día hábil.</p><button type="button" onClick={() => setIsSuccess(false)} className="mt-8 min-h-12 border border-slate-300 px-6 text-sm font-bold">Enviar otra solicitud</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="absolute left-[-9999px]" aria-hidden="true"><label htmlFor="contact-website">Sitio web</label><input id="contact-website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} /></div>
                <div className="mb-9 border-b border-slate-200 pb-7"><p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">Solicitud de servicio</p><h3 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Datos de contacto y equipos</h3><p className="mt-2 text-sm leading-6 text-slate-500">Los campos marcados con * son necesarios para responderte.</p></div>
                <div className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
                  <label className={labelClass}>Nombre completo *<input type="text" required value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className={inputClass} /></label>
                  <label className={labelClass}>Empresa o razón social *<input type="text" required value={formData.empresa} onChange={(e) => setFormData({ ...formData, empresa: e.target.value })} className={inputClass} /></label>
                  <label className={labelClass}>Correo electrónico *<input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} /></label>
                  <label className={labelClass}>Teléfono de contacto *<input type="tel" required value={formData.telefono} onChange={(e) => setFormData({ ...formData, telefono: e.target.value })} className={inputClass} /></label>
                  <label className={labelClass + ' sm:col-span-2'}>Tipo de requerimiento *<select value={formData.servicio} onChange={(e) => setFormData({ ...formData, servicio: e.target.value })} className={inputClass}><option value="calibracion-balanzas">Calibración de balanzas y básculas</option><option value="calibracion-temperatura">Temperatura y humedad</option><option value="calibracion-presion">Presión y vacío</option><option value="calibracion-volumen">Volumen y vidriería</option><option value="venta-equipos">Compra de equipos</option><option value="otro">Otro servicio o asesoría</option></select></label>
                  <label className={labelClass + ' sm:col-span-2'}>Equipos o mensaje<textarea rows={5} value={formData.mensaje} onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })} className={inputClass + ' resize-y'} placeholder="Equipo, marca, modelo, rango, cantidad y ciudad..." /></label>
                </div>
                <div className="mt-8 flex flex-col gap-4 border-t border-slate-200 pt-7 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-sm text-xs leading-5 text-slate-500">La información será utilizada únicamente para gestionar tu solicitud comercial.</p><button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 items-center justify-center gap-2 bg-brand px-7 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-60">{isSubmitting ? 'Enviando…' : 'Enviar solicitud'} <ArrowRight size={18} /></button></div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
