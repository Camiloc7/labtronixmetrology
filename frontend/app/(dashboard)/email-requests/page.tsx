'use client';

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Buildings, Check, ClockCountdown, EnvelopeOpen, Eye, FunnelSimple, GlobeHemisphereWest, MagnifyingGlass, PaperPlaneTilt, Plus, Trash, UserCircle } from '@phosphor-icons/react';
import toast from 'react-hot-toast';
import { emailRequestsApi, excelApi } from '@/lib/api';
import { ImportExportActions } from '@/components/ImportExportActions';
import { Modal } from '@/components/ui/Modal';
import { formatDateTime, getEmailStatusBadge } from '@/lib/utils/formatters';
import type { EmailRequest, EmailRequestStatus } from '@/lib/types';
import styles from './page.module.css';

const STATUS_LABELS: Record<EmailRequestStatus, string> = { PENDIENTE: 'Pendiente', PROCESADO: 'Procesada', DESCARTADO: 'Descartada' };
const SERVICE_LABELS: Record<string, string> = {
  'calibracion-balanzas': 'Calibración de balanzas y básculas',
  'calibracion-temperatura': 'Calibración de temperatura',
  'calibracion-presion': 'Calibración de presión',
  'calibracion-volumen': 'Calibración de volumen y vidriería',
  'venta-equipos': 'Venta de equipos de laboratorio',
  otro: 'Mantenimiento o asesoría técnica',
};
type StatusFilter = 'TODAS' | EmailRequestStatus;
type SourceFilter = 'TODOS' | 'WEB' | 'CORREO';

function getContact(request: EmailRequest) {
  const contact = request.extractedData?.contact;
  return {
    name: contact?.name || 'Contacto sin identificar',
    company: contact?.company || request.client?.companyName || 'Empresa sin identificar',
    email: contact?.email || request.extractedData?.emails?.[0] || '',
    phone: contact?.phone || request.extractedData?.phones?.[0] || '',
    service: contact?.service ? SERVICE_LABELS[contact.service] || contact.service : 'Solicitud general',
    message: contact?.message || request.rawContent,
  };
}

const isWebRequest = (request: EmailRequest) => request.extractedData?.source === 'website';

export default function EmailRequestsPage() {
  const [requests, setRequests] = useState<EmailRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCapture, setShowCapture] = useState(false);
  const [rawContent, setRawContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState<EmailRequest | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('TODAS');
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('TODOS');

  const fetchData = () => {
    setLoading(true);
    emailRequestsApi.getAll().then(setRequests).catch(() => toast.error('No fue posible cargar las solicitudes')).finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchData, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const summary = useMemo(() => ({
    total: requests.length,
    pending: requests.filter((request) => request.status === 'PENDIENTE').length,
    web: requests.filter(isWebRequest).length,
    processed: requests.filter((request) => request.status === 'PROCESADO').length,
  }), [requests]);

  const filteredRequests = useMemo(() => {
    const query = search.trim().toLowerCase();
    return requests.filter((request) => {
      const contact = getContact(request);
      const matchesStatus = statusFilter === 'TODAS' || request.status === statusFilter;
      const matchesSource = sourceFilter === 'TODOS' || (sourceFilter === 'WEB' ? isWebRequest(request) : !isWebRequest(request));
      const matchesSearch = !query || [contact.name, contact.company, contact.email, contact.phone, contact.service, request.rawContent].join(' ').toLowerCase().includes(query);
      return matchesStatus && matchesSource && matchesSearch;
    });
  }, [requests, search, sourceFilter, statusFilter]);

  const handleCapture = async () => {
    if (!rawContent.trim()) return toast.error('El contenido es requerido');
    setSubmitting(true);
    try {
      await emailRequestsApi.create(rawContent);
      toast.success('Solicitud capturada y analizada');
      setRawContent(''); setShowCapture(false); fetchData();
    } catch { toast.error('No fue posible capturar la solicitud'); }
    finally { setSubmitting(false); }
  };

  const updateStatus = async (request: EmailRequest, action: 'process' | 'discard') => {
    try {
      if (action === 'process') await emailRequestsApi.process(request.id);
      else await emailRequestsApi.discard(request.id);
      toast.success(action === 'process' ? 'Solicitud marcada como procesada' : 'Solicitud descartada');
      setSelected(null); fetchData();
    } catch { toast.error('No fue posible actualizar la solicitud'); }
  };

  const expectedColumns = [
    { name: 'ID', description: 'ID UUID de la solicitud (vacío si es nueva)' },
    { name: 'ContenidoOriginal', description: 'Texto original de la solicitud', required: true },
    { name: 'Estado', description: 'PENDIENTE, PROCESADO o DESCARTADO' },
  ];

  return (
    <div className={styles.page}>
      <div className="page-header">
        <div><div className={styles.eyebrow}>Gestión comercial</div><h1 className="page-header__title">Bandeja de solicitudes</h1><p className="page-header__subtitle">Centraliza formularios web y correos entrantes con trazabilidad de gestión.</p></div>
        <div className={styles.headerActions}>
          <ImportExportActions onExport={() => excelApi.downloadExcel('/email-requests/export', 'solicitudes-comerciales.xlsx')} onImport={(file) => excelApi.uploadExcel('/email-requests/import', file)} onImportSuccess={fetchData} entityName="Solicitudes comerciales" expectedColumns={expectedColumns} />
          <button className="btn btn--primary" onClick={() => setShowCapture((value) => !value)}><Plus size={18} weight="bold" /> Capturar correo</button>
        </div>
      </div>

      <section className={styles.summaryGrid} aria-label="Resumen de solicitudes">
        <SummaryCard label="Solicitudes totales" value={summary.total} icon={<EnvelopeOpen size={24} />} color="#60a5fa" />
        <SummaryCard label="Pendientes por gestionar" value={summary.pending} icon={<ClockCountdown size={24} />} color="#f59e0b" emphasis={summary.pending > 0} />
        <SummaryCard label="Recibidas desde la web" value={summary.web} icon={<GlobeHemisphereWest size={24} />} color="#a78bfa" />
        <SummaryCard label="Procesadas" value={summary.processed} icon={<Check size={24} />} color="#4ade80" />
      </section>

      <AnimatePresence>{showCapture && (
        <motion.section initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className={styles.captureCard}>
          <div className={styles.captureIntro}><div className={styles.captureIcon}><PaperPlaneTilt size={24} weight="duotone" /></div><div><h2>Capturar solicitud recibida por correo</h2><p>Pega el mensaje completo; el sistema identificará correos, teléfonos y equipos.</p></div></div>
          <textarea className="form-input" rows={7} placeholder="Pega aquí el contenido completo del correo del cliente…" value={rawContent} onChange={(event) => setRawContent(event.target.value)} />
          <div className={styles.captureActions}><button className="btn btn--secondary" onClick={() => setShowCapture(false)}>Cancelar</button><button className="btn btn--primary" onClick={handleCapture} disabled={submitting}>{submitting ? <span className="spinner" /> : <PaperPlaneTilt size={18} />}{submitting ? 'Analizando…' : 'Capturar y analizar'}</button></div>
        </motion.section>
      )}</AnimatePresence>

      <section className={styles.inboxCard}>
        <div className={styles.toolbar}>
          <div className={styles.searchBox}><MagnifyingGlass size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar persona, empresa, correo o servicio…" aria-label="Buscar solicitudes" /></div>
          <div className={styles.filters}><FunnelSimple size={18} />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} aria-label="Filtrar por estado"><option value="TODAS">Todos los estados</option><option value="PENDIENTE">Pendientes</option><option value="PROCESADO">Procesadas</option><option value="DESCARTADO">Descartadas</option></select>
            <select value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value as SourceFilter)} aria-label="Filtrar por origen"><option value="TODOS">Todos los orígenes</option><option value="WEB">Formulario web</option><option value="CORREO">Correo capturado</option></select>
          </div>
        </div>

        {loading ? <div className={styles.loading}><div className="spinner spinner--lg" /></div> : filteredRequests.length === 0 ? (
          <div className="empty-state"><EnvelopeOpen size={48} weight="thin" className="empty-state__icon" /><p className="empty-state__title">No hay solicitudes para mostrar</p><p className="empty-state__sub">Prueba cambiando los filtros o captura un correo recibido.</p></div>
        ) : (
          <div className="table-wrapper"><table className="table"><thead><tr><th>Contacto</th><th>Origen</th><th>Servicio</th><th>Estado</th><th>Recibida</th><th aria-label="Acciones" /></tr></thead><tbody>
            {filteredRequests.map((request) => { const contact = getContact(request); return (
              <tr key={request.id}>
                <td><div className={styles.contactCell}><div className={styles.avatar}>{contact.name.slice(0, 1).toUpperCase()}</div><div><strong>{contact.name}</strong><span>{contact.company}</span>{contact.email && <small>{contact.email}</small>}</div></div></td>
                <td><span className={`${styles.sourceBadge} ${isWebRequest(request) ? styles.sourceWeb : styles.sourceEmail}`}>{isWebRequest(request) ? <GlobeHemisphereWest size={14} /> : <EnvelopeOpen size={14} />}{isWebRequest(request) ? 'Web' : 'Correo'}</span></td>
                <td><span className={styles.serviceText}>{contact.service}</span></td>
                <td><span className={`badge ${getEmailStatusBadge(request.status)}`}>{STATUS_LABELS[request.status]}</span></td>
                <td><span className={styles.dateText}>{formatDateTime(request.createdAt)}</span></td>
                <td><div className={styles.rowActions}><button className="btn btn--ghost btn--sm" onClick={() => setSelected(request)} title="Ver detalle" aria-label="Ver detalle"><Eye size={16} /></button>{request.status === 'PENDIENTE' && <><button className="btn btn--secondary btn--sm" onClick={() => updateStatus(request, 'process')} title="Marcar como procesada" aria-label="Marcar como procesada"><Check size={16} /></button><button className="btn btn--danger btn--sm" onClick={() => updateStatus(request, 'discard')} title="Descartar" aria-label="Descartar"><Trash size={16} /></button></>}</div></td>
              </tr>
            ); })}
          </tbody></table></div>
        )}
        {!loading && requests.length > 0 && <div className={styles.resultCount}>{filteredRequests.length} de {requests.length} solicitudes</div>}
      </section>

      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title="Detalle de la solicitud">{selected && <RequestDetail request={selected} onAction={updateStatus} />}</Modal>
    </div>
  );
}

function SummaryCard({ label, value, icon, color, emphasis = false }: { label: string; value: number; icon: React.ReactNode; color: string; emphasis?: boolean }) {
  return <div className={`${styles.summaryCard} ${emphasis ? styles.summaryEmphasis : ''}`} style={{ '--accent': color } as React.CSSProperties}><div className={styles.summaryIcon}>{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div>;
}

function RequestDetail({ request, onAction }: { request: EmailRequest; onAction: (request: EmailRequest, action: 'process' | 'discard') => Promise<void> }) {
  const contact = getContact(request);
  return <div className={styles.detail}>
    <div className={styles.detailHero}><div className={styles.detailAvatar}><UserCircle size={34} weight="duotone" /></div><div><div className={styles.detailBadges}><span className={`badge ${getEmailStatusBadge(request.status)}`}>{STATUS_LABELS[request.status]}</span><span className={`${styles.sourceBadge} ${isWebRequest(request) ? styles.sourceWeb : styles.sourceEmail}`}>{isWebRequest(request) ? 'Formulario web' : 'Correo capturado'}</span></div><h3>{contact.name}</h3><p>{contact.company}</p></div></div>
    <div className={styles.detailGrid}><DetailItem label="Correo" value={contact.email || 'No suministrado'} /><DetailItem label="Teléfono" value={contact.phone || 'No suministrado'} /><DetailItem label="Servicio solicitado" value={contact.service} wide /><DetailItem label="Fecha de recepción" value={formatDateTime(request.createdAt)} /><DetailItem label="Gestionada por" value={request.processedBy?.name || 'Pendiente de asignación'} />{request.processedAt && <DetailItem label="Fecha de gestión" value={formatDateTime(request.processedAt)} wide />}</div>
    <div className={styles.messageBox}><div><Buildings size={17} /> Mensaje del cliente</div><p>{contact.message || 'Sin mensaje adicional.'}</p></div>
    {request.extractedData?.equipments && request.extractedData.equipments.length > 0 && <div className={styles.equipmentList}><span>Equipos detectados</span><div>{request.extractedData.equipments.map((equipment) => <small key={equipment}>{equipment}</small>)}</div></div>}
    {request.status === 'PENDIENTE' && <div className={styles.detailActions}><button className="btn btn--danger" onClick={() => onAction(request, 'discard')}><Trash size={17} /> Descartar</button><button className="btn btn--primary" onClick={() => onAction(request, 'process')}><Check size={17} /> Marcar procesada</button></div>}
  </div>;
}

function DetailItem({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return <div className={wide ? styles.detailWide : undefined}><span>{label}</span><strong>{value}</strong></div>;
}
