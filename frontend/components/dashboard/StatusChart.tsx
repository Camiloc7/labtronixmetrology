'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StatusData {
  status: string;
  count: number;
}

const COLORS: Record<string, string> = {
  'BORRADOR': '#9ca3af',
  'ENVIADA': '#3b82f6',
  'APROBADA': '#10b981',
  'RECHAZADA': '#ef4444',
};

export function StatusChart({ data }: { data: StatusData[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="card"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Estado de Cotizaciones</h2>
      </div>

      <div style={{ flex: 1, minHeight: 300, width: '100%' }}>
        {data.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 0', height: '100%' }}>
            <p>No hay cotizaciones.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={5}
                dataKey="count"
                nameKey="status"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.status] || 'var(--color-border-light)'} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', boxShadow: 'var(--shadow-md)' }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
