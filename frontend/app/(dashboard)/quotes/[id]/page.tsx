'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, FilePdf, DownloadSimple, ArrowsMerge } from '@phosphor-icons/react';
import { quotesApi, equipmentApi } from '@/lib/api';
import { formatDate, formatCOP, QUOTE_STATUS_LABELS, getQuoteStatusBadge } from '@/lib/utils/formatters';
import type { Quote } from '@/lib/types';
import QuoteTrackingPanel from '@/components/quotes/QuoteTrackingPanel';
import QuoteReceptionsPanel from '@/components/quotes/QuoteReceptionsPanel';
import { useAuth } from '@/lib/hooks/useAuth';

const STATUS_OPTIONS = ['BORRADOR', 'ENVIADA', 'APROBADA', 'RECHAZADA'] as const;

export default function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const canManageQuotes = user?.role === 'ADMIN' || user?.role === 'COMERCIAL';
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    quotesApi.getOne(id).then(setQuote).catch(() => toast.error('Cotización no encontrada')).finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (status: string) => {
    setUpdatingStatus(true);
    try {
      const updated = await quotesApi.update(id, { status } as any);
      setQuote(updated);
      toast.success(`Estado actualizado a "${QUOTE_STATUS_LABELS[status]}"`);
    } catch { toast.error('Error al actualizar'); }
    finally { setUpdatingStatus(false); }
  };

  const handleSyncEquipments = async () => {
    if (!id) return;
    try {
      await toast.promise(
        equipmentApi.syncFromQuote(id as string),
        {
          loading: 'Sincronizando equipos...',
          success: (res: any) => {
            if (res.created > 0) return `Se registraron ${res.created} nuevos equipos en el inventario.`;
            return 'Todos los equipos ya están en el inventario.';
          },
          error: 'Error al sincronizar equipos',
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSupportUpload = async (file?: File) => {
    if (!file || !id) return;
    try {
      await toast.promise(quotesApi.uploadSupport(id, file), { loading: 'Subiendo soporte...', success: 'Soporte cargado', error: 'Error al subir soporte' });
      setQuote(await quotesApi.getOne(id));
    } catch (e) { console.error(e); }
  };
  const handleCreateRequisition = async () => {
    if (!id) return;
    try {
      const req = await toast.promise(quotesApi.createRequisition(id), { loading: 'Generando requisici?n...', success: 'Requisici?n generada/vinculada', error: 'Error al generar requisici?n' });
      setQuote(await quotesApi.getOne(id));
      if (req?.id) window.open(`/requisitions/${req.id}`, '_blank');
    } catch (e) { console.error(e); }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner spinner--lg" /></div>;
  if (!quote) return null;

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <Link href="/quotes" className="btn btn--ghost btn--sm" style={{ marginBottom: 12, display: 'inline-flex' }}>
            <ArrowLeft size={16} /> Volver a Cotizaciones
          </Link>
          <h1 className="page-header__title" style={{ fontFamily: 'var(--font-mono)' }}>{quote.quoteNumber}</h1>
          <p className="page-header__subtitle">
            {quote.client?.companyName} · Creada el {formatDate(quote.createdAt)}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span className={`badge ${getQuoteStatusBadge(quote.status)}`} style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
            {QUOTE_STATUS_LABELS[quote.status]}
          </span>
          <a
            href={quotesApi.getPdfUrl(id)}
            target="_blank"
            rel="noreferrer"
            className="btn btn--secondary btn--sm"
          >
            <FilePdf size={18} weight="bold" />
            PDF Comercial
          </a>
          <a
            href={quotesApi.getTechnicalPdfUrl(id)}
            target="_blank"
            rel="noreferrer"
            className="btn btn--primary btn--sm"
          >
            <FilePdf size={18} weight="bold" />
            PDF Técnico
          </a>
          <a
            href={quotesApi.getTechnicalExcelUrl(id)}
            target="_blank"
            rel="noreferrer"
            className="btn btn--primary btn--sm"
            style={{ backgroundColor: '#107c41', borderColor: '#107c41' }}
          >
            <DownloadSimple size={18} weight="bold" />
            Excel Técnico
          </a>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card">
          <div className="grid-2">
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 4 }}>Cliente</div>
              <div style={{ fontWeight: 600 }}>{quote.client?.companyName}</div>
              {quote.client?.nit && <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>NIT: {quote.client.nit}</div>}
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 4 }}>Válida hasta</div>
              <div>{quote.validUntil ? formatDate(quote.validUntil) : 'Sin fecha límite'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 4 }}>Canal de solicitud</div>
              <div>{quote.requestChannel || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 4 }}>Requisición a compras</div>
              <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
                <label style={{ display:'flex', gap:8, alignItems:'center', fontSize:14 }}>
                  <input type="checkbox" checked={!!quote.requisitionId} disabled={!canManageQuotes || !!quote.requisitionId} onChange={(e)=>{ if(e.target.checked) handleCreateRequisition(); }} />
                  Generar requisición automática
                </label>
                {quote.requisitionId && <Link href={`/requisitions/${quote.requisitionId}`} className="btn btn--secondary btn--sm">Ver requisición</Link>}
              </div>
            </div>
            <div style={{ gridColumn:'span 2' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 4 }}>Soporte de solicitud</div>
              <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                {quote.supportFileName ? <span style={{ fontSize:13 }}>{quote.supportFileName}</span> : <span style={{ color:'var(--color-text-muted)' }}>Sin soporte cargado</span>}
                {quote.supportFilePublicId && <button className="btn btn--secondary btn--sm" onClick={async ()=>{ try{ const s=await quotesApi.getSupport(id as string); window.open(s.url,'_blank'); }catch{ toast.error('No se pudo abrir el soporte'); } }}>Ver soporte</button>}
                {canManageQuotes && <label className="btn btn--ghost btn--sm" style={{ cursor:'pointer' }}>Cargar soporte<input type="file" hidden onChange={(e)=>handleSupportUpload(e.target.files?.[0])} /></label>}
              </div>
            </div>
            {(quote.contacts?.length || 0) > 0 && (
              <div style={{ gridColumn:'span 2' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 8 }}>Contactos</div>
                <div style={{ display:'grid', gap:8 }}>
                  {quote.contacts!.map((c, i) => (
                    <div key={c.id || i} style={{ border:'1px solid var(--color-border)', borderRadius:8, padding:10, fontSize:13 }}>
                      <strong>{c.name}</strong> <span style={{ color:'var(--color-text-muted)' }}>({c.type}{c.position ? ' · ' + c.position : ''}{c.isPrimary ? ' · Principal' : ''})</span>
                      <div>{(c.phones||[]).filter(Boolean).join(', ')} {(c.emails||[]).filter(Boolean).length ? ' · ' + (c.emails||[]).filter(Boolean).join(', ') : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {(quote.paymentTerms || quote.deliveryTime || quote.deliveryPlace || quote.warranty || quote.offerValidity) && (
              <div style={{ gridColumn:'span 2' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 8 }}>Condiciones comerciales</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:8, fontSize:13 }}>
                  {quote.paymentTerms && <div><strong>Pago:</strong> {quote.paymentTerms}</div>}
                  {quote.deliveryTime && <div><strong>Entrega:</strong> {quote.deliveryTime}</div>}
                  {quote.deliveryPlace && <div><strong>Sitio:</strong> {quote.deliveryPlace}</div>}
                  {quote.warranty && <div><strong>Garantía:</strong> {quote.warranty}</div>}
                  {quote.offerValidity && <div><strong>Vigencia oferta:</strong> {quote.offerValidity}</div>}
                </div>
              </div>
            )}
            {quote.notes && (
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 4 }}>Observaciones</div>
                <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{quote.notes}</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Cambiar estado */}
        {canManageQuotes && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card">
            <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 16 }}>Cambiar Estado</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  className={`btn btn--sm ${s === quote.status ? 'btn--primary' : 'btn--secondary'}`}
                  onClick={() => handleStatusChange(s)}
                  disabled={s === quote.status || updatingStatus}
                >
                  {QUOTE_STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Panel de Trazabilidad */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <QuoteTrackingPanel quoteId={id as string} />
        </motion.div>

        {/* Panel de Recepciones de Equipos */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }}>
          <QuoteReceptionsPanel quoteId={id as string} />
        </motion.div>

        {/* Ítems */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Ítems de Cotización</h2>
            {canManageQuotes && (
              <button type="button" onClick={handleSyncEquipments} className="btn btn--secondary btn--sm">
                <ArrowsMerge size={16} weight="bold" /> Sincronizar al Inventario
              </button>
            )}
          </div>
          <div className="table-wrapper" style={{ border: 'none', overflowX: 'auto' }}>
            <table className="table" style={{ minWidth: 1200 }}>
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Cant.</th>
                  <th>P. Unitario</th>
                  <th>Subtotal</th>
                  <th>Servicio</th>
                  <th>Equipo</th>
                  <th>Rango</th>
                  <th>Div.</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Serie</th>
                  <th>Cód. Interno</th>
                  <th>Ubicación</th>
                  <th>Ptos. Cal.</th>
                </tr>
              </thead>
              <tbody>
                {quote.items?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCOP(item.unitPrice)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>{formatCOP(item.subtotal)}</td>
                    <td>{item.serviceType || '-'}</td>
                    <td>{item.equipmentName || '-'}</td>
                    <td>{item.measuringRange || '-'}</td>
                    <td>{item.scaleDivision || '-'}</td>
                    <td>{item.brand || '-'}</td>
                    <td>{item.model || '-'}</td>
                    <td>{item.serialNumber || '-'}</td>
                    <td>{item.internalCode || '-'}</td>
                    <td>{item.location || '-'}</td>
                    <td>{item.calibrationPoints || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16, marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>TOTAL</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-brand)' }}>{formatCOP(quote.totalValue)}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
