'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from '@phosphor-icons/react';
import { FileUpload } from '@/components/ui/FileUpload';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ message: string; details?: any } | null>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);
    if (selectedFile) {
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setResult(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/import/excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult({ message: response.data.message, details: response.data.details });
      toast.success('Archivo procesado con éxito');
      setFile(null); // Clear file after successful upload
    } catch (error: any) {
      console.error(error);
      const errMessage = error.response?.data?.message || 'Error al procesar el archivo.';
      toast.error(errMessage);
      setResult({ message: 'Error en la importación', details: error.response?.data });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="page-content" style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: 8 }}>
          Importar Datos
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Sube tu archivo de Excel de pruebas (Datos_Prueba.xlsx) para poblar la base de datos con Clientes, Cotizaciones, Órdenes y Equipos.
        </p>
      </div>

      <FileUpload
        onFileSelect={handleFileSelect}
        selectedFile={file}
        accept=".xlsx"
        disabled={isUploading}
      />

      {file && (
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 16 }}>
          <button
            className="btn btn--outline"
            onClick={() => { setFile(null); setResult(null); }}
            disabled={isUploading}
          >
            Cancelar
          </button>
          <button
            className="btn btn--primary"
            onClick={handleUpload}
            disabled={isUploading}
            style={{ minWidth: 140 }}
          >
            {isUploading ? <div className="spinner spinner--sm" /> : 'Procesar Archivo'}
          </button>
        </div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: 32,
            padding: 24,
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            {result.message.includes('Error') ? (
              <XCircle size={28} weight="fill" color="var(--color-danger)" />
            ) : (
              <CheckCircle size={28} weight="fill" color="var(--color-success)" />
            )}
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{result.message}</h3>
          </div>
          
          {result.details && (
            <pre style={{ 
              background: 'var(--color-bg)', 
              padding: 16, 
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              overflowX: 'auto',
              color: 'var(--color-text-muted)'
            }}>
              {JSON.stringify(result.details, null, 2)}
            </pre>
          )}
        </motion.div>
      )}
    </div>
  );
}
