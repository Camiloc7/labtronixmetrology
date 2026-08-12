'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, ClipboardText, FilePdf, FileXls, MagnifyingGlass } from '@phosphor-icons/react';
import { Pagination } from '@/components/ui/Pagination';
import { workOrdersApi } from '@/lib/api';
import type { WorkOrder } from '@/lib/types';
import { subscribeToWorkOrderEvents } from '@/lib/work-order-realtime';

export default function WorkOrdersPage() {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState('');

  const fetchOrders = useCallback(() => {
    setLoading(true);
    workOrdersApi.getAll(page, limit, search || undefined)
      .then((res) => {
        setOrders(res.data);
        setTotal(res.meta.total);
        setLastPage(res.meta.lastPage);
      })
      .catch(() => toast.error('Error al cargar órdenes'))
      .finally(() => setLoading(false));
  }, [page, limit, search]);

  useEffect(() => {
    const t = setTimeout(fetchOrders, 300);
    return () => clearTimeout(t);
  }, [fetchOrders]);

  useEffect(() => subscribeToWorkOrderEvents(fetchOrders), [fetchOrders]);

  const handleDownloadPdf = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    window.open(workOrdersApi.getPdfUrl(id), '_blank');
  };

  const handleDownloadExcel = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    window.open(workOrdersApi.getExcelUrl(id), '_blank');
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Órdenes de Trabajo</h1>
          <p className="page-description">Seguimiento y gestión de calibraciones de equipos</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/work-orders/new" className="btn btn-primary">
            <Plus size={18} weight="bold" /> Nueva OT
          </Link>
        </div>
      </div>

      <div className="search-bar" style={{ marginBottom: 24, maxWidth: 380 }}>
        <MagnifyingGlass size={18} color="var(--color-text-muted)" />
        <input
          type="text"
          placeholder="Buscar por número de OT..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="card">
        {loading ? (
          <div className="text-center py-8 text-muted">Cargando órdenes de trabajo...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state py-12 text-center">
            <ClipboardText size={48} weight="thin" className="mx-auto text-muted mb-4" />
            <p className="text-lg font-medium">No hay órdenes de trabajo</p>
            <p className="text-muted">Crea una nueva orden para comenzar</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>OT No.</th>
                  <th>Fecha Solicitud</th>
                  <th>Cliente</th>
                  <th>OFERTA No.</th>
                  <th>Equipos (Ítems)</th>
                  <th className="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium">
                      <Link href={`/work-orders/${order.id}`} className="text-brand hover:underline">
                        {order.otNumber}
                      </Link>
                    </td>
                    <td>{order.requestDate ? new Date(order.requestDate).toLocaleDateString() : 'N/A'}</td>
                    <td>{order.client?.companyName}</td>
                    <td>
                      {order.quote?.quoteNumber ? (
                        <Link href={`/quotes/${order.quoteId}`} className="text-brand hover:underline">
                          {order.quote.quoteNumber}
                        </Link>
                      ) : 'N/A'}
                    </td>
                    <td>{order.items?.length || 0}</td>
                    <td>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={(e) => handleDownloadPdf(order.id, e)}
                          className="btn btn-secondary btn-sm"
                          title="Descargar PDF"
                        >
                          <FilePdf size={16} />
                        </button>
                        <button
                          onClick={(e) => handleDownloadExcel(order.id, e)}
                          className="btn btn-secondary btn-sm"
                          title="Descargar Excel"
                        >
                          <FileXls size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
    </div>
  );
}
