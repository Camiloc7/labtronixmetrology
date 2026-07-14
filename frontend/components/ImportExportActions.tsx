'use client';

import React, { useRef, useState } from 'react';
import { DownloadSimple, UploadSimple, Spinner, X, FileXls, CheckCircle } from '@phosphor-icons/react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export interface ExpectedColumn {
  name: string;
  description: string;
  required?: boolean;
}

interface ImportExportActionsProps {
  onExport: () => Promise<void>;
  onImport: (file: File) => Promise<any>;
  onImportSuccess?: () => void;
  exportLabel?: string;
  importLabel?: string;
  entityName: string;
  expectedColumns: ExpectedColumn[];
}

export function ImportExportActions({
  onExport,
  onImport,
  onImportSuccess,
  exportLabel = 'Exportar',
  importLabel = 'Importar',
  entityName,
  expectedColumns,
}: ImportExportActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleExportClick = async () => {
    setIsExporting(true);
    try {
      await onExport();
      toast.success('Exportación completada');
    } catch (error: any) {
      toast.error(error.message || 'Error al exportar');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const executeImport = async () => {
    if (!selectedFile) return;

    setIsImporting(true);
    try {
      const result = await onImport(selectedFile);
      toast.success(`Importación exitosa. Creados: ${result.created || 0}, Actualizados: ${result.updated || 0}`);
      if (onImportSuccess) {
        onImportSuccess();
      }
      setShowModal(false);
      setSelectedFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Error al importar');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => setShowModal(true)}
          disabled={isImporting || isExporting}
          className="btn btn--secondary"
        >
          <UploadSimple size={16} weight="bold" />
          {importLabel}
        </button>
        <button
          onClick={handleExportClick}
          disabled={isImporting || isExporting}
          className="btn btn--primary"
        >
          {isExporting ? <Spinner size={16} className="animate-spin" /> : <DownloadSimple size={16} weight="bold" />}
          {exportLabel}
        </button>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget && !isImporting) setShowModal(false); }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="modal"
            >
              <div className="modal__header">
                <h2 className="modal__title">Importar {entityName}</h2>
                <button className="modal__close" onClick={() => !isImporting && setShowModal(false)}><X size={20} /></button>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                  Asegúrate de que tu archivo Excel contenga las siguientes columnas en la primera fila. 
                  El sistema actualizará los registros existentes o creará nuevos según corresponda.
                </p>
                <div className="table-wrapper" style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '24px' }}>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Columna</th>
                        <th>Descripción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expectedColumns.map((col) => (
                        <tr key={col.name}>
                          <td>
                            <span style={{ fontWeight: 600 }}>{col.name}</span>
                            {col.required && <span style={{ color: 'var(--color-brand)', marginLeft: '4px' }}>*</span>}
                          </td>
                          <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{col.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{
                  border: '2px dashed var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '32px',
                  textAlign: 'center',
                  background: 'var(--color-surface-2)',
                  transition: 'border-color var(--transition)'
                }}>
                  <input
                    type="file"
                    accept=".xlsx, .xls"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  {!selectedFile ? (
                    <>
                      <FileXls size={48} weight="thin" color="var(--color-text-muted)" style={{ margin: '0 auto 12px' }} />
                      <p style={{ fontWeight: 600, marginBottom: '8px' }}>Selecciona tu archivo Excel</p>
                      <button className="btn btn--secondary btn--sm" onClick={() => fileInputRef.current?.click()}>
                        Explorar archivos
                      </button>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={48} weight="duotone" color="var(--color-success)" style={{ margin: '0 auto 12px' }} />
                      <p style={{ fontWeight: 600, marginBottom: '4px' }}>{selectedFile.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                      <button className="btn btn--ghost btn--sm" onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}>
                        Cambiar archivo
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="btn btn--ghost" onClick={() => setShowModal(false)} disabled={isImporting}>
                  Cancelar
                </button>
                <button className="btn btn--primary" onClick={executeImport} disabled={!selectedFile || isImporting}>
                  {isImporting ? <Spinner size={16} className="animate-spin" /> : <UploadSimple size={16} weight="bold" />}
                  {isImporting ? 'Importando...' : 'Importar Archivo'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
