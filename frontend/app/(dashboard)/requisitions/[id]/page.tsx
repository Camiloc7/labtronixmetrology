'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FilePdf, FileXls } from '@phosphor-icons/react';
import { requisitionsApi } from '@/lib/api';
import { Requisition } from '@/lib/types';
import toast from 'react-hot-toast';

export default function RequisitionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [requisition, setRequisition] = useState<Requisition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (id) {
      requisitionsApi.getById(id as string)
        .then(setRequisition)
        .catch(() => setIsError(true))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleDownloadPdf = () => {
    if (id) window.open(requisitionsApi.getPdfUrl(id as string), '_blank');
  };

  const handleDownloadExcel = () => {
    if (id) window.open(requisitionsApi.getExcelUrl(id as string), '_blank');
  };

  if (isLoading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[400px]">
        <div className="text-muted">Cargando requisición...</div>
      </div>
    );
  }

  if (isError || !requisition) {
    return (
      <div className="page-container flex items-center justify-center min-h-[400px]">
        <div className="text-error">Error al cargar la requisición</div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <Link href="/requisitions" className="btn btn-secondary btn-sm" style={{ padding: 8 }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="page-title">Requisición {requisition.consecutiveNumber}</h1>
            <p className="page-description">Detalles de la requisición de compras o servicios</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
          <button onClick={handleDownloadPdf} className="btn btn-primary">
            <FilePdf size={20} />
            Descargar PDF
          </button>
          <button onClick={handleDownloadExcel} className="btn btn-secondary">
            <FileXls size={20} />
            Descargar Excel
          </button>
        </div>
      </header>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
        {/* INFO PRINCIPAL */}
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Información General</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--color-border)' }}>
              <span className="text-muted">Consecutivo:</span>
              <span className="font-medium">{requisition.consecutiveNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--color-border)' }}>
              <span className="text-muted">Fecha:</span>
              <span className="font-medium">{new Date(requisition.date).toLocaleDateString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--color-border)' }}>
              <span className="text-muted">Actividad:</span>
              <span className="font-medium">{requisition.activity}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--color-border)' }}>
              <span className="text-muted">Cotización asociada:</span>
              <span className="font-medium">{requisition.quoteNumber || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* INFO FIRMAS */}
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Observaciones y Firmas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--color-border)' }}>
              <span className="text-muted">A nombre de:</span>
              <span className="font-medium text-right">{requisition.certificateToName}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--color-border)' }}>
              <span className="text-muted">Dirección:</span>
              <span className="font-medium text-right">{requisition.certificateAddress}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--color-border)' }}>
              <span className="text-muted">Solicitado por:</span>
              <span className="font-medium text-right">{requisition.requesterName} ({requisition.requesterRole})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid var(--color-border)' }}>
              <span className="text-muted">Autorizado por:</span>
              <span className="font-medium text-right">
                {requisition.authorizerName ? `${requisition.authorizerName} (${requisition.authorizerRole})` : 'Pendiente'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--spacing-md)' }}>Ítems ({requisition.items?.length || 0})</h2>
        <div className="table-wrapper" style={{ border: 'none', overflowX: 'auto' }}>
          <table className="table" style={{ minWidth: 600 }}>
            <thead>
              <tr>
                <th style={{ width: 60, textAlign: 'center' }}>#</th>
                <th style={{ width: 100, textAlign: 'center' }}>Cantidad</th>
                <th style={{ width: 100, textAlign: 'center' }}>U. Medida</th>
                <th>Descripción (Características técnicas)</th>
              </tr>
            </thead>
            <tbody>
              {requisition.items?.map((item, index) => (
                <tr key={item.id}>
                  <td className="text-center">{index + 1}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-center">{item.unitOfMeasure}</td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
