'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, ClipboardText, Funnel } from '@phosphor-icons/react';
import { workOrdersApi } from '@/lib/api';
import { formatDate, OT_STATUS_LABELS, getOtStatusBadge } from '@/lib/utils/formatters';
import type { WorkOrder, WorkOrderStatus } from '@/lib/types';

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'RECIBIDO', label: 'Recibido' },
  { value: 'EN_PROCESO', label: 'En Proceso' },
  { value: 'CALIBRADO', label: 'Calibrado' },
  { value: 'LISTO_ENVIO', label: 'Listo Envío' },
  { value: 'DESPACHADO', label: 'Despachado' },
];

export default function WorkOrdersPage() {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    workOrdersApi.getAll(statusFilter || undefined)
      .then(setOrders)
      .catch(() => toast.error('Error al cargar órdenes'))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Órdenes de Trabajo</h1>
          <p className="page-header__subtitle">Seguimiento y gestión de calibraciones</p>
        </div>
        <Link href="/work-orders/new" className="btn btn--primary">
          <Plus size={18} weight="bold" /> Nueva OT
        </Link>
      </div>

      {/* Filtros de estado */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <Funnel size={16} color="var(--color-text-muted)" />
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`btn btn--sm ${statusFilter === opt.value ? 'btn--primary' : 'btn--secondary'}`}
            onClick={() => setStatusFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner spinner--lg" /></div>
      ) : orders.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <ClipboardText size={48} weight="thin" className="empty-state__icon" />
            <p className="empty-state__title">No hay órdenes de trabajo</p>
            <p className="empty-state__sub">{statusFilter ? `No hay OTs con estado "${OT_STATUS_LABELS[statusFilter]}"` : 'Crea la primera orden de trabajo'}</p>
            <Link href="/work-orders/new" className="btn btn--primary" style={{ marginTop: 12 }}>
              <Plus size={16} weight="bold" /> Nueva OT
            </Link>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>OT</th>
                <th>Cliente</th>
                <th>Equipo</th>
                <th>Código</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Creada</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {orders.map((ot, i) => (
                  <motion.tr key={ot.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--color-brand-light)', fontWeight: 700 }}>
                        {ot.otNumber}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{ot.client?.companyName}</td>
                    <td style={{ fontSize: '0.8rem' }}>
                      <div>{ot.equipment?.brand} {ot.equipment?.model}</div>
                      {ot.equipment?.serialNumber && <div style={{ color: 'var(--color-text-muted)' }}>SN: {ot.equipment.serialNumber}</div>}
                    </td>
                    <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{ot.equipment?.internalCode}</span></td>
                    <td><span className={`badge ${ot.serviceType === 'PROPIO' ? 'badge--blue' : 'badge--purple'}`}>{ot.serviceType}</span></td>
                    <td><span className={`badge ${getOtStatusBadge(ot.status)}`}>{OT_STATUS_LABELS[ot.status]}</span></td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{formatDate(ot.createdAt)}</td>
                    <td>
                      <Link href={`/work-orders/${ot.id}`} className="btn btn--ghost btn--sm">Ver</Link>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
