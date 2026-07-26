'use client';

import { motion } from 'framer-motion';
import { CurrencyDollar, Files, TrendUp } from '@phosphor-icons/react';

interface KPIs {
  totalQuotes: number;
  approvedQuotes: number;
  conversionRate: number;
  totalRevenue: number;
  wipValue?: number;
}

export function KPICards({ data }: { data: KPIs | null }) {
  if (!data) return <div className="animate-pulse h-32 bg-gray-200 rounded-xl w-full" />;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val);

  return (
    <div className="grid-4" style={{ marginBottom: 32 }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="stat-card" style={{ '--card-accent': '#10b981', '--card-icon-bg': 'rgba(16, 185, 129, 0.12)' } as any}>
          <div className="stat-card__icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
            <CurrencyDollar size={24} weight="duotone" />
          </div>
          <div className="stat-card__body">
            <div className="stat-card__label">Ingresos Totales (Aprobadas)</div>
            <div className="stat-card__value">{formatCurrency(data.totalRevenue)}</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="stat-card" style={{ '--card-accent': '#3b82f6', '--card-icon-bg': 'rgba(59, 130, 246, 0.12)' } as any}>
          <div className="stat-card__icon" style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6' }}>
            <Files size={24} weight="duotone" />
          </div>
          <div className="stat-card__body">
            <div className="stat-card__label">Cotizaciones Totales</div>
            <div className="stat-card__value">{data.totalQuotes}</div>
            <div className="stat-card__sub" style={{ color: '#3b82f6' }}>{data.approvedQuotes} aprobadas</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="stat-card" style={{ '--card-accent': '#8b5cf6', '--card-icon-bg': 'rgba(139, 92, 246, 0.12)' } as any}>
          <div className="stat-card__icon" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
            <TrendUp size={24} weight="duotone" />
          </div>
          <div className="stat-card__body">
            <div className="stat-card__label">Tasa de Conversión</div>
            <div className="stat-card__value">{data.conversionRate}%</div>
          </div>
        </div>
      </motion.div>

      {data.wipValue !== undefined && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="stat-card" style={{ '--card-accent': '#f59e0b', '--card-icon-bg': 'rgba(245, 158, 11, 0.12)' } as any}>
            <div className="stat-card__icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
              <CurrencyDollar size={24} weight="duotone" />
            </div>
            <div className="stat-card__body">
              <div className="stat-card__label">Dinero Atrapado (WIP)</div>
              <div className="stat-card__value">{formatCurrency(data.wipValue)}</div>
              <div className="stat-card__sub" style={{ color: '#f59e0b' }}>En Órdenes Activas</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
