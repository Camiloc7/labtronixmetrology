'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, Printer, ArrowsClockwise } from '@phosphor-icons/react';
import { workOrdersApi } from '@/lib/api';
import { formatDate, formatDateTime, OT_STATUS_LABELS, getOtStatusBadge } from '@/lib/utils/formatters';
import type { WorkOrder, StatusHistory, WorkOrderStatus } from '@/lib/types';

const STATUS_FLOW: WorkOrderStatus[] = ['RECIBIDO', 'EN_PROCESO', 'CALIBRADO', 'LISTO_ENVIO', 'DESPACHADO'];

export default function WorkOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ot, setOt] = useState<WorkOrder | null>(null);
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [changingStatus, setChangingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<WorkOrderStatus | ''>('');
  const [statusNote, setStatusNote] = useState('');
  const [stickerData, setStickerData] = useState<any>(null);
  const [showSticker, setShowSticker] = useState(false);

  const fetchData = async () => {
    try {
      const [otData, histData] = await Promise.all([
        workOrdersApi.getOne(id),
        workOrdersApi.getHistory(id),
      ]);
      setOt(otData);
      setHistory(histData);
    } catch { toast.error('OT no encontrada'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleChangeStatus = async () => {
    if (!newStatus) { toast.error('Selecciona un estado'); return; }
    setChangingStatus(true);
    try {
      await workOrdersApi.changeStatus(id, { status: newStatus, notes: statusNote });
      toast.success(`Estado cambiado a "${OT_STATUS_LABELS[newStatus]}"`);
      setNewStatus('');
      setStatusNote('');
      fetchData();
    } catch { toast.error('Error al cambiar estado'); }
    finally { setChangingStatus(false); }
  };

  const handlePrintSticker = async () => {
    try {
      const data = await workOrdersApi.getStickerData(id);
      setStickerData(data);
      setShowSticker(true);
      setTimeout(() => window.print(), 300);
    } catch { toast.error('Error al obtener datos del sticker'); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner spinner--lg" /></div>;
  if (!ot) return null;

  const currentStatusIdx = STATUS_FLOW.indexOf(ot.status);

  return (
    <div>
      {/* Sticker para impresión */}
      {showSticker && stickerData && (
        <div className="sticker-print">
          <h2>LABTRONIX METROLOGÍA</h2>
          <p><strong>OT:</strong> {stickerData.otNumber}</p>
          <p><strong>Código:</strong> {stickerData.internalCode}</p>
          <p><strong>Cliente:</strong> {stickerData.client}</p>
          <p><strong>Equipo:</strong> {stickerData.brand} {stickerData.model}</p>
          <p><strong>Ingreso:</strong> {stickerData.receivedAt ? formatDate(stickerData.receivedAt) : '—'}</p>
          <p><strong>Estado:</strong> {OT_STATUS_LABELS[stickerData.status]}</p>
          <p><strong>Servicio:</strong> {stickerData.serviceType}</p>
        </div>
      )}

      <div className="page-header no-print">
        <div>
          <Link href="/work-orders" className="btn btn--ghost btn--sm" style={{ marginBottom: 12, display: 'inline-flex' }}>
            <ArrowLeft size={16} /> Volver a OTs
          </Link>
          <h1 className="page-header__title" style={{ fontFamily: 'var(--font-mono)' }}>{ot.otNumber}</h1>
          <p className="page-header__subtitle">{ot.client?.companyName} · {formatDate(ot.createdAt)}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn--secondary" onClick={handlePrintSticker}>
            <Printer size={18} /> Imprimir Sticker
          </button>
          <span className={`badge ${getOtStatusBadge(ot.status)}`} style={{ fontSize: '0.85rem', padding: '8px 16px' }}>
            {OT_STATUS_LABELS[ot.status]}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900 }} className="no-print">
        {/* Progress stepper */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card">
          <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 20 }}>
            Progreso del Servicio
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 4 }}>
            {STATUS_FLOW.map((status, idx) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 100 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: idx < currentStatusIdx ? 'var(--color-success)' : idx === currentStatusIdx ? 'var(--color-brand)' : 'var(--color-surface-2)',
                    border: `2px solid ${idx < currentStatusIdx ? 'var(--color-success)' : idx === currentStatusIdx ? 'var(--color-brand)' : 'var(--color-border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: idx <= currentStatusIdx ? 'white' : 'var(--color-text-subtle)',
                    boxShadow: idx === currentStatusIdx ? '0 0 12px var(--color-brand-glow)' : 'none',
                    transition: 'all 0.3s',
                  }}>
                    {idx + 1}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: idx === currentStatusIdx ? 'var(--color-brand-light)' : 'var(--color-text-muted)', fontWeight: idx === currentStatusIdx ? 700 : 400, textAlign: 'center' }}>
                    {OT_STATUS_LABELS[status]}
                  </span>
                </div>
                {idx < STATUS_FLOW.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: 2,
                    background: idx < currentStatusIdx ? 'var(--color-success)' : 'var(--color-border)',
                    transition: 'background 0.3s',
                    minWidth: 32,
                  }} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card">
          <div className="grid-2">
            {[
              { label: 'Cliente', value: ot.client?.companyName },
              { label: 'Código Equipo', value: ot.equipment?.internalCode, mono: true },
              { label: 'Equipo', value: `${ot.equipment?.brand || ''} ${ot.equipment?.model || ''}`.trim() || '—' },
              { label: 'N° Serie', value: ot.equipment?.serialNumber || '—', mono: true },
              { label: 'Tipo Servicio', value: ot.serviceType },
              { label: 'Asignado a', value: ot.assignedTo?.name || 'Sin asignar' },
              { label: 'Creada', value: formatDateTime(ot.createdAt) },
              { label: 'Actualizada', value: formatDateTime(ot.updatedAt) },
            ].map((row) => (
              <div key={row.label}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 4 }}>
                  {row.label}
                </div>
                <div style={{ fontFamily: (row as any).mono ? 'var(--font-mono)' : undefined, fontSize: '0.875rem' }}>
                  {row.value}
                </div>
              </div>
            ))}
            {ot.technicalNotes && (
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 4 }}>
                  Notas Técnicas
                </div>
                <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.875rem' }}>{ot.technicalNotes}</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Cambiar estado */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Cambiar Estado</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Nuevo estado</label>
                <select className="form-input" value={newStatus} onChange={(e) => setNewStatus(e.target.value as WorkOrderStatus)}>
                  <option value="">Seleccionar...</option>
                  {STATUS_FLOW.filter((s) => s !== ot.status).map((s) => (
                    <option key={s} value={s}>{OT_STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Nota (opcional)</label>
                <input type="text" className="form-input" placeholder="Observación del cambio..." value={statusNote} onChange={(e) => setStatusNote(e.target.value)} />
              </div>
            </div>
            <div>
              <button className="btn btn--primary" onClick={handleChangeStatus} disabled={!newStatus || changingStatus}>
                {changingStatus ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <ArrowsClockwise size={16} weight="bold" />}
                Confirmar Cambio
              </button>
            </div>
          </div>
        </motion.div>

        {/* Historial */}
        {history.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card">
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Historial de Estados</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.map((h) => (
                <div key={h.id} style={{
                  display: 'flex',
                  gap: 16,
                  padding: '10px 14px',
                  background: 'var(--color-surface-2)',
                  borderRadius: 'var(--radius-md)',
                  alignItems: 'center',
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-brand)', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                      {h.previousStatus ? `${OT_STATUS_LABELS[h.previousStatus] || h.previousStatus} → ` : ''}{OT_STATUS_LABELS[h.newStatus] || h.newStatus}
                    </div>
                    {h.notes && <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{h.notes}</div>}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', textAlign: 'right' }}>
                    <div>{h.changedBy?.name}</div>
                    <div>{formatDateTime(h.changedAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
