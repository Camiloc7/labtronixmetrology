'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, FileText, FilePdf, Eye } from '@phosphor-icons/react';
import { quotesApi, excelApi } from '@/lib/api';
import { ImportExportActions } from '@/components/ImportExportActions';
import { formatDate, formatCOP, QUOTE_STATUS_LABELS, getQuoteStatusBadge } from '@/lib/utils/formatters';
import { Pagination } from '@/components/ui/Pagination';
import { MagnifyingGlass } from '@phosphor-icons/react';
import type { Quote } from '@/lib/types';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState('');

  const fetchQuotes = useCallback(() => {
    setLoading(true);
    quotesApi.getAll(page, limit, search || undefined).then((res) => {
      setQuotes(res.data);
      setTotal(res.meta.total);
      setLastPage(res.meta.lastPage);
    }).catch(() => toast.error('Error al cargar cotizaciones')).finally(() => setLoading(false));
  }, [page, limit, search]);

  useEffect(() => {
    const t = setTimeout(fetchQuotes, 300);
    return () => clearTimeout(t);
  }, [fetchQuotes]);

  const handleExport = async () => {
    await excelApi.downloadExcel('/quotes/export', 'cotizaciones.xlsx');
  };

  const handleImport = async (file: File) => {
    return await excelApi.uploadExcel('/quotes/import', file);
  };

  const reloadData = () => {
    setPage(1);
    fetchQuotes();
  };

  const QUOTES_COLUMNS = [
    { name: 'Cotizacion', description: 'Número de la cotización (Llave única)', required: true },
    { name: 'NITCliente', description: 'NIT del cliente a quien va dirigida' },
    { name: 'Estado', description: 'BORRADOR, ENVIADA, APROBADA, RECHAZADA' },
    { name: 'Notas', description: 'Observaciones o condiciones' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Cotizaciones</h1>
          <p className="page-header__subtitle">Gestión de propuestas económicas para clientes</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <ImportExportActions
            onExport={handleExport}
            onImport={handleImport}
            onImportSuccess={reloadData}
            entityName="Cotizaciones"
            expectedColumns={QUOTES_COLUMNS}
          />
          <Link href="/quotes/new" className="btn btn--primary">
            <Plus size={18} weight="bold" /> Nueva Cotización
          </Link>
        </div>
      </div>

      <div className="search-bar" style={{ marginBottom: 24, maxWidth: 380 }}>
        <MagnifyingGlass size={18} color="var(--color-text-muted)" />
        <input
          type="text"
          placeholder="Buscar por número de cotización..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner spinner--lg" /></div>
      ) : quotes.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <FileText size={48} weight="thin" className="empty-state__icon" />
            <p className="empty-state__title">Sin cotizaciones</p>
            <p className="empty-state__sub">Crea la primera propuesta económica</p>
            <Link href="/quotes/new" className="btn btn--primary" style={{ marginTop: 12 }}>
              <Plus size={16} weight="bold" /> Nueva Cotización
            </Link>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Número</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Ítems</th>
                <th>Total</th>
                <th>Válida hasta</th>
                <th>Creada</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {quotes.map((q, i) => (
                  <motion.tr key={q.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--color-brand-light)', fontWeight: 600 }}>
                        {q.quoteNumber}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{q.client?.companyName}</td>
                    <td><span className={`badge ${getQuoteStatusBadge(q.status)}`}>{QUOTE_STATUS_LABELS[q.status]}</span></td>
                    <td style={{ color: 'var(--color-text-muted)' }}>{q.items?.length || 0}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>{formatCOP(q.totalValue)}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{q.validUntil ? formatDate(q.validUntil) : '—'}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{formatDate(q.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link href={`/quotes/${q.id}`} className="btn btn--ghost btn--sm"><Eye size={15} /></Link>
                        <a
                          href={quotesApi.getPdfUrl(q.id)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn--danger btn--sm"
                          title="Descargar PDF"
                        >
                          <FilePdf size={15} />
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          <Pagination
            page={page}
            limit={limit}
            total={total}
            lastPage={lastPage}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
}
