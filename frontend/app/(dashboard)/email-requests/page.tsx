'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, EnvelopeOpen, Check, Trash, Eye } from '@phosphor-icons/react';
import { emailRequestsApi } from '@/lib/api';
import { formatDateTime, getEmailStatusBadge } from '@/lib/utils/formatters';
import type { EmailRequest } from '@/lib/types';

const EMAIL_STATUS_LABELS: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  PROCESADO: 'Procesado',
  DESCARTADO: 'Descartado',
};

export default function EmailRequestsPage() {
  const [requests, setRequests] = useState<EmailRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rawContent, setRawContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState<EmailRequest | null>(null);

  const fetchData = () => {
    emailRequestsApi.getAll()
      .then(setRequests)
      .catch(() => toast.error('Error al cargar solicitudes'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    if (!rawContent.trim()) { toast.error('El contenido es requerido'); return; }
    setSubmitting(true);
    try {
      await emailRequestsApi.create(rawContent);
      toast.success('Solicitud capturada y analizada');
      setRawContent('');
      setShowForm(false);
      fetchData();
    } catch { toast.error('Error al procesar'); }
    finally { setSubmitting(false); }
  };

  const handleProcess = async (id: string) => {
    try {
      await emailRequestsApi.process(id);
      toast.success('Solicitud marcada como procesada');
      fetchData();
    } catch { toast.error('Error'); }
  };

  const handleDiscard = async (id: string) => {
    try {
      await emailRequestsApi.discard(id);
      toast.success('Solicitud descartada');
      fetchData();
    } catch { toast.error('Error'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Solicitudes por Correo</h1>
          <p className="page-header__subtitle">Capture y analice el contenido de correos recibidos de clientes</p>
        </div>
        <button className="btn btn--primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} weight="bold" /> Capturar Correo
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginBottom: 24 }}
          >
            <div className="card" style={{ borderColor: 'var(--color-brand)' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>
                Pegar contenido del correo
              </h2>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Contenido del correo recibido</label>
                <textarea
                  className="form-input"
                  rows={8}
                  placeholder="Pega aquí el texto completo del correo recibido del cliente. El sistema extraerá automáticamente: emails, teléfonos, NIT, equipos mencionados..."
                  value={rawContent}
                  onChange={(e) => setRawContent(e.target.value)}
                  style={{ resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn--secondary" onClick={() => setShowForm(false)}>Cancelar</button>
                <button className="btn btn--primary" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <EnvelopeOpen size={18} />}
                  {submitting ? 'Analizando...' : 'Capturar y Analizar'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner spinner--lg" /></div>
      ) : requests.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <EnvelopeOpen size={48} weight="thin" className="empty-state__icon" />
            <p className="empty-state__title">Sin solicitudes capturadas</p>
            <p className="empty-state__sub">Captura el contenido de correos de clientes para analizarlos</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 24 }}>
          {/* Lista */}
          <div style={{ flex: 1 }}>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Estado</th>
                    <th>Extracción</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {requests.map((req, i) => (
                      <motion.tr key={req.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                        <td><span className={`badge ${getEmailStatusBadge(req.status)}`}>{EMAIL_STATUS_LABELS[req.status]}</span></td>
                        <td>
                          {req.extractedData && (
                            <div style={{ fontSize: '0.78rem' }}>
                              {req.extractedData.emails?.length > 0 && <div>📧 {req.extractedData.emails.join(', ')}</div>}
                              {req.extractedData.phones?.length > 0 && <div>📞 {req.extractedData.phones.join(', ')}</div>}
                              {req.extractedData.equipments?.length > 0 && <div style={{ color: 'var(--color-brand-light)' }}>🔧 {req.extractedData.equipments.join(', ')}</div>}
                            </div>
                          )}
                        </td>
                        <td style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{formatDateTime(req.createdAt)}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="btn btn--ghost btn--sm" onClick={() => setSelected(req)} title="Ver contenido"><Eye size={14} /></button>
                            {req.status === 'PENDIENTE' && (
                              <>
                                <button className="btn btn--secondary btn--sm" onClick={() => handleProcess(req.id)} title="Procesar"><Check size={14} /></button>
                                <button className="btn btn--danger btn--sm" onClick={() => handleDiscard(req.id)} title="Descartar"><Trash size={14} /></button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>

          {/* Panel detalle */}
          {selected && (
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              className="card"
              style={{ width: 380, flexShrink: 0 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontWeight: 700 }}>Contenido del correo</h3>
                <button className="btn btn--ghost btn--sm" onClick={() => setSelected(null)}>✕</button>
              </div>
              <pre style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontFamily: 'var(--font-mono)',
                background: 'var(--color-surface-2)',
                padding: 12,
                borderRadius: 'var(--radius-md)',
                maxHeight: 400,
                overflowY: 'auto',
              }}>
                {selected.rawContent}
              </pre>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
