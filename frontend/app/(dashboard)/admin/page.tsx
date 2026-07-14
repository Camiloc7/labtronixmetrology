'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Shield, ListBullets, Users, Gear, ArrowRight,
  Database, CheckCircle, ClockClockwise,
} from '@phosphor-icons/react';
import { activityLogsApi, usersApi, workOrdersApi } from '@/lib/api';
import { formatDateTime, timeAgo } from '@/lib/utils/formatters';
import type { ActivityLog, User } from '@/lib/types';

const METHOD_COLORS: Record<string, string> = {
  POST:   'var(--color-success)',
  PATCH:  'var(--color-warning)',
  DELETE: 'var(--color-brand)',
  GET:    'var(--color-info)',
};

export default function AdminPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      activityLogsApi.getAll(20),
      usersApi.getAll(),
      workOrdersApi.getStats(),
    ]).then(([l, u, s]) => {
      setLogs(l);
      setUsers(u);
      setStats(s);
    }).catch(() => toast.error('Error al cargar datos'))
    .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner spinner--lg" /></div>;

  const activeUsers = users.filter((u) => u.isActive).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Panel de Administración</h1>
          <p className="page-header__subtitle">Configuración del sistema, logs de actividad y métricas globales</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {[
          { label: 'Usuarios Activos', value: activeUsers, icon: <Users size={22} weight="duotone" />, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
          { label: 'Total OTs', value: stats?.total || 0, icon: <Database size={22} weight="duotone" />, color: '#ec060b', bg: 'rgba(236,6,11,0.12)' },
          { label: 'Acciones Registradas', value: logs.length, icon: <ListBullets size={22} weight="duotone" />, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
          { label: 'Sistema', value: 'OK', icon: <CheckCircle size={22} weight="duotone" />, color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <div className="stat-card" style={{ '--card-accent': kpi.color, '--card-icon-bg': kpi.bg } as any}>
              <div className="stat-card__icon" style={{ background: kpi.bg, color: kpi.color }}>{kpi.icon}</div>
              <div className="stat-card__body">
                <div className="stat-card__label">{kpi.label}</div>
                <div className="stat-card__value" style={{ fontSize: '1.5rem' }}>{kpi.value}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid-2">
        {/* Acciones rápidas */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Acciones Rápidas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'Gestionar Usuarios', sub: `${activeUsers} usuarios activos`, href: '/users', icon: <Users size={20} weight="duotone" />, color: 'var(--color-info)' },
              { label: 'Ver Logs de Actividad', sub: 'Historial completo del sistema', href: '/admin/logs', icon: <ListBullets size={20} weight="duotone" />, color: 'var(--color-warning)' },
              { label: 'Órdenes de Trabajo', sub: `${stats?.total || 0} OTs en total`, href: '/work-orders', icon: <ClockClockwise size={20} weight="duotone" />, color: 'var(--color-brand)' },
              { label: 'Configuración', sub: 'Variables del sistema', href: '#', icon: <Gear size={20} weight="duotone" />, color: 'var(--color-text-muted)' },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface-2)',
                  transition: 'all var(--transition)',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = action.color;
                  (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-3)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-2)';
                }}
              >
                <div style={{ color: action.color }}>{action.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{action.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{action.sub}</div>
                </div>
                <ArrowRight size={16} color="var(--color-text-subtle)" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Logs recientes */}
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Actividad Reciente</h2>
            <Link href="/admin/logs" className="btn btn--ghost btn--sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              Ver todo <ArrowRight size={14} />
            </Link>
          </div>
          {logs.length === 0 ? (
            <div className="empty-state" style={{ padding: '24px 0' }}>
              <p>Sin actividad registrada</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {logs.slice(0, 10).map((log) => (
                <div key={log.id} style={{
                  display: 'flex',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface-2)',
                  alignItems: 'center',
                }}>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-mono)',
                    color: METHOD_COLORS[log.action] || 'var(--color-text-muted)',
                    background: `${METHOD_COLORS[log.action] || 'gray'}20`,
                    padding: '2px 6px',
                    borderRadius: 4,
                    flexShrink: 0,
                  }}>
                    {log.action}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                      {log.resource}
                    </div>
                    {log.user?.name && <div style={{ fontSize: '0.68rem', color: 'var(--color-text-subtle)' }}>{log.user.name}</div>}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--color-text-subtle)', flexShrink: 0 }}>
                    {timeAgo(log.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
