'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { CaretLeft, CaretRight, ShieldCheck, WhatsappLogo, ArrowRight } from '@phosphor-icons/react';

interface Slide {
  id: number;
  badge: string;
  headline: string;
  subtext?: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    badge: 'NUESTROS PILARES',
    headline: 'La confiabilidad, liderazgo y compromiso son nuestros pilares, nos esforzamos por construir relaciones de confianza a largo plazo con nuestros stakeholders.',
    subtext: 'Acompañamos a laboratorios e industrias de todo el país con rigor técnico y trazabilidad internacional.',
    ctaText: 'Solicitar cotización',
    ctaHref: '#contacto',
    secondaryCtaText: 'Hablar con un asesor',
    secondaryCtaHref: 'https://wa.me/573160249528',
  },
  {
    id: 2,
    badge: 'CALIBRACIÓN ACREDITADA ONAC',
    headline: 'Confianza y exactitud en cada calibración bajo la norma ISO/IEC 17025:2017.',
    subtext: 'Código de acreditación 21-LAC-011 vigente para instrumentos de pesaje de funcionamiento no automático hasta 2.000 kg.',
    ctaText: 'Conocer alcance acreditado',
    ctaHref: '/acreditacion',
    secondaryCtaText: 'Ver nuestros servicios',
    secondaryCtaHref: '/servicios',
  },
  {
    id: 3,
    badge: 'SOLUCIONES INTEGRALES',
    headline: 'Equipamiento de última generación y calibración metrológica para potenciar tu operación.',
    subtext: 'Básculas, balanzas analíticas, masas patrón, temperatura y presión con certificados digitales de acceso 24/7.',
    ctaText: 'Explorar equipos y catálogo',
    ctaHref: '/equipos',
    secondaryCtaText: 'Cotizar servicio',
    secondaryCtaHref: '#contacto',
  },
];

export default function HomeHeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <div
      className="relative overflow-hidden bg-slate-950 text-white min-h-[580px] sm:min-h-[620px] lg:min-h-[660px] flex items-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Carrusel de bienvenida y pilares corporativos"
      role="region"
    >
      {/* Fondo técnico sutil con mallas geométricas y glow en rojo corporativo */}
      <div className="absolute inset-0 bg-[radial-gradient(#ec060b_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.07]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#ec060b]/15 blur-[140px] pointer-events-none rounded-full" />
      
      {/* Contenido de diapositivas */}
      <div className="relative mx-auto w-full max-w-5xl px-6 sm:px-12 lg:px-16 py-16 sm:py-20 text-center z-10">
        {SLIDES.map((slide, idx) => {
          const isActive = idx === current;
          return (
            <div
              key={slide.id}
              className={`transition-all duration-700 ease-out ${
                isActive
                  ? 'opacity-100 scale-100 translate-y-0 relative'
                  : 'opacity-0 scale-[0.98] translate-y-4 absolute inset-0 pointer-events-none'
              }`}
              aria-hidden={!isActive}
            >
              {/* Badge superior */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ec060b]/40 bg-[#ec060b]/10 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-[#ff3338] mb-8">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ec060b] animate-ping" />
                {slide.badge}
              </div>

              {/* Título de alto impacto */}
              <h1 className="text-2xl sm:text-4xl lg:text-[2.85rem] font-semibold leading-[1.25] tracking-tight text-white max-w-4xl mx-auto drop-shadow-sm">
                {slide.headline}
              </h1>

              {/* Subtexto descriptivo */}
              {slide.subtext && (
                <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
                  {slide.subtext}
                </p>
              )}

              {/* Botones de acción */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={slide.ctaHref}
                  className="inline-flex items-center gap-2 rounded-md bg-[#ec060b] px-7 py-3.5 text-sm sm:text-base font-semibold text-white transition-all duration-200 hover:bg-[#b80008] hover:shadow-[0_4px_25px_rgba(236,6,11,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ec060b]"
                >
                  {slide.ctaText}
                  <ArrowRight size={18} weight="bold" />
                </Link>

                {slide.secondaryCtaHref && slide.secondaryCtaText && (
                  <Link
                    href={slide.secondaryCtaHref}
                    target={slide.secondaryCtaHref.startsWith('http') ? '_blank' : undefined}
                    rel={slide.secondaryCtaHref.startsWith('http') ? 'noreferrer' : undefined}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/60 backdrop-blur px-6 py-3.5 text-sm sm:text-base font-medium text-slate-200 transition-colors duration-200 hover:bg-slate-800 hover:text-white"
                  >
                    {slide.secondaryCtaHref.includes('wa.me') && (
                      <WhatsappLogo size={20} weight="fill" className="text-emerald-400" />
                    )}
                    {slide.secondaryCtaText}
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Flechas de navegación interactiva */}
      <button
        onClick={prevSlide}
        type="button"
        aria-label="Diapositiva anterior"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/10 bg-slate-900/60 text-slate-300 backdrop-blur transition-all hover:bg-[#ec060b] hover:text-white hover:border-[#ec060b] hover:scale-105"
      >
        <CaretLeft size={24} weight="bold" />
      </button>

      <button
        onClick={nextSlide}
        type="button"
        aria-label="Diapositiva siguiente"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/10 bg-slate-900/60 text-slate-300 backdrop-blur transition-all hover:bg-[#ec060b] hover:text-white hover:border-[#ec060b] hover:scale-105"
      >
        <CaretRight size={24} weight="bold" />
      </button>

      {/* Puntos de paginación (dots) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
        {SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setCurrent(idx)}
            aria-label={`Ir a la diapositiva ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              idx === current
                ? 'w-8 h-2.5 bg-[#ec060b]'
                : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
