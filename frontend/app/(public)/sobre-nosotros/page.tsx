import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Scales, 
  Thermometer, 
  Gauge, 
  Flask, 
  Ruler, 
  Clock, 
  CheckCircle,
  ArrowRight
} from '@phosphor-icons/react/dist/ssr';

export const metadata: Metadata = {
  title: 'Sobre nosotros',
  description: 'Conoce la historia, valores y alcance técnico de Labtronix Metrology SAS. Acreditación ONAC 21-LAC-011 bajo la norma NTC-ISO/IEC 17025:2017.',
  alternates: { canonical: '/sobre-nosotros' },
};

export default function SobreNosotrosPage() {
  return (
    <div className="bg-slate-50 min-h-screen pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand-dark text-xs font-bold uppercase tracking-wider mb-4">
            Trayectoria & Calidad
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Excelencia Metrológica al Servicio de la Industria
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Labtronix Metrology S.A.S. se consolida como un aliado técnico estratégico para empresas que exigen los más altos estándares de calidad, trazabilidad y cumplimiento normativo.
          </p>
        </div>

        {/* Historia & Valores */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-20">
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Nuestra Historia
            </h2>
            <p className="text-slate-600 leading-relaxed font-medium">
              Desde nuestros inicios en el año 2019 en Bogotá, Colombia, identificamos la necesidad de la industria farmacéutica, alimentaria, química y manufacturera de contar con un servicio de calibración metrológica transparente, riguroso y con tiempos de respuesta óptimos.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              A lo largo de los años nos hemos enfocado en la inversión continua en patrones de alta gama trazables internacionalmente (INM y PTB de Alemania), sistemas de gestión digitalizados y capacitación especializada de nuestros metrólogos.
            </p>
            
            <div className="pt-2">
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
                Pilares que nos definen
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {['Exactitud', 'Confiabilidad', 'Transparencia', 'Innovación Digital', 'Compromiso', 'Liderazgo'].map((val) => (
                  <span key={val} className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
                    {val}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[380px] rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
            <Image 
              src="/images/original/termohigrometros.jpg"
              alt="Instalaciones de Labtronix Metrology" 
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-xs uppercase font-bold tracking-widest text-brand-light">Sede Principal</span>
              <p className="text-base font-bold">Laboratorio de calibración y metrología física</p>
            </div>
          </div>
        </div>

        {/* Acreditación ONAC Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden mb-20 border border-slate-800">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/20 border border-brand/30 text-brand-light text-xs font-bold uppercase tracking-wider">
                <ShieldCheck size={16} weight="fill" />
                Certificación Internacional
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Acreditación ONAC Código 21-LAC-011
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Contamos con la acreditación del Organismo Nacional de Acreditación de Colombia (ONAC), vigente y respaldada bajo la norma <strong>NTC-ISO/IEC 17025:2017</strong> en la magnitud de <strong>Masa (pesaje no automático) de 0 g a 2000 kg</strong>.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-300 pt-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={16} weight="fill" className="text-brand-light" />
                  Validez en auditorías internacionales
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle size={16} weight="fill" className="text-brand-light" />
                  Acuerdo de reconocimiento mutuo ILAC-MRA
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
              <div className="font-mono text-3xl font-black text-brand-light">ISO 17025</div>
              <p className="text-xs text-slate-400">
                Garantía técnica de competencia para laboratorios de ensayo y calibración.
              </p>
              <Link 
                href="/#contacto" 
                className="inline-block w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Solicitar Cotización
              </Link>
            </div>
          </div>
        </div>

        {/* Magnitudes Globales */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center">
          <span className="text-brand text-xs font-bold uppercase tracking-widest">
            Cobertura Integral
          </span>
          <h2 className="text-3xl font-black text-slate-900 mt-2 mb-4">
            Magnitudes Metrológicas Atendidas
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-sm sm:text-base font-medium mb-10">
            Además de nuestro alcance acreditado principal, gestionamos calibraciones trazables para responder a todas las exigencias de tu planta.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Masa y Balanzas', icon: <Scales size={24} weight="duotone" /> },
              { label: 'Temperatura', icon: <Thermometer size={24} weight="duotone" /> },
              { label: 'Presión y Vacío', icon: <Gauge size={24} weight="duotone" /> },
              { label: 'Volumen', icon: <Flask size={24} weight="duotone" /> },
              { label: 'Dimensional', icon: <Ruler size={24} weight="duotone" /> },
              { label: 'Tiempo y Frecuencia', icon: <Clock size={24} weight="duotone" /> },
            ].map((mag, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:border-brand transition-colors">
                <div className="text-brand">{mag.icon}</div>
                <span className="text-xs font-bold text-slate-800">{mag.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <Link 
              href="/#contacto" 
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-dark transition-colors shadow-md"
            >
              <span>Contáctanos hoy</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
