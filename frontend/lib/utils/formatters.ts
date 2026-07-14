/**
 * Formatea un número como moneda colombiana
 */
export function formatCOP(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Formatea una fecha ISO a formato legible en español
 */
export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...opts,
  });
}

/**
 * Formatea fecha y hora
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Tiempo relativo (hace X tiempo)
 */
export function timeAgo(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora mismo';
  if (diffMins < 60) return `Hace ${diffMins}m`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays < 7) return `Hace ${diffDays}d`;
  return formatDate(d);
}

/**
 * Iniciales del nombre para avatar
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

/**
 * Mapa de labels de estado OT
 */
export const OT_STATUS_LABELS: Record<string, string> = {
  RECIBIDO: 'Recibido',
  EN_PROCESO: 'En Proceso',
  CALIBRADO: 'Calibrado',
  LISTO_ENVIO: 'Listo para Envío',
  DESPACHADO: 'Despachado',
};

export const QUOTE_STATUS_LABELS: Record<string, string> = {
  BORRADOR: 'Borrador',
  ENVIADA: 'Enviada',
  APROBADA: 'Aprobada',
  RECHAZADA: 'Rechazada',
};

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrador',
  COMERCIAL: 'Comercial',
  TECNICO: 'Técnico',
};

/**
 * Badge variant por estado OT
 */
export function getOtStatusBadge(status: string): string {
  const map: Record<string, string> = {
    RECIBIDO: 'badge--blue',
    EN_PROCESO: 'badge--yellow',
    CALIBRADO: 'badge--purple',
    LISTO_ENVIO: 'badge--green',
    DESPACHADO: 'badge--gray',
  };
  return map[status] || 'badge--gray';
}

export function getQuoteStatusBadge(status: string): string {
  const map: Record<string, string> = {
    BORRADOR: 'badge--gray',
    ENVIADA: 'badge--blue',
    APROBADA: 'badge--green',
    RECHAZADA: 'badge--red',
  };
  return map[status] || 'badge--gray';
}

export function getEmailStatusBadge(status: string): string {
  const map: Record<string, string> = {
    PENDIENTE: 'badge--yellow',
    PROCESADO: 'badge--green',
    DESCARTADO: 'badge--gray',
  };
  return map[status] || 'badge--gray';
}
