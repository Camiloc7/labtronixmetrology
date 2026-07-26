'use client';

import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueData {
  date: string;
  revenue: number;
  quotesCount: number;
}

interface RevenueChartProps {
  data: RevenueData[];
  period: string;
  setPeriod: (val: 'day' | 'month' | 'quarter' | 'year') => void;
}

export function RevenueChart({ data, period, setPeriod }: RevenueChartProps) {
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
    return `$${val}`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (period === 'year') return d.getFullYear().toString();
    if (period === 'month') return d.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
    return d.toLocaleDateString('es-ES');
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      className="card"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Proyección de Ingresos</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
          className="form-input form-input--sm"
          style={{ width: 'auto', minWidth: '150px' }}
        >
          <option value="day">Por Días</option>
          <option value="month">Por Meses</option>
          <option value="quarter">Por Trimestres</option>
          <option value="year">Por Años</option>
        </select>
      </div>

      <div style={{ flex: 1, minHeight: 300, width: '100%' }}>
        {data.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 0', height: '100%' }}>
            <p>No hay datos para este período.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="date" tickFormatter={formatDate} stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis tickFormatter={formatCurrency} stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                formatter={(value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value)}
                labelFormatter={formatDate}
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', boxShadow: 'var(--shadow-md)' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
