'use client';

import React, { useRef, useState } from 'react';
import { DownloadSimple, UploadSimple, Spinner, X, FileXls, CheckCircle } from '@phosphor-icons/react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from './ui/Modal';
import { FileUpload } from './ui/FileUpload';

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

      <Modal
        isOpen={showModal}
        onClose={() => !isImporting && setShowModal(false)}
        title={`Importar ${entityName}`}
        disableClose={isImporting}
      >
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

          <FileUpload 
            onFileSelect={setSelectedFile}
            selectedFile={selectedFile}
            accept=".xlsx, .xls"
            disabled={isImporting}
          />
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
      </Modal>
    </>
  );
}
