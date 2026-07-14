'use client';
import { usePathname } from 'next/navigation';
import { Bell } from '@phosphor-icons/react';
import { useAuth } from '@/lib/hooks/useAuth';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':      'Dashboard',
  '/clients':        'Clientes',
  '/quotes':         'Cotizaciones',
  '/equipment':      'Equipos',
  '/work-orders':    'Órdenes de Trabajo',
  '/email-requests': 'Solicitudes de Correo',
  '/users':          'Gestión de Usuarios',
  '/admin':          'Administración',
  '/admin/logs':     'Logs de Actividad',
};

export default function TopBar() {
  const pathname = usePathname();
  const { user } = useAuth();

  // Buscar el título más específico
  const title =
    Object.entries(PAGE_TITLES)
      .filter(([key]) => pathname.startsWith(key))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] || 'Labtronix';

  return (
    <header className="topbar no-print">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 3,
          height: 20,
          background: 'var(--color-brand)',
          borderRadius: 'var(--radius-full)',
        }} />
        <h1 className="topbar__title">{title}</h1>
      </div>

      <div className="topbar__actions">
        <button
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-muted)',
            transition: 'all var(--transition)',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
          }}
        >
          <Bell size={18} />
        </button>

        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 12px',
            background: 'var(--color-surface-2)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
          }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'var(--color-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'white',
            }}>
              {user.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
            </div>
            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user.name.split(' ')[0]}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-brand-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {user.role}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
