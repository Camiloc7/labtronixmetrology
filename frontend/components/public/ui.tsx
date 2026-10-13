import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

/**
 * Bloques compartidos de las páginas públicas.
 * Centralizan ancho de contenedor, escala tipográfica, ritmo vertical y botones
 * para que todas las páginas mantengan la misma jerarquía visual.
 */

const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10', className)}>{children}</div>;
}

export function Section({
  children,
  id,
  tone = 'white',
  className,
}: {
  children: ReactNode;
  id?: string;
  tone?: 'white' | 'muted' | 'dark';
  className?: string;
}) {
  const tones = {
    white: 'bg-white text-slate-950',
    muted: 'bg-slate-50 text-slate-950',
    dark: 'bg-slate-950 text-white',
  };
  return (
    <section id={id} className={cx('scroll-mt-24 py-20 sm:py-24 lg:py-28', tones[tone], className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      className={cx(
        'flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]',
        dark ? 'text-red-400' : 'text-brand',
      )}
    >
      <span aria-hidden="true" className={cx('h-px w-8', dark ? 'bg-red-400' : 'bg-brand')} />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  dark = false,
  align = 'left',
  aside,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  dark?: boolean;
  align?: 'left' | 'split';
  aside?: ReactNode;
}) {
  const leadClass = cx('text-base leading-7 sm:text-lg sm:leading-8', dark ? 'text-slate-300' : 'text-slate-600');

  if (align === 'split') {
    return (
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-7">
          <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
          <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h2>
        </div>
        <div className="lg:col-span-5">
          {lead && <p className={leadClass}>{lead}</p>}
          {aside}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {lead && <p className={cx('mt-5', leadClass)}>{lead}</p>}
      {aside}
    </div>
  );
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost-dark' | 'link';

const buttonBase =
  'inline-flex min-h-12 items-center justify-center gap-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'rounded-md bg-brand px-6 text-white hover:bg-brand-dark focus-visible:outline-brand',
  secondary:
    'rounded-md border border-slate-300 bg-white px-6 text-slate-900 hover:border-slate-900 focus-visible:outline-slate-900',
  'ghost-dark':
    'rounded-md border border-white/25 px-6 text-white hover:border-white hover:bg-white/5 focus-visible:outline-white',
  link: 'group gap-2 px-0 text-slate-950 underline decoration-brand decoration-2 underline-offset-[6px] hover:text-brand focus-visible:outline-brand',
};

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  arrow = false,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  arrow?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={cx(buttonBase, buttonVariants[variant], className)}>
      {children}
      {arrow && (
        <ArrowRight size={17} weight="bold" className="transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </Link>
  );
}

/** Encabezado estándar de páginas internas: una sola h1 por página. */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  media,
}: {
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  children?: ReactNode;
  media?: ReactNode;
}) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <Container className={cx('py-16 sm:py-20 lg:py-24', media ? 'grid gap-12 lg:grid-cols-12 lg:items-center' : undefined)}>
        <div className={media ? 'lg:col-span-6' : 'max-w-3xl'}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[3.5rem]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{lead}</p>
          {children && <div className="mt-9 flex flex-col gap-3 sm:flex-row">{children}</div>}
        </div>
        {media && <div className="lg:col-span-6">{media}</div>}
      </Container>
    </header>
  );
}

/** Banda de cierre con llamada a la acción. */
export function CtaBand({
  title,
  text,
  href = '/#contacto',
  label,
}: {
  title: string;
  text: string;
  href?: string;
  label: string;
}) {
  return (
    <section className="bg-slate-950 text-white">
      <Container className="py-16 sm:py-20">
        <div className="flex flex-col gap-8 border-l-2 border-brand pl-6 sm:pl-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{title}</h2>
            <p className="mt-3 text-base leading-7 text-slate-300">{text}</p>
          </div>
          <ButtonLink href={href} arrow className="shrink-0">
            {label}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
