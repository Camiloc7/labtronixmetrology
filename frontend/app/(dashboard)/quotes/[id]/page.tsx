'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, FilePdf, DownloadSimple } from '@phosphor-icons/react';
import { quotesApi } from '@/lib/api';
import { formatDate, formatCOP, QUOTE_STATUS_LABELS, getQuoteStatusBadge } from '@/lib/utils/formatters';
import type { Quote } from '@/lib/types';

const STATUS_OPTIONS = ['BORRADOR', 'ENVIADA', 'APROBADA', 'RECHAZADA'] as const;

export default function QuoteDetailPage() {
  const { id } = useParams<{ id: string }>();
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

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner spinner--lg" /></div>;
  if (!quote) return null;

  return (
    <div>
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
            className="btn btn--primary"
          >
            <FilePdf size={18} weight="bold" />
            Descargar PDF
          </a>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900 }}>
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
            {quote.notes && (
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 4 }}>Observaciones</div>
                <div style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{quote.notes}</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Cambiar estado */}
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

        {/* Ítems */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Ítems de Cotización</h2>
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Cantidad</th>
                  <th>Precio Unit.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {quote.items?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCOP(item.unitPrice)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>{formatCOP(item.subtotal)}</td>
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
