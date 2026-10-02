import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Labtronix Metrology | Confianza y Exactitud',
  description: 'Servicios de calibración y venta de equipos de metrología. Confianza y exactitud en cada proceso.',
};

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/lab_hero_1790955109399.jpg" 
            alt="Laboratorio Labtronix" 
            fill
            quality={100}
            priority
            className="object-cover opacity-10 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-50/80 to-transparent"></div>
        </div>
        
        {/* Glow Background */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-sky-400/20 blur-[100px] rounded-full mix-blend-multiply animate-pulse duration-1000 z-0"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-sm font-bold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              Laboratorio Acreditado ONAC
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900 drop-shadow-sm">
              Precisión que <br/>
              <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
                Transforma la Industria
              </span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-xl font-medium">
              Asegura la calidad y confiabilidad de tus procesos con nuestro laboratorio 
              de metrología de clase mundial. Soluciones de calibración y venta de equipos 
              especializados con la mayor exactitud.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#servicios" className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white bg-gradient-to-br from-blue-600 to-sky-500 shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.4)] hover:-translate-y-1 transition-all duration-300">
                Explorar Servicios
              </Link>
              <Link href="#contacto" className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-slate-700 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-1 transition-all duration-300">
                Solicitar Cotización
              </Link>
            </div>
          </div>
          
          <div className="relative h-[500px] hidden lg:block perspective-1000">
            {/* Main Glass Panel */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-white/80 border border-slate-200 backdrop-blur-xl rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)] transform -rotate-y-12 rotate-x-6 hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="font-bold text-lg text-slate-900">Estado del Sistema</div>
                <div className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200">OPERATIVO</div>
              </div>
              
              <div className="mb-5">
                <div className="flex justify-between text-sm text-slate-600 font-medium mb-2">
                  <span>Exactitud Promedio</span>
                  <span className="text-sky-600 font-mono font-bold">99.98%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full w-[99.98%] shadow-sm"></div>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-sm text-slate-600 font-medium mb-2">
                  <span>Confiabilidad Trazable</span>
                  <span className="text-sky-600 font-mono font-bold">100%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full w-full shadow-sm"></div>
                </div>
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute top-1/4 -right-4 bg-white/90 border border-slate-200 backdrop-blur-xl rounded-full px-5 py-3 flex items-center gap-3 shadow-xl animate-bounce duration-[3000ms]">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-xl shadow-inner">🔬</div>
              <span className="font-bold text-sm text-slate-800">Certificación ISO 17025</span>
            </div>
            
            <div className="absolute bottom-1/4 -left-8 bg-white/90 border border-slate-200 backdrop-blur-xl rounded-full px-5 py-3 flex items-center gap-3 shadow-xl animate-pulse">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl shadow-inner">⚡</div>
              <span className="font-bold text-sm text-slate-800">Patrones de Alta Gama</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-24 relative z-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-sky-600 font-bold tracking-wide uppercase text-sm mb-3">Servicios de Laboratorio</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Magnitudes Acreditadas</h3>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium">Cubrimos las necesidades metrológicas más exigentes de la industria con patrones de alta exactitud y personal altamente calificado.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 1, title: 'Masa y Balanzas', icon: '⚖️', desc: 'Calibración de pesas clase E2, F1, F2, M1 y balanzas analíticas hasta alta capacidad.' },
              { id: 2, title: 'Temperatura', icon: '🌡️', desc: 'Certificación de termómetros, hornos, incubadoras, cuartos fríos y termohigrómetros.' },
              { id: 3, title: 'Presión', icon: '⏱️', desc: 'Calibración de manómetros digitales, análogos, vacuómetros y transmisores de presión.' },
              { id: 4, title: 'Volumen', icon: '🧪', desc: 'Material de vidrio para laboratorio, micropipetas, dispensadores y buretas.' }
            ].map((srv) => (
              <div key={srv.id} className="group relative bg-slate-50 border border-slate-200 rounded-3xl p-8 hover:-translate-y-2 transition-all duration-300 hover:border-sky-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="absolute inset-0 bg-radial-gradient from-sky-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-6 inline-block p-4 bg-white rounded-2xl border border-slate-100 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all">{srv.icon}</div>
                  <h4 className="text-xl font-bold mb-3 text-slate-900">{srv.title}</h4>
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed min-h-[80px] font-medium">{srv.desc}</p>
                  <Link href="#" className="inline-flex items-center gap-2 text-sky-600 font-bold text-sm group-hover:text-sky-700 transition-colors">
                    Ver alcance <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment Catalog Section */}
      <section id="productos" className="py-24 relative z-10 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative h-[500px] rounded-3xl overflow-hidden border border-slate-200 shadow-xl group">
              <Image 
                src="/images/equipment_scale_1790955120303.jpg" 
                alt="Balanza de alta precisión" 
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl p-6 shadow-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-slate-900 font-extrabold text-xl">Quantus Pro 1000</h4>
                    <span className="bg-sky-100 text-sky-700 font-bold text-xs px-2 py-1 rounded border border-sky-200">NUEVO</span>
                  </div>
                  <p className="text-slate-600 font-medium text-sm mb-4">Balanza analítica ultra-precisa con calibración interna automática.</p>
                  <Link href="#contacto" className="text-sky-600 font-bold text-sm hover:text-sky-700 flex items-center gap-2">
                    Solicitar cotización <span className="text-lg">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="text-sky-600 font-bold tracking-wide uppercase text-sm mb-3">Venta de Equipos</h2>
              <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Equipamiento de <br/>Última Generación</h3>
              <p className="text-slate-600 font-medium text-lg mb-8">
                No solo calibramos tus equipos, también somos distribuidores autorizados de las mejores marcas a nivel mundial. Renueva tu laboratorio con tecnología de punta.
              </p>
              
              <ul className="space-y-4 mb-10">
                {['Balanzas analíticas y de precisión', 'Termómetros e instrumentos de temperatura', 'Masas patrón y pesas OIML', 'Sistemas de adquisición de datos'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              
              <Link href="#contacto" className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white bg-slate-900 border border-slate-800 shadow-md hover:bg-slate-800 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                Ver Catálogo Completo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Accreditations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">Acreditados y Avalados por los mejores</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 text-slate-800">
            {/* Logos Placeholders - In a real app we would use Next/Image for these */}
            <div className="text-2xl font-black font-serif">ONAC</div>
            <div className="text-2xl font-black">ISO 17025</div>
            <div className="text-2xl font-black tracking-tighter">BUREAU VERITAS</div>
            <div className="text-2xl font-black italic">ILAC-MRA</div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 max-w-5xl mx-auto px-6 relative z-10">
        <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-sky-100 rounded-[3rem] p-12 text-center shadow-[0_20px_50px_rgba(14,165,233,0.15)] relative overflow-hidden">
          {/* Decorative blur in CTA */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-sky-300/30 blur-[80px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-400/20 blur-[80px] rounded-full"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">Eleva tus estándares <br/>de calidad hoy mismo</h2>
            <p className="text-slate-600 font-medium text-lg mb-10 max-w-2xl mx-auto">
              Únete a las empresas líderes que ya confían en la exactitud y trazabilidad de Labtronix. Gestiona tus certificados y equipos desde nuestro portal.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/login" className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white bg-gradient-to-br from-blue-600 to-sky-500 shadow-[0_4px_20px_rgba(14,165,233,0.3)] hover:shadow-[0_8px_30px_rgba(14,165,233,0.5)] hover:-translate-y-1 transition-all duration-300">
                Ingresar al Portal de Clientes
              </Link>
              <Link href="#contacto" className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-slate-700 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 hover:-translate-y-1 transition-all duration-300">
                Contactar a un Asesor
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
