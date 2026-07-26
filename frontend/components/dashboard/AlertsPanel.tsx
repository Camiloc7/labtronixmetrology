'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { WarningCircle, ArrowRight } from '@phosphor-icons/react';

interface Alert {
  id: string;
  quoteNumber: string;
  clientName: string;
  totalValue: number;
  validUntil: string;
  status: string;
}

export function AlertsPanel({ alerts }: { alerts: Alert[] }) {
  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val);

  const getDaysLeft = (dateStr: string) => {
    const valid = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const diff = valid - now;
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <WarningCircle size={24} color="var(--color-warning)" weight="duotone" />
          <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Cotizaciones por Vencer</h2>
        </div>
        <Link href="/quotes" className="btn btn--ghost btn--sm" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          Ver todas <ArrowRight size={14} />
        </Link>
      </div>

      {alerts.length === 0 ? (
        <div className="empty-state" style={{ padding: '32px 0', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>No hay cotizaciones próximas a vencer.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, overflowY: 'auto', paddingRight: 4 }}>
          {alerts.map((alert, i) => {
            const daysLeft = getDaysLeft(alert.validUntil);
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link
                  href={`/quotes/${alert.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--color-surface-2)',
                    transition: 'all var(--transition)',
                    borderLeft: daysLeft <= 2 ? '4px solid var(--color-error)' : '4px solid var(--color-warning)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      {alert.clientName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
                      {alert.quoteNumber} · {formatCurrency(alert.totalValue)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: daysLeft <= 2 ? 'var(--color-error)' : 'var(--color-warning)',
                        background: daysLeft <= 2 ? 'rgba(236, 6, 11, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '12px',
                      }}
                    >
                      {daysLeft < 0 ? 'Vencida' : daysLeft === 0 ? 'Vence hoy' : `En ${daysLeft} días`}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
