import React, { useRef, useState } from 'react';
import { UploadSimple, FileXls, CheckCircle } from '@phosphor-icons/react';

export interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  accept?: string;
  disabled?: boolean;
}

export function FileUpload({ onFileSelect, selectedFile, accept = '.xlsx, .xls', disabled = false }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      // Basic extension check if accept contains standard extensions
      if (accept.includes('.xlsx') && !droppedFile.name.endsWith('.xlsx') && !droppedFile.name.endsWith('.xls')) {
        // You could use a toast here if you pass it as a prop or import it directly
        // toast.error('Por favor selecciona un archivo válido');
        return;
      }
      onFileSelect(droppedFile);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div 
      style={{
        border: `2px dashed ${isDragging ? 'var(--color-brand)' : 'var(--color-border)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '32px',
        textAlign: 'center',
        background: isDragging ? 'rgba(236,6,11,0.05)' : 'var(--color-surface-2)',
        transition: 'all 0.2s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1
      }}
      onClick={() => !disabled && fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={accept}
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={disabled}
        style={{ display: 'none' }}
      />
      {!selectedFile ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          {accept.includes('.xls') ? (
            <FileXls size={48} weight="thin" color={isDragging ? "var(--color-brand)" : "var(--color-text-muted)"} />
          ) : (
            <UploadSimple size={48} weight="thin" color={isDragging ? "var(--color-brand)" : "var(--color-text-muted)"} />
          )}
          <div>
            <p style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--color-text)' }}>
              Haz clic o arrastra tu archivo aquí
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              Formatos permitidos: {accept}
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <CheckCircle size={48} weight="duotone" color="var(--color-success)" />
          <div>
            <p style={{ fontWeight: 600, color: 'var(--color-text)' }}>{selectedFile.name}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              {(selectedFile.size / 1024).toFixed(2)} KB
            </p>
          </div>
          <button 
            type="button"
            className="btn btn--ghost btn--sm" 
            onClick={clearFile}
            disabled={disabled}
          >
            Cambiar archivo
          </button>
        </div>
      )}
    </div>
  );
}
