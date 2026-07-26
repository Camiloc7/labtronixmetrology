'use client';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Bell, List, Moon, Sun, WarningCircle, CheckCircle, Info } from '@phosphor-icons/react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useTheme } from '@/components/ThemeProvider';
import { notificationsApi } from '@/lib/api';

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

interface TopBarProps {
  onMenuToggle: () => void;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [alerts, setAlerts] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      notificationsApi.getRecent().then(setAlerts).catch(console.error);
    }
  }, [user]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setAlerts(alerts.map(a => a.id === id ? { ...a, isRead: true } : a));
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Buscar el título más específico
  const title =
    Object.entries(PAGE_TITLES)
      .filter(([key]) => pathname.startsWith(key))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] || 'Labtronix';

  return (
    <header className="topbar no-print">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button className="mobile-only btn btn--ghost" style={{ padding: 4 }} onClick={onMenuToggle}>
          <List size={24} />
        </button>
        <div className="desktop-only" style={{
          width: 3,
          height: 20,
          background: 'var(--color-brand)',
          borderRadius: 'var(--radius-full)',
        }} />
        <h1 className="topbar__title">{title}</h1>
      </div>

      <div className="topbar__actions">
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
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
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
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
              position: 'relative',
            }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -4,
                right: -4,
                background: 'var(--color-error)',
                color: 'white',
                fontSize: '0.6rem',
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '10px',
                lineHeight: 1,
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="card" style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 8,
              width: 320,
              padding: 0,
              zIndex: 50,
              boxShadow: 'var(--shadow-lg)',
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <WarningCircle size={20} color="var(--color-warning)" weight="duotone" />
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>Notificaciones Recientes</h3>
              </div>
              <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                {alerts.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                    No hay notificaciones
                  </div>
                ) : (
                  alerts.map((a, i) => {
                    const icon = a.type === 'QUOTE_APPROVED' 
                      ? <CheckCircle size={18} color="var(--color-success)" weight="fill" />
                      : a.type === 'QUOTE_EXPIRING' 
                        ? <WarningCircle size={18} color="var(--color-warning)" weight="fill" />
                        : <Info size={18} color="var(--color-brand)" weight="fill" />;

                    const link = a.referenceId ? `/quotes/${a.referenceId}` : '#';

                    return (
                      <Link
                        href={link}
                        key={a.id}
                        onClick={() => {
                          setShowDropdown(false);
                          if (!a.isRead) handleMarkAsRead(a.id);
                        }}
                        style={{
                          display: 'flex',
                          gap: 12,
                          padding: '12px 16px',
                          borderBottom: i < alerts.length - 1 ? '1px solid var(--color-border)' : 'none',
                          background: a.isRead ? 'var(--color-surface)' : 'var(--color-surface-2)',
                          textDecoration: 'none',
                          color: 'var(--color-text)',
                          borderLeft: a.isRead ? '3px solid transparent' : '3px solid var(--color-brand)',
                        }}
                      >
                        <div style={{ marginTop: 2 }}>{icon}</div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: a.isRead ? 500 : 700 }}>{a.title}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4, lineHeight: 1.3 }}>
                            {a.message}
                          </div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: 6 }}>
                            {new Date(a.createdAt).toLocaleDateString('es-CO')}
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
              <Link href="/dashboard" onClick={() => setShowDropdown(false)} style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px',
                  background: 'var(--color-surface-2)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--color-brand)',
                  borderTop: '1px solid var(--color-border)',
                }}>
                  Ver Dashboard Completo
                </Link>
            </div>
          )}
        </div>

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
