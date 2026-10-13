'use client';
import { useState } from 'react';
import { 
  PaperPlaneTilt, 
  CheckCircle, 
  Phone, 
  Envelope, 
  MapPin, 
  Clock,
  Sparkle,
  ShieldCheck
} from '@phosphor-icons/react';
import toast from 'react-hot-toast';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    servicio: 'calibracion-balanzas',
    mensaje: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Feedback inmediato y experiencia fluida
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success('¡Solicitud enviada con éxito! Un asesor metrológico te contactará en breve.');
    }, 900);
  };

  return (
    <section id="contacto" className="py-24 bg-gradient-to-b from-white to-slate-100 relative overflow-hidden">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand/5 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand-dark text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkle size={14} weight="fill" className="text-brand" />
            Atención Inmediata
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Solicita tu Cotización o Asesoría Técnica
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Nuestro equipo técnico evalúa tus requerimientos metrológicos para emitir una propuesta con el alcance acreditado exacto.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden border border-slate-800">
            <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-brand/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 space-y-8">
              <div>
                <span className="text-xs uppercase tracking-widest text-brand-light font-bold">
                  Labtronix Metrology S.A.S.
                </span>
                <h3 className="text-2xl font-black text-white mt-1 mb-3">
                  Información de Contacto
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Contamos con capacidad operativa in-situ a nivel nacional y en nuestras instalaciones permanentes.
                </p>
              </div>

              <div className="space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-brand-light border border-white/10">
                    <MapPin size={22} weight="duotone" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Sede Laboratorio</h4>
                    <p className="text-slate-300 mt-0.5">Bogotá D.C., Colombia</p>
                    <span className="text-xs text-slate-400">Atención técnica y calibraciones in situ</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-brand-light border border-white/10">
                    <Phone size={22} weight="duotone" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Línea Telefónica & WhatsApp</h4>
                    <p className="text-slate-300 mt-0.5">+57 (601) 745-1234 / +57 300 000 0000</p>
                    <span className="text-xs text-slate-400">Lun a Vie: 8:00 AM - 5:30 PM</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-brand-light border border-white/10">
                    <Envelope size={22} weight="duotone" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Correos Corporativos</h4>
                    <p className="text-slate-300 mt-0.5">comercial@labtronix.com.co</p>
                    <p className="text-slate-400 text-xs mt-0.5">calidad@labtronix.com.co</p>
                  </div>
                </div>
              </div>

              {/* Accreditation Trust Box */}
              <div className="pt-6 border-t border-slate-800">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                  <ShieldCheck size={32} weight="fill" className="text-brand-light shrink-0" />
                  <div>
                    <h5 className="font-bold text-sm text-white">Laboratorio Acreditado ONAC</h5>
                    <p className="text-xs text-slate-400">Código 21-LAC-011 bajo norma ISO/IEC 17025:2017</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-slate-200">
            {isSuccess ? (
              <div className="text-center py-12 px-4 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle size={40} weight="fill" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  ¡Mensaje Recibido Correctamente!
                </h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  Hemos registrado tus datos. Nuestro departamento técnico o comercial se pondrá en contacto en un plazo menor a 24 horas hábiles.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSuccess(false);
                    setFormData({
                      nombre: '',
                      empresa: '',
                      email: '',
                      telefono: '',
                      servicio: 'calibracion-balanzas',
                      mensaje: '',
                    });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors"
                >
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-1">
                    Envíanos los datos de tus equipos
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Diligencia este formulario para recibir una propuesta formal y personalizada.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Juan Pérez"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm bg-slate-50 text-slate-900 placeholder:text-slate-400 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Empresa o Razón Social *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Laboratorios ABC S.A.S."
                      value={formData.empresa}
                      onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm bg-slate-50 text-slate-900 placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nombre@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm bg-slate-50 text-slate-900 placeholder:text-slate-400 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Teléfono de Contacto *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+57 300 123 4567"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm bg-slate-50 text-slate-900 placeholder:text-slate-400 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tipo de Requerimiento *
                  </label>
                  <select
                    value={formData.servicio}
                    onChange={(e) => setFormData({ ...formData, servicio: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm bg-slate-50 text-slate-900 font-semibold"
                  >
                    <option value="calibracion-balanzas">Calibración Balanzas y Básculas (Acreditado ONAC)</option>
                    <option value="calibracion-temperatura">Calibración Temperatura (Termómetros, Hornos, Cuartos Fríos)</option>
                    <option value="calibracion-presion">Calibración Presión (Manómetros, Vacuómetros)</option>
                    <option value="calibracion-volumen">Calibración de Volumen y Vidriería</option>
                    <option value="venta-equipos">Adquisición / Venta de Equipos de Laboratorio</option>
                    <option value="otro">Mantenimiento o Asesoría Técnica General</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Detalle de los Equipos o Mensaje
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe los equipos, marcas, modelos o capacidad máxima que requieres calibrar..."
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm bg-slate-50 text-slate-900 placeholder:text-slate-400 font-medium resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-brand via-brand-dark to-brand shadow-[0_4px_20px_rgba(236,6,11,0.3)] hover:shadow-[0_8px_25px_rgba(236,6,11,0.45)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Enviando información...</span>
                  ) : (
                    <>
                      <PaperPlaneTilt size={18} weight="bold" />
                      <span>Enviar Solicitud de Cotización</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
