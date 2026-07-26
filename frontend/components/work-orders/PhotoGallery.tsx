'use client';

import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Trash, Plus } from '@phosphor-icons/react';
import { workOrdersApi } from '@/lib/api';
import CameraCapture from '../ui/CameraCapture';

interface Photo {
  id: string;
  publicId: string;
  description?: string;
  createdAt: string;
}

interface PhotoGalleryProps {
  itemId: string;
  photos: Photo[];
  onPhotoAdded: (newPhoto: Photo) => void;
  onPhotoDeleted: (photoId: string) => void;
}

export default function PhotoGallery({ itemId, photos = [], onPhotoAdded, onPhotoDeleted }: PhotoGalleryProps) {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Convert base64 to File
  const base64ToFile = (base64: string, filename: string): File => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleCapture = async (imageSrc: string) => {
    setIsCameraOpen(false);
    setUploading(true);
    try {
      const file = base64ToFile(imageSrc, `capture_${Date.now()}.jpg`);
      const newPhoto = await workOrdersApi.uploadItemPhoto(itemId, file);
      onPhotoAdded(newPhoto);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error al subir la foto');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const newPhoto = await workOrdersApi.uploadItemPhoto(itemId, file);
      onPhotoAdded(newPhoto);
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error al subir la foto');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = ''; // reset input
    }
  };

  const handleDelete = async (photoId: string) => {
    if (!confirm('¿Seguro que deseas eliminar esta foto?')) return;
    try {
      await workOrdersApi.deletePhoto(photoId);
      onPhotoDeleted(photoId);
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Error al eliminar la foto');
    }
  };

  return (
    <div style={{ marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>Registro Fotográfico</h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn btn-secondary" 
            onClick={() => setIsCameraOpen(true)}
            disabled={uploading}
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            <Camera size={18} /> Cámara
          </button>
          
          <label className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem', cursor: 'pointer', margin: 0 }}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
              disabled={uploading}
            />
            <ImageIcon size={18} /> Subir
          </label>
        </div>
      </div>

      {uploading && (
        <div style={{ padding: '12px', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
          Subiendo foto...
        </div>
      )}

      {photos.length === 0 ? (
        <div style={{ 
          padding: '32px', 
          border: '2px dashed var(--color-border)', 
          borderRadius: 'var(--radius-md)', 
          textAlign: 'center',
          color: 'var(--color-text-muted)'
        }}>
          <Camera size={32} style={{ opacity: 0.5, marginBottom: '8px' }} />
          <p style={{ margin: 0, fontSize: '0.9rem' }}>No hay fotos registradas para este equipo.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
          {photos.map(photo => (
            <div key={photo.id} style={{ 
              position: 'relative', 
              aspectRatio: '1', 
              borderRadius: 'var(--radius-md)', 
              overflow: 'hidden',
              border: '1px solid var(--color-border)'
            }}>
              <img 
                src={photo.publicId} 
                alt="Equipo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <button
                onClick={() => handleDelete(photo.id)}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(255,0,0,0.8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Eliminar foto"
              >
                <Trash size={14} weight="bold" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isCameraOpen && (
        <CameraCapture 
          onCapture={handleCapture} 
          onClose={() => setIsCameraOpen(false)} 
        />
      )}
    </div>
  );
}
