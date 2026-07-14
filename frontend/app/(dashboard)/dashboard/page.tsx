'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ClipboardText, Buildings, Wrench, FileText,
  ArrowRight, CheckCircle, Clock, Truck, Hourglass,
} from '@phosphor-icons/react';
import { workOrdersApi, clientsApi, equipmentApi, quotesApi } from '@/lib/api';
import { formatDateTime, OT_STATUS_LABELS, formatCOP } from '@/lib/utils/formatters';
import type { WorkOrder, Client, Equipment, Quote, OtStats } from '@/lib/types';
import { useAuth } from '@/lib/hooks/useAuth';

const STATUS_COLORS: Record<string, string> = {
  RECIBIDO:    '#3b82f6',
  EN_PROCESO:  '#f59e0b',
  CALIBRADO:   '#8b5cf6',
  LISTO_ENVIO: '#22c55e',
  DESPACHADO:  '#6b7280',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  RECIBIDO:    <Clock size={16} />,
  EN_PROCESO:  <Hourglass size={16} />,
  CALIBRADO:   <CheckCircle size={16} />,
  LISTO_ENVIO: <CheckCircle size={16} />,
  DESPACHADO:  <Truck size={16} />,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<OtStats | null>(null);
  const [recentOTs, setRecentOTs] = useState<WorkOrder[]>([]);
  const [clientCount, setClientCount] = useState(0);
  const [equipmentCount, setEquipmentCount] = useState(0);
  const [quoteCount, setQuoteCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [otStats, ots, clients, equips, quotes] = await Promise.all([
          workOrdersApi.getStats(),
          workOrdersApi.getAll(),
          clientsApi.getAll(),
          equipmentApi.getAll(),
          quotesApi.getAll(),
        ]);
        setStats(otStats);
        setRecentOTs(ots.slice(0, 5));
        setClientCount(clients.length);
        setEquipmentCount(equips.length);
        setQuoteCount(quotes.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const kpiCards = [
    {
      label: 'Clientes Activos',
      value: clientCount,
      icon: <Buildings size={24} weight="duotone" />,
      href: '/clients',
      accent: '#3b82f6',
      iconBg: 'rgba(59,130,246,0.12)',
    },
    {
      label: 'Equipos Recibidos',
      value: equipmentCount,
      icon: <Wrench size={24} weight="duotone" />,
      href: '/equipment',
      accent: '#8b5cf6',
      iconBg: 'rgba(139,92,246,0.12)',
    },
    {
      label: 'Órdenes de Trabajo',
      value: stats?.total || 0,
      icon: <ClipboardText size={24} weight="duotone" />,
      href: '/work-orders',
      accent: '#ec060b',
      iconBg: 'rgba(236,6,11,0.12)',
    },
    {
      label: 'Cotizaciones',
      value: quoteCount,
      icon: <FileText size={24} weight="duotone" />,
      href: '/quotes',
      accent: '#22c55e',
      iconBg: 'rgba(34,197,94,0.12)',
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <div className="spinner spinner--lg" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-header__title">
            Bienvenido, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="page-header__subtitle">
            Aquí está el resumen del sistema · {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {kpiCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
          >
            <Link href={card.href} style={{ display: 'block' }}>
              <div
                className="stat-card"
                style={{ '--card-accent': card.accent, '--card-icon-bg': card.iconBg } as any}
              >
                <div className="stat-card__icon" style={{ background: card.iconBg, color: card.accent }}>
                  {card.icon}
                </div>
                <div className="stat-card__body">
                  <div className="stat-card__label">{card.label}</div>
                  <div className="stat-card__value">{card.value}</div>
                  <div className="stat-card__sub" style={{ color: card.accent, display: 'flex', alignItems: 'center', gap: 4 }}>
                    Ver todos <ArrowRight size={12} />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid-2">
        {/* OT por Estado */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="card"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Estado de Órdenes de Trabajo</h2>
            <Link href="/work-orders" className="btn btn--ghost btn--sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>

          {stats?.byStatus.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.byStatus.map((s) => {
                const pct = Math.round((parseInt(s.count) / (stats.total || 1)) * 100);
                return (
                  <div key={s.status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem' }}>
                        <span style={{ color: STATUS_COLORS[s.status] }}>{STATUS_ICONS[s.status]}</span>
                        <span>{OT_STATUS_LABELS[s.status] || s.status}</span>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {s.count} ({pct}%)
                      </span>
                    </div>
                    <div style={{ height: 6, background: 'var(--color-surface-2)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                        style={{
                          height: '100%',
                          background: STATUS_COLORS[s.status],
                          borderRadius: 'var(--radius-full)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <p>No hay órdenes de trabajo aún</p>
            </div>
          )}
        </motion.div>

        {/* OTs recientes */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="card"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Órdenes Recientes</h2>
            <Link href="/work-orders" className="btn btn--ghost btn--sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              Ver todas <ArrowRight size={14} />
            </Link>
          </div>

          {recentOTs.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentOTs.map((ot, i) => (
                <motion.div
                  key={ot.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.05 }}
                >
                  <Link
                    href={`/work-orders/${ot.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-surface-2)',
                      transition: 'all var(--transition)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
                        {ot.otNumber}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                        {ot.client?.companyName}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span
                        className={`badge`}
                        style={{
                          background: `${STATUS_COLORS[ot.status]}20`,
                          color: STATUS_COLORS[ot.status],
                          fontSize: '0.65rem',
                        }}
                      >
                        {OT_STATUS_LABELS[ot.status]}
                      </span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)', marginTop: 4 }}>
                        {formatDateTime(ot.createdAt)}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '32px 0' }}>
              <p>Sin órdenes recientes</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
