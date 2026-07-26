'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ArrowLeft, Printer, ArrowsClockwise, CaretDown, CaretUp, FilePdf, FileXls } from '@phosphor-icons/react';
import { workOrdersApi } from '@/lib/api';
import type { WorkOrder, StatusHistory, WorkOrderStatus, WorkOrderItem } from '@/lib/types';

const STATUS_FLOW: WorkOrderStatus[] = ['RECIBIDO', 'EN_PROCESO', 'CALIBRADO', 'LISTO_ENVIO', 'DESPACHADO'];
const OT_STATUS_LABELS: Record<WorkOrderStatus, string> = {
  RECIBIDO: 'Recibido',
  EN_PROCESO: 'En Proceso',
  CALIBRADO: 'Calibrado',
  LISTO_ENVIO: 'Listo p/ Envío',
  DESPACHADO: 'Despachado',
};

const getOtStatusBadge = (status: WorkOrderStatus) => {
  switch (status) {
    case 'RECIBIDO': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
    case 'EN_PROCESO': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'CALIBRADO': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    case 'LISTO_ENVIO': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
    case 'DESPACHADO': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    default: return 'bg-slate-100 text-slate-800';
  }
};

function WorkOrderItemCard({ item, fetchOt }: { item: WorkOrderItem, fetchOt: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [history, setHistory] = useState<StatusHistory[]>([]);
  const [changingStatus, setChangingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<WorkOrderStatus | ''>('');
  const [statusNote, setStatusNote] = useState('');
  const [stickerData, setStickerData] = useState<any>(null);

  const fetchHistory = async () => {
    try {
      const data = await workOrdersApi.getItemHistory(item.id);
      setHistory(data);
    } catch {
      toast.error('No se pudo cargar el historial del ítem');
    }
  };

  useEffect(() => {
    if (expanded) {
      fetchHistory();
    }
  }, [expanded]);

  const handleChangeStatus = async () => {
    if (!newStatus) return;
    setChangingStatus(true);
    try {
      await workOrdersApi.changeItemStatus(item.id, { status: newStatus, notes: statusNote });
      toast.success(`Estado cambiado a "${OT_STATUS_LABELS[newStatus]}"`);
      setNewStatus('');
      setStatusNote('');
      fetchOt();
      fetchHistory();
    } catch {
      toast.error('Error al cambiar estado');
    } finally {
      setChangingStatus(false);
    }
  };

  const handlePrintSticker = async () => {
    try {
      const data = await workOrdersApi.getItemStickerData(item.id);
      setStickerData(data);
      setTimeout(() => window.print(), 300);
    } catch {
      toast.error('Error al obtener datos del sticker');
    }
  };

  const currentStatusIdx = STATUS_FLOW.indexOf(item.status);

  return (
    <div className="card mb-4 overflow-hidden border border-slate-200 dark:border-slate-800">
      {/* Imprimible temporal para el sticker */}
      {stickerData && (
        <div className="hidden print:block fixed inset-0 bg-white z-50 p-8 text-black">
          <h2 className="text-xl font-bold mb-4">LABTRONIX METROLOGÍA</h2>
          <p><strong>OT:</strong> {stickerData.otNumber}</p>
          <p><strong>Código:</strong> {stickerData.internalCode}</p>
          <p><strong>Cliente:</strong> {stickerData.client}</p>
          <p><strong>Equipo:</strong> {stickerData.brand} {stickerData.model}</p>
          <p><strong>Ingreso:</strong> {stickerData.receivedAt ? new Date(stickerData.receivedAt).toLocaleDateString() : '—'}</p>
          <p><strong>Estado:</strong> {OT_STATUS_LABELS[stickerData.status as WorkOrderStatus]}</p>
          <p><strong>Servicio:</strong> {stickerData.serviceType}</p>
        </div>
      )}

      <div 
        className="p-4 flex flex-wrap gap-4 items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-[200px]">
          <div className="text-sm font-medium text-slate-800 dark:text-white">
            [{item.equipment?.internalCode}] {item.equipment?.brand} {item.equipment?.model}
          </div>
          <div className="text-xs text-muted mt-1 text-slate-500">
            S/N: {item.equipment?.serialNumber || 'N/A'} • Servicio: {item.serviceType}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getOtStatusBadge(item.status)}`}>
            {OT_STATUS_LABELS[item.status]}
          </span>
          {expanded ? <CaretUp size={20} className="text-slate-400" /> : <CaretDown size={20} className="text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/20">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-semibold text-slate-800 dark:text-white">Detalles del Equipo</h4>
            <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); handlePrintSticker(); }}>
              <Printer size={16} /> Imprimir Sticker
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between overflow-x-auto pb-4 gap-2">
              {STATUS_FLOW.map((status, idx) => (
                <div key={status} className="flex flex-col items-center flex-1 min-w-[100px] relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-colors ${idx <= currentStatusIdx ? 'bg-brand text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                    {idx + 1}
                  </div>
                  <div className={`text-xs mt-2 text-center ${idx <= currentStatusIdx ? 'text-brand font-semibold' : 'text-slate-500'}`}>
                    {OT_STATUS_LABELS[status]}
                  </div>
                  {idx < STATUS_FLOW.length - 1 && (
                    <div className={`absolute top-4 left-1/2 w-full h-[2px] -z-0 ${idx < currentStatusIdx ? 'bg-brand' : 'bg-slate-200 dark:bg-slate-700'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Change Form */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
              <h5 className="font-medium text-sm mb-3">Cambiar Estado</h5>
              <div className="flex flex-col gap-3">
                <select className="form-input text-sm" value={newStatus} onChange={(e) => setNewStatus(e.target.value as WorkOrderStatus)}>
                  <option value="">Seleccionar nuevo estado...</option>
                  {STATUS_FLOW.filter(s => s !== item.status).map(s => (
                    <option key={s} value={s}>{OT_STATUS_LABELS[s]}</option>
                  ))}
                </select>
                <input 
                  type="text" 
                  className="form-input text-sm" 
                  placeholder="Nota u observación (opcional)" 
                  value={statusNote} 
                  onChange={(e) => setStatusNote(e.target.value)} 
                />
                <button 
                  className="btn btn-primary w-full justify-center text-sm py-2" 
                  onClick={handleChangeStatus} 
                  disabled={!newStatus || changingStatus}
                >
                  {changingStatus ? 'Guardando...' : 'Actualizar'}
                </button>
              </div>
            </div>

            {/* History */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-y-auto max-h-[250px]">
              <h5 className="font-medium text-sm mb-3">Historial</h5>
              {history.length === 0 ? (
                <div className="text-sm text-slate-500 text-center py-4">No hay historial aún</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {history.map(h => (
                    <div key={h.id} className="flex gap-3 text-sm">
                      <div className="mt-1 flex-shrink-0 w-2 h-2 rounded-full bg-brand"></div>
                      <div>
                        <div className="font-medium">
                          {h.previousStatus ? `${OT_STATUS_LABELS[h.previousStatus as WorkOrderStatus]} → ` : ''}
                          {OT_STATUS_LABELS[h.newStatus as WorkOrderStatus]}
                        </div>
                        {h.notes && <div className="text-slate-500 italic mt-0.5">{h.notes}</div>}
                        <div className="text-xs text-slate-400 mt-1">
                          {h.changedBy?.name} • {new Date(h.changedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WorkOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [ot, setOt] = useState<WorkOrder | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const data = await workOrdersApi.getOne(id);
      setOt(data);
    } catch {
      toast.error('Orden de trabajo no encontrada');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  if (loading) return <div className="text-center py-12"><div className="spinner w-8 h-8 border-4 mx-auto mb-4"></div><p className="text-muted">Cargando...</p></div>;
  if (!ot) return null;

  return (
    <div className="page-container fade-in">
      <div className="page-header mb-6 no-print">
        <div>
          <Link href="/work-orders" className="text-muted hover:text-brand flex items-center gap-2 mb-2 text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> Volver a OTs
          </Link>
          <h1 className="page-title">Orden de Trabajo: {ot.otNumber}</h1>
          <p className="page-description">{ot.client?.companyName} • {new Date(ot.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => window.open(workOrdersApi.getPdfUrl(id), '_blank')} className="btn btn-secondary">
            <FilePdf size={18} /> Ver PDF
          </button>
          <button onClick={() => window.open(workOrdersApi.getExcelUrl(id), '_blank')} className="btn btn-secondary">
            <FileXls size={18} /> Ver Excel
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print mb-8">
        <div className="card p-5 md:col-span-2">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            Detalles Generales
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-slate-500 mb-1">Cliente</div>
              <div className="font-medium text-sm">{ot.client?.companyName}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Cotización / Oferta</div>
              <div className="font-medium text-sm">
                {ot.quote ? (
                  <Link href={`/quotes/${ot.quoteId}`} className="text-brand hover:underline">{ot.quote.quoteNumber}</Link>
                ) : 'N/A'}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Actividad</div>
              <div className="font-medium text-sm">{ot.activity || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Fecha Solicitud</div>
              <div className="font-medium text-sm">{ot.requestDate ? new Date(ot.requestDate).toLocaleDateString() : '—'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Fecha Servicio</div>
              <div className="font-medium text-sm">{ot.serviceDate ? new Date(ot.serviceDate).toLocaleDateString() : '—'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">N° de Equipos</div>
              <div className="font-medium text-sm">{ot.items?.length || 0}</div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            Observaciones (Certificado)
          </h2>
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-xs text-slate-500 mb-1">A nombre de</div>
              <div className="font-medium text-sm">{ot.certificateToName || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500 mb-1">Contacto / Ciudad</div>
              <div className="font-medium text-sm">{ot.certificateContact || '—'} - {ot.certificateCity || '—'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="no-print">
        <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Equipos en esta OT ({ot.items?.length || 0})</h2>
        {ot.items?.length === 0 ? (
          <div className="text-center py-8 text-muted border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
            No hay equipos registrados en esta orden.
          </div>
        ) : (
          <div className="flex flex-col">
            {ot.items?.map(item => (
              <WorkOrderItemCard key={item.id} item={item} fetchOt={fetchData} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
