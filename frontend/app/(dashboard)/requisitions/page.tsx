'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, MagnifyingGlass, FilePdf, FileXls } from '@phosphor-icons/react';
import { requisitionsApi } from '@/lib/api';
import { Requisition } from '@/lib/types';
import toast from 'react-hot-toast';
import { Pagination } from '@/components/ui/Pagination';

export default function RequisitionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    requisitionsApi.getAll(page, limit, searchTerm || undefined)
      .then((res) => {
        setRequisitions(res.data);
        setTotal(res.meta.total);
        setLastPage(res.meta.lastPage);
      })
      .catch(() => toast.error('Error al cargar requisiciones'))
      .finally(() => setIsLoading(false));
  }, [page, limit, searchTerm]);

  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
  }, [fetchData]);

  const handleDownloadPdf = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    window.open(requisitionsApi.getPdfUrl(id), '_blank');
  };

  const handleDownloadExcel = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    window.open(requisitionsApi.getExcelUrl(id), '_blank');
  };

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <div>
          <h1 className="page-title">Requisiciones</h1>
          <p className="page-description">Gestiona las requisiciones de compras y servicios.</p>
        </div>
        <Link href="/requisitions/new" className="btn btn-primary">
          <Plus size={20} />
          Nueva Requisición
        </Link>
      </header>

      <div className="card">
        <div className="search-bar" style={{ maxWidth: 400, marginBottom: 'var(--spacing-lg)' }}>
          <MagnifyingGlass className="search-icon" size={20} />
          <input
            type="text"
            className="input search-input"
            placeholder="Buscar por consecutivo, actividad o cliente..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Consecutivo</th>
                <th>Fecha</th>
                <th>Actividad</th>
                <th>A nombre de</th>
                <th>Solicitante</th>
                <th className="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted">Cargando requisiciones...</td>
                </tr>
              ) : requisitions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted">No se encontraron requisiciones.</td>
                </tr>
              ) : (
                requisitions.map((req: Requisition) => (
                  <tr key={req.id}>
                    <td className="font-medium">
                      <Link href={`/requisitions/${req.id}`} className="text-brand hover:underline">
                        {req.consecutiveNumber}
                      </Link>
                    </td>
                    <td>{new Date(req.date).toLocaleDateString()}</td>
                    <td>{req.activity}</td>
                    <td>{req.certificateToName}</td>
                    <td>{req.requesterName}</td>
                    <td>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={(e) => handleDownloadPdf(req.id, e)}
                          className="btn btn-secondary btn-sm"
                          title="Descargar PDF"
                        >
                          <FilePdf size={16} />
                        </button>
                        <button
                          onClick={(e) => handleDownloadExcel(req.id, e)}
                          className="btn btn-secondary btn-sm"
                          title="Descargar Excel"
                        >
                          <FileXls size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
      </div>
    </div>
  );
}
