import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Scales, 
  Thermometer, 
  Gauge, 
  Flask, 
  Ruler, 
  Lightning, 
  Clock, 
  Cpu, 
  CheckCircle, 
  ArrowRight, 
  Sparkle, 
  CaretRight, 
  Medal, 
  FileText, 
  UsersThree,
  Building,
  Target
} from '@phosphor-icons/react/dist/ssr';
import ContactSection from '@/components/layout/ContactSection';

export const metadata: Metadata = {
  title: 'Labtronix Metrology | Laboratorio de Calibración Acreditado ONAC ISO/IEC 17025',
  description: 'Servicios especializados de calibración metrológica y venta de instrumental de precisión en Colombia. Acreditación ONAC 21-LAC-011.',
};

export default function LandingPage() {
  return (
    <div className="relative overflow-x-hidden">

      {/* ─── 1. HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center pt-8 pb-20 bg-slate-950 text-white overflow-hidden">
        {/* Real Lab Background with dynamic overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/lab_hero_1790955109399.jpg" 
            alt="Laboratorio Metrológico Labtronix" 
            fill
            quality={95}
            priority
            className="object-cover opacity-25 mix-blend-luminosity scale-105 animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent"></div>
        </div>

        {/* Ambient Red Glows */}
        <div className="absolute -top-24 right-1/4 w-[600px] h-[600px] bg-brand/20 blur-[140px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-brand-light/10 blur-[130px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md shadow-inner text-xs sm:text-sm font-bold text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-light animate-ping"></span>
                <ShieldCheck size={18} weight="fill" className="text-brand-light" />
                <span>Laboratorio Acreditado ONAC Código <strong>21-LAC-011</strong></span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] text-white">
                Exactitud y <br />
                <span className="bg-gradient-to-r from-white via-slate-200 to-brand-light bg-clip-text text-transparent">
                  Trazabilidad Confiable
                </span> <br />
                para tu Industria.
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-xl text-slate-300 font-normal max-w-2xl leading-relaxed">
                Garantizamos la conformidad técnica de tus instrumentos bajo la norma internacional <strong className="text-white">ISO/IEC 17025:2017</strong>. Emisión ágil de certificados digitales y calibraciones in situ.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link 
                  href="#contacto" 
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider text-white bg-gradient-to-r from-brand to-brand-light shadow-[0_4px_24px_rgba(236,6,11,0.4)] hover:shadow-[0_8px_32px_rgba(236,6,11,0.6)] hover:-translate-y-0.5 transition-all"
                >
                  <span>Cotizar Calibración</span>
                  <ArrowRight size={18} weight="bold" />
                </Link>

                <Link 
                  href="#servicios" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-slate-200 bg-white/5 hover:bg-white/10 border border-white/15 backdrop-blur-sm hover:-translate-y-0.5 transition-all"
                >
                  <span>Explorar Alcance</span>
                </Link>
              </div>

              {/* Fast trust stats */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">0 - 2000<span className="text-xs text-brand-light font-normal ml-0.5">kg</span></div>
                  <div className="text-xs text-slate-400 mt-0.5">Alcance Acreditado Balanzas</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">&gt;10,000</div>
                  <div className="text-xs text-slate-400 mt-0.5">Instrumentos Calibrados</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-white font-mono">100%</div>
                  <div className="text-xs text-slate-400 mt-0.5">Trazabilidad Internacional</div>
                </div>
              </div>

            </div>

            {/* Right Card / Glass Panel */}
            <div className="lg:col-span-5 relative">
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
                
                {/* Panel Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand/20 flex items-center justify-center text-brand-light border border-brand/30">
                      <Scales size={22} weight="duotone" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white leading-tight">Servicio Certificado</h2>
                      <p className="text-xs text-slate-400">Patrones clase E2, F1, F2</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    <CheckCircle size={14} weight="fill" />
                    Vigente ONAC
                  </span>
                </div>

                {/* Accuracy meter demo */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                      <span>Exactitud & Confiabilidad Metrológica</span>
                      <span className="text-brand-light font-mono font-bold">99.99%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-brand to-brand-light h-full w-[99.99%] rounded-full shadow-sm"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                      <span>Cumplimiento Tiempos de Entrega</span>
                      <span className="text-emerald-400 font-mono font-bold">98.5%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[98.5%] rounded-full shadow-sm"></div>
                    </div>
                  </div>
                </div>

                {/* Scope pill badges */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Certificación en línea
                  </div>
                  <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium flex items-center gap-2">
                        <FileText size={16} className="text-brand-light" />
                        Certificados con Código QR
                      </span>
                      <span className="text-slate-400 font-mono">Trazable</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium flex items-center gap-2">
                        <Cpu size={16} className="text-brand-light" />
                        Monitoreo Digital de Equipos
                      </span>
                      <span className="text-slate-400 font-mono">Portal 24/7</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link 
                    href="/login" 
                    className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Ingresar al Portal para Consultar Certificados</span>
                    <ArrowRight size={14} weight="bold" />
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ─── 2. ONAC ACCREDITATION SPOTLIGHT ─────────────────────────────────── */}
      <section id="acreditacion" className="py-20 bg-slate-900 border-y border-slate-800 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand/20 border border-brand/30 text-brand-light text-xs font-bold uppercase tracking-wider">
                <Medal size={16} weight="fill" />
                Respaldo Institucional Oficial
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Acreditación ONAC Nº 21-LAC-011
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Labtronix Metrology S.A.S. cuenta con acreditación otorgada por el <strong className="text-white">Organismo Nacional de Acreditación de Colombia (ONAC)</strong> bajo la norma internacional <strong className="text-white">NTC-ISO/IEC 17025:2017</strong>, asegurando que nuestros resultados son técnica y legalmente válidos para auditorías ISO, INVIMA, ICA y entidades de inspección.
              </p>
              <div className="flex flex-wrap gap-6 pt-2 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} weight="fill" className="text-brand-light" />
                  <span>Patrones con trazabilidad al INM y PTB</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} weight="fill" className="text-brand-light" />
                  <span>Personal técnico certificado</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} weight="fill" className="text-brand-light" />
                  <span>Incertidumbres mínimas garantizadas</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mx-auto p-2">
                <Image 
                  src="/logo.png" 
                  alt="Labtronix" 
                  width={48} 
                  height={48} 
                  className="object-contain"
                />
              </div>
              <div className="font-mono text-2xl font-black text-white">
                ISO/IEC 17025
              </div>
              <p className="text-xs text-slate-400">
                Pesaje no automático de 0 g a 2000 kg. Calibraciones con validez internacional ilac-MRA.
              </p>
              <a 
                href="#contacto" 
                className="inline-block w-full py-2.5 rounded-xl bg-brand hover:bg-brand-light text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Solicitar Alcance Técnico
              </a>
            </div>

          </div>
        </div>
      </section>


      {/* ─── 3. SERVICES SECTION (MAGNITUDES) ─────────────────────────────────── */}
      <section id="servicios" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-brand text-xs font-bold uppercase tracking-widest">
              Nuestros Servicios
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-2 mb-4">
              Magnitudes y Calibración Especializada
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium">
              Ofrecemos soluciones metrológicas integrales con cobertura in-situ en tu planta o en nuestro laboratorio central.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1: Masa (Acreditado) */}
            <div className="group bg-slate-50 hover:bg-white rounded-3xl p-8 border-2 border-brand/20 hover:border-brand shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 rounded-full bg-brand text-white text-[10px] font-black uppercase tracking-wider">
                  Acreditado ONAC
                </span>
              </div>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Scales size={32} weight="duotone" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Masa y Balanzas
                </h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed font-medium">
                  Calibración de balanzas analíticas, semianalíticas, de precisión, básculas y pesas patrón (clases E2, F1, F2 y M1) de 0 g a 2000 kg.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <Link href="#contacto" className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-dark uppercase tracking-wider">
                  <span>Solicitar calibración</span>
                  <CaretRight size={14} weight="bold" />
                </Link>
              </div>
            </div>

            {/* Card 2: Temperatura */}
            <div className="group bg-slate-50 hover:bg-white rounded-3xl p-8 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-200 text-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Thermometer size={32} weight="duotone" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Temperatura y Humedad
                </h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed font-medium">
                  Caracterización y calibración de termómetros digitales, termohigrómetros, cuartos fríos, hornos, incubadoras, autoclaves y baños termostáticos.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <Link href="#contacto" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-brand uppercase tracking-wider">
                  <span>Solicitar cotización</span>
                  <CaretRight size={14} weight="bold" />
                </Link>
              </div>
            </div>

            {/* Card 3: Presión */}
            <div className="group bg-slate-50 hover:bg-white rounded-3xl p-8 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-200 text-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Gauge size={32} weight="duotone" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Presión y Vacío
                </h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed font-medium">
                  Calibración de manómetros análogos y digitales, transmisores de presión, presostatos y vacuómetros en amplio rango de operación.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <Link href="#contacto" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-brand uppercase tracking-wider">
                  <span>Solicitar cotización</span>
                  <CaretRight size={14} weight="bold" />
                </Link>
              </div>
            </div>

            {/* Card 4: Volumen */}
            <div className="group bg-slate-50 hover:bg-white rounded-3xl p-8 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-200 text-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Flask size={32} weight="duotone" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Volumen y Vidriería
                </h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed font-medium">
                  Calibración gravimétrica de micropipetas monocanal y multicanal, dispensadores, buretas digitales y material de vidrio volumétrico.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <Link href="#contacto" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-brand uppercase tracking-wider">
                  <span>Solicitar cotización</span>
                  <CaretRight size={14} weight="bold" />
                </Link>
              </div>
            </div>

            {/* Card 5: Dimensional */}
            <div className="group bg-slate-50 hover:bg-white rounded-3xl p-8 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-200 text-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Ruler size={32} weight="duotone" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Longitud y Dimensional
                </h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed font-medium">
                  Calibración de calibradores pie de rey, micrómetros de exteriores e interiores, comparadores de carátula y cintas métricas industriales.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <Link href="#contacto" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-brand uppercase tracking-wider">
                  <span>Solicitar cotización</span>
                  <CaretRight size={14} weight="bold" />
                </Link>
              </div>
            </div>

            {/* Card 6: Tiempo y Frecuencia */}
            <div className="group bg-slate-50 hover:bg-white rounded-3xl p-8 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-200 text-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock size={32} weight="duotone" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Tiempo, Frecuencia y Eléctrica
                </h3>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed font-medium">
                  Calibración de cronómetros digitales, tacómetros ópticos/contacto, multímetros y analizadores de parámetros eléctricos.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <Link href="#contacto" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-brand uppercase tracking-wider">
                  <span>Solicitar cotización</span>
                  <CaretRight size={14} weight="bold" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ─── 4. EQUIPMENT SALE & LAB HARDWARE ───────────────────────────────── */}
      <section id="productos" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 relative h-[450px] sm:h-[500px] rounded-3xl overflow-hidden border border-slate-200 shadow-2xl group">
              <Image 
                src="/images/equipment_scale_1790955120303.jpg" 
                alt="Instrumental de pesaje y metrología Labtronix" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-slate-100 shadow-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-900 text-base">Balanzas Analíticas de Alta Precisión</span>
                    <span className="px-2 py-0.5 rounded bg-brand/10 text-brand-dark text-[11px] font-bold">Disponibilidad Inmediata</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Equipos suministrados con certificado de calibración acreditado ONAC listo para uso industrial.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-brand text-xs font-bold uppercase tracking-widest">
                Distribución Oficial
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Venta y Mantenimiento de Equipamiento
              </h2>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                Suministramos instrumentación de pesaje y medición de los principales fabricantes mundiales, entregados con protocolo de calificación y certificado de calibración inicial.
              </p>

              <div className="space-y-3.5 pt-2">
                {[
                  'Balanzas analíticas, semianalíticas y básculas industriales',
                  'Pesas patrón clases OIML E2, F1, F2 y M1 en acero inoxidable',
                  'Termohigrómetros y data loggers con trazabilidad',
                  'Manómetros digitales de alta exactitud',
                  'Sistemas de adquisición y software metrológico'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-slate-800 text-sm font-semibold">
                    <div className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0">
                      <CheckCircle size={16} weight="fill" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link 
                  href="#contacto" 
                  className="px-8 py-4 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
                >
                  Solicitar Cotización de Equipos
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* ─── 5. ABOUT US SECTION (UNIFIED #nosotros) ────────────────────────── */}
      <section id="nosotros" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-brand text-xs font-bold uppercase tracking-widest">
              Nuestra Compañía
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-2 mb-4">
              Excelencia Metrológica desde 2019
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium">
              Labtronix Metrology S.A.S. nació con el propósito de elevar los estándares de exactitud y confiabilidad para laboratorios de ensayo, industria farmacéutica, alimentaria y manufactura.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                <Target size={28} weight="duotone" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Misión</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Proveer servicios metrológicos de la más alta exactitud y confiabilidad técnica, respaldados por personal calificado y patrones de referencia trazables a organismos internacionales.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <Building size={28} weight="duotone" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Visión</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                Consolidarnos como el laboratorio de metrología referente en Colombia y la región andina, reconocidos por la innovación digital en la gestión de calibraciones y la transparencia técnica.
              </p>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                <UsersThree size={28} weight="duotone" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Valores Corporativos</h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {['Calidad', 'Confiabilidad', 'Transparencia', 'Pasión', 'Compromiso', 'Liderazgo'].map((val) => (
                  <span key={val} className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-2xs">
                    {val}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Quick numbers banner */}
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
              <div className="pt-4 md:pt-0">
                <div className="font-mono text-3xl sm:text-4xl font-black text-brand-light">2019</div>
                <div className="text-xs uppercase tracking-wider text-slate-400 mt-1">Año de Fundación</div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="font-mono text-3xl sm:text-4xl font-black text-white">17025</div>
                <div className="text-xs uppercase tracking-wider text-slate-400 mt-1">Norma Acreditada</div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="font-mono text-3xl sm:text-4xl font-black text-brand-light">100%</div>
                <div className="text-xs uppercase tracking-wider text-slate-400 mt-1">Validez Auditorías</div>
              </div>
              <div className="pt-4 md:pt-0">
                <div className="font-mono text-3xl sm:text-4xl font-black text-white">24/7</div>
                <div className="text-xs uppercase tracking-wider text-slate-400 mt-1">Portal de Certificados</div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* ─── 6. INTERACTIVE CONTACT SECTION ─────────────────────────────────── */}
      <ContactSection />

    </div>
  );
}
