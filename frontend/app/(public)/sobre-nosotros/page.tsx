import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sobre Nosotros | Labtronix Metrology',
  description: 'Conoce la historia, valores y acreditaciones de Labtronix Metrology SAS. Acreditados por ONAC bajo la norma IEC 17025:2017.',
};

export default function SobreNosotrosPage() {
  return (
    <div className="relative bg-slate-50 min-h-screen pt-28 pb-20">
      {/* Decorative blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-100/50 blur-[100px] rounded-full mix-blend-multiply pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold mb-6">
            Nuestra Esencia
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Excelencia Metrológica desde 2019
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Labtronix Metrology SAS nace como una alternativa integral en la cual nuestros clientes pueden encontrar 
            soluciones metrológicas enmarcadas en los más altos estándares de calidad.
          </p>
        </div>

        {/* Historia y Valores Section */}
        <section className="mb-24 grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Nuestra Historia y Valores</h2>
            <p className="text-slate-600 font-medium leading-relaxed mb-6">
              Desde nuestros inicios en el año 2019, hemos consolidado un equipo de trabajo identificado por nuestros principios corporativos. 
              Creemos firmemente en que la exactitud y la confiabilidad son la base del éxito industrial.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Calidad', 'Confiabilidad', 'Pasión', 'Compromiso', 'Liderazgo'].map((val) => (
                <span key={val} className="bg-sky-50 text-sky-700 px-4 py-2 rounded-lg text-sm font-bold border border-sky-100">
                  {val}
                </span>
              ))}
            </div>
          </div>
          <div className="relative h-full min-h-[300px] rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-gradient-to-br from-slate-200 to-slate-300">
             {/* Placeholder for an office/lab team image */}
             <div className="absolute inset-0 bg-sky-900/10 mix-blend-multiply"></div>
             <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-bold">
               [ Espacio para imagen del equipo / instalaciones ]
             </div>
          </div>
        </section>

        {/* Acreditaciones Section */}
        <section className="mb-24">
          <div className="bg-slate-900 rounded-[3rem] p-12 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-sky-500/20 blur-[80px] rounded-full"></div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-white mb-6">Acreditación ONAC <br/><span className="text-sky-400">21-LAC-011</span></h2>
                <p className="text-slate-300 font-medium mb-6">
                  Contamos con la acreditación ONAC, vigente a la fecha, bajo la estricta norma 
                  <strong> NTC-ISO/IEC 17025:2017</strong>, garantizando que nuestro sistema de gestión 
                  cumple con todos los requerimientos técnicos y de calidad.
                </p>
                <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md">
                  <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                    <span className="text-2xl">⚖️</span> Alcance Acreditado Principal
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Calibración de instrumentos de pesaje de funcionamiento no automático (balanzas y básculas) en el intervalo de:
                  </p>
                  <div className="mt-4 font-mono text-xl text-sky-400 font-bold bg-slate-950/50 py-3 px-4 rounded-lg inline-block border border-sky-500/30">
                    0 g &lt; m ≤ 2000 kg
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 {/* Visual decoration for accreditations */}
                 <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                   <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4 font-bold text-xl">ISO</div>
                   <span className="text-white font-bold text-sm">17025:2017</span>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                   <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mb-4 font-bold text-xl">✓</div>
                   <span className="text-white font-bold text-sm">Auditorías <br/>Superadas</span>
                 </div>
                 <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center col-span-2">
                   <div className="w-full flex items-center justify-center text-slate-400 font-bold text-3xl tracking-widest opacity-50">ONAC</div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Otros Servicios Section */}
        <section className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Alcance Integral</h2>
            <p className="text-slate-600 font-medium max-w-2xl mx-auto">
              Además de nuestro alcance principal, ofrecemos servicios de calibración trazables o tercerizados 
              para cubrir absolutamente todas las necesidades de exactitud en tus procesos de medición.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { id: 'temp', label: 'Temperatura', icon: '🌡️' },
              { id: 'dim', label: 'Dimensional', icon: '📏' },
              { id: 'vol', label: 'Volumen', icon: '🧪' },
              { id: 'pres', label: 'Presión', icon: '⏱️' },
              { id: 'env', label: 'Medidores Ambientales', icon: '🌤️' },
              { id: 'elec', label: 'Eléctrica', icon: '⚡' },
              { id: 'chem', label: 'Electroquímica', icon: '🔋' },
              { id: 'time', label: 'Tiempo y Frecuencia', icon: '⌚' },
            ].map((service) => (
              <div key={service.id} className="bg-white border border-slate-200 px-6 py-4 rounded-full flex items-center gap-3 shadow-sm hover:shadow-md hover:border-sky-300 transition-all cursor-default">
                <span className="text-xl">{service.icon}</span>
                <span className="text-slate-800 font-bold text-sm">{service.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Return */}
        <div className="text-center mt-20">
          <Link href="/#contacto" className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white bg-gradient-to-br from-blue-600 to-sky-500 shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.4)] hover:-translate-y-1 transition-all duration-300">
            Contáctanos ahora
          </Link>
        </div>

      </div>
    </div>
  );
}
