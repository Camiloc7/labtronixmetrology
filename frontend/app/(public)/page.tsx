import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Labtronix Metrology | Confianza y Exactitud',
  description: 'Servicios de calibración y venta de equipos de metrología. Confianza y exactitud en cada proceso.',
};

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-glow"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Precisión que <br/>
            <span className="text-gradient">Transforma la Industria</span>
          </h1>
          <p className="hero-subtitle">
            Asegura la calidad y confiabilidad de tus procesos con nuestro laboratorio 
            de metrología de clase mundial y catálogo de equipos especializados.
          </p>
          <div className="hero-actions">
            <Link href="#servicios" className="btn btn-primary pulse-animation">
              Explorar Servicios
            </Link>
            <Link href="#contacto" className="btn btn-outline">
              Solicitar Cotización
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="glass-panel main-panel">
            <div className="panel-header">Estado de Calibración</div>
            <div className="panel-body">
              <div className="status-item">
                <div className="status-label">Precisión</div>
                <div className="status-bar"><div className="bar-fill" style={{ width: '99.9%' }}></div></div>
                <div className="status-value">99.9%</div>
              </div>
              <div className="status-item">
                <div className="status-label">Confiabilidad</div>
                <div className="status-bar"><div className="bar-fill" style={{ width: '100%' }}></div></div>
                <div className="status-value">100%</div>
              </div>
            </div>
          </div>
          <div className="glass-panel float-panel float-1">
            <div className="icon-badge">🔬</div>
            <div className="text-badge">Laboratorio Acreditado</div>
          </div>
          <div className="glass-panel float-panel float-2">
            <div className="icon-badge">⚡</div>
            <div className="text-badge">Equipos de Última Generación</div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="services-section">
        <div className="section-header">
          <h2 className="section-title">Nuestros Servicios</h2>
          <p className="section-desc">Soluciones integrales de metrología para todas las magnitudes.</p>
        </div>
        <div className="services-grid">
          {[
            { id: 1, title: 'Masa y Balanzas', icon: '⚖️', desc: 'Calibración de pesas y todo tipo de balanzas analíticas y de precisión.' },
            { id: 2, title: 'Temperatura', icon: '🌡️', desc: 'Certificación de termómetros, hornos, incubadoras y cuartos fríos.' },
            { id: 3, title: 'Presión', icon: '⏱️', desc: 'Calibración de manómetros, vacuómetros y transmisores de presión.' },
            { id: 4, title: 'Volumen', icon: '🧪', desc: 'Material de vidrio, micropipetas y dispensadores.' }
          ].map((srv) => (
            <div key={srv.id} className="service-card">
              <div className="service-icon">{srv.icon}</div>
              <h3 className="service-title">{srv.title}</h3>
              <p className="service-desc">{srv.desc}</p>
              <Link href="#" className="service-link">Saber más &rarr;</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="cta-container glass-panel">
          <h2>¿Listo para elevar tus estándares de calidad?</h2>
          <p>Únete a las cientos de empresas que ya confían en la exactitud de Labtronix.</p>
          <Link href="/login" className="btn btn-primary">Ingresar al Portal</Link>
        </div>
      </section>
    </div>
  );
}
