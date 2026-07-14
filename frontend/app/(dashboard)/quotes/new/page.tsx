'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Trash, FloppyDisk } from '@phosphor-icons/react';
import { quotesApi, clientsApi } from '@/lib/api';
import { formatCOP } from '@/lib/utils/formatters';
import type { Client, CreateQuoteDto, CreateQuoteItemDto } from '@/lib/types';

const EMPTY_ITEM: CreateQuoteItemDto = { description: '', quantity: 1, unitPrice: 0 };

export default function NewQuotePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState('');
  const [notes, setNotes] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [items, setItems] = useState<CreateQuoteItemDto[]>([{ ...EMPTY_ITEM }]);

  useEffect(() => {
    clientsApi.getAll().then(setClients).catch(() => toast.error('Error al cargar clientes'));
  }, []);

  const updateItem = (index: number, field: keyof CreateQuoteItemDto, value: string | number) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addItem = () => setItems((p) => [...p, { ...EMPTY_ITEM }]);
  const removeItem = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i));

  const total = items.reduce((s, item) => s + item.quantity * item.unitPrice, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) { toast.error('Selecciona un cliente'); return; }
    if (items.some((i) => !i.description.trim())) { toast.error('Completa la descripción de todos los ítems'); return; }
    setLoading(true);
    try {
      await quotesApi.create({ clientId, notes, validUntil: validUntil || undefined, items });
      toast.success('Cotización creada correctamente');
      router.push('/quotes');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Error al crear');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <Link href="/quotes" className="btn btn--ghost btn--sm" style={{ marginBottom: 12, display: 'inline-flex' }}>
            <ArrowLeft size={16} /> Volver a Cotizaciones
          </Link>
          <h1 className="page-header__title">Nueva Cotización</h1>
          <p className="page-header__subtitle">Crear propuesta económica con ítems de servicios</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900 }}>
          {/* Info general */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card">
            <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Información General</h2>
            <div className="grid-2">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Cliente *</label>
                <select className="form-input" value={clientId} onChange={(e) => setClientId(e.target.value)} required>
                  <option value="">Seleccionar cliente...</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.companyName}{c.nit ? ` (${c.nit})` : ''}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Válida hasta</label>
                <input type="date" className="form-input" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Observaciones</label>
                <textarea className="form-input" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} style={{ resize: 'vertical' }} />
              </div>
            </div>
          </motion.div>

          {/* Ítems */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>Ítems de Cotización</h2>
              <button type="button" onClick={addItem} className="btn btn--secondary btn--sm">
                <Plus size={16} weight="bold" /> Agregar ítem
              </button>
            </div>

            {/* Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 80px 140px 120px 40px',
              gap: 12,
              padding: '8px 0',
              borderBottom: '1px solid var(--color-border)',
              marginBottom: 12,
            }}>
              {['Descripción', 'Cant.', 'Precio Unit.', 'Subtotal', ''].map((h) => (
                <div key={h} style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
              ))}
            </div>

            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 80px 140px 120px 40px',
                    gap: 12,
                    marginBottom: 12,
                    alignItems: 'center',
                  }}
                >
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Descripción del servicio"
                    value={item.description}
                    onChange={(e) => updateItem(i, 'description', e.target.value)}
                    required
                  />
                  <input
                    type="number"
                    className="form-input"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(i, 'quantity', parseInt(e.target.value) || 1)}
                  />
                  <input
                    type="number"
                    className="form-input"
                    min={0}
                    step={1000}
                    placeholder="0"
                    value={item.unitPrice || ''}
                    onChange={(e) => updateItem(i, 'unitPrice', parseFloat(e.target.value) || 0)}
                  />
                  <div style={{
                    padding: '10px 14px',
                    background: 'var(--color-surface-2)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--color-success)',
                  }}>
                    {formatCOP(item.quantity * item.unitPrice)}
                  </div>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      className="btn btn--danger btn--sm"
                      style={{ padding: '8px', justifyContent: 'center' }}
                    >
                      <Trash size={15} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Total */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 16,
              paddingTop: 16,
              borderTop: '1px solid var(--color-border)',
              marginTop: 8,
            }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>TOTAL</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-brand)' }}>{formatCOP(total)}</span>
            </div>
          </motion.div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Link href="/quotes" className="btn btn--secondary">Cancelar</Link>
            <button type="submit" className="btn btn--primary btn--lg" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <FloppyDisk size={18} weight="bold" />}
              {loading ? 'Creando...' : 'Crear Cotización'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
