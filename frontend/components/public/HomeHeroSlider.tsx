'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { CaretLeft, CaretRight, WhatsappLogo, ArrowRight, Play, Pause } from '@phosphor-icons/react';

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
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

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
    }, 7000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };

  return (
    <div
      className="relative overflow-hidden bg-slate-950 text-white min-h-[620px] sm:min-h-[660px] lg:min-h-[720px] flex items-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Banner principal Labtronix con video de fondo y frases institucionales"
      role="region"
    >
      {/* ─── Video de Fondo Oficial en Bucle (Banner-Labtronix-1.mp4) ─── */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover scale-105 filter brightness-[0.45] contrast-125 transition-transform duration-1000"
        >
          <source src="/Banner-Labtronix-1.mp4" type="video/mp4" />
        </video>
        {/* Capa de degradado profesional para asegurar legibilidad absoluta del texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/60" />
        <div className="absolute inset-0 bg-[radial-gradient(#ec060b_1px,transparent_1px)] [background-size:28px_28px] opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[350px] bg-[#ec060b]/20 blur-[150px] pointer-events-none rounded-full" />
      </div>

      {/* Control de pausa/reproducción del video */}
      <button
        onClick={toggleVideoPlayback}
        type="button"
        title={isVideoPlaying ? 'Pausar video de fondo' : 'Reproducir video de fondo'}
        className="absolute top-6 right-6 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-slate-950/60 text-slate-300 backdrop-blur hover:bg-[#ec060b] hover:text-white transition-colors"
      >
        {isVideoPlaying ? <Pause size={14} weight="fill" /> : <Play size={14} weight="fill" />}
      </button>

      {/* Contenido de diapositivas */}
      <div className="relative mx-auto w-full max-w-5xl px-6 sm:px-12 lg:px-16 py-16 sm:py-24 text-center z-10">
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
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ec060b]/40 bg-[#ec060b]/20 backdrop-blur-md px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-[#ff4d52] mb-8 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ec060b] animate-ping" />
                {slide.badge}
              </div>

              {/* Título de alto impacto */}
              <h1 className="text-2xl sm:text-4xl lg:text-[2.85rem] font-semibold leading-[1.25] tracking-tight text-white max-w-4xl mx-auto drop-shadow-md">
                {slide.headline}
              </h1>

              {/* Subtexto descriptivo */}
              {slide.subtext && (
                <p className="mt-6 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal drop-shadow">
                  {slide.subtext}
                </p>
              )}

              {/* Botones de acción */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={slide.ctaHref}
                  className="inline-flex items-center gap-2 rounded-md bg-[#ec060b] px-7 py-3.5 text-sm sm:text-base font-semibold text-white transition-all duration-200 hover:bg-[#b80008] hover:shadow-[0_4px_25px_rgba(236,6,11,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ec060b]"
                >
                  {slide.ctaText}
                  <ArrowRight size={18} weight="bold" />
                </Link>

                {slide.secondaryCtaHref && slide.secondaryCtaText && (
                  <Link
                    href={slide.secondaryCtaHref}
                    target={slide.secondaryCtaHref.startsWith('http') ? '_blank' : undefined}
                    rel={slide.secondaryCtaHref.startsWith('http') ? 'noreferrer' : undefined}
                    className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-slate-900/70 backdrop-blur px-6 py-3.5 text-sm sm:text-base font-medium text-slate-100 transition-colors duration-200 hover:bg-slate-800 hover:text-white"
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
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-slate-950/70 text-slate-200 backdrop-blur transition-all hover:bg-[#ec060b] hover:text-white hover:border-[#ec060b] hover:scale-105 shadow-lg"
      >
        <CaretLeft size={24} weight="bold" />
      </button>

      <button
        onClick={nextSlide}
        type="button"
        aria-label="Diapositiva siguiente"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-slate-950/70 text-slate-200 backdrop-blur transition-all hover:bg-[#ec060b] hover:text-white hover:border-[#ec060b] hover:scale-105 shadow-lg"
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
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
