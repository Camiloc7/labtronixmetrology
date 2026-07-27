'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { equipmentApi } from '@/lib/api';
import { Package, CaretDown, CaretUp } from '@phosphor-icons/react';
import { formatDate } from '@/lib/utils/formatters';

export default function QuoteReceptionsPanel({ quoteId }: { quoteId: string }) {
  const [receptions, setReceptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    fetchReceptions();
  }, [quoteId]);

  const fetchReceptions = async () => {
    try {
      setLoading(true);
      const data = await equipmentApi.getReceptionsByQuote(quoteId);
      setReceptions(data || []);
    } catch (error) {
      toast.error('Error al cargar equipos recibidos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (receptions.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ padding: '20px', borderBottom: isOpen ? '1px solid var(--color-border)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-surface)', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', backgroundColor: 'rgba(23, 115, 234, 0.1)', borderRadius: '8px', color: 'var(--color-brand)' }}>
            <Package size={20} weight="fill" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Equipos Recibidos (Recepción de Equipos)</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>{receptions.length} {receptions.length === 1 ? 'equipo ingresado' : 'equipos ingresados'} para esta cotización.</p>
          </div>
        </div>
        <div>
          {isOpen ? <CaretUp size={24} /> : <CaretDown size={24} />}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
            <div className="table-wrapper" style={{ border: 'none', overflowX: 'auto', margin: 0, borderRadius: 0 }}>
              <table className="table" style={{ minWidth: 1000 }}>
                <thead style={{ backgroundColor: 'var(--color-bg-alt)' }}>
                  <tr>
                    <th>N° Rec.</th>
                    <th>Cant.</th>
                    <th>Descripción</th>
                    <th>Magnitud</th>
                    <th>Acreditación</th>
                    <th>Lugar</th>
                    <th>Fecha Recepción</th>
                    <th>Fecha Calibración</th>
                    <th>N° Certificado</th>
                  </tr>
                </thead>
                <tbody>
                  {receptions.map((rec) => (
                    <tr key={rec.id}>
                      <td style={{ fontWeight: 600, color: 'var(--color-brand)' }}>{rec.nRecepcion || '-'}</td>
                      <td>{rec.cantidad || 1}</td>
                      <td>{rec.descripcion || '-'}</td>
                      <td>{rec.magnitud || '-'}</td>
                      <td>{rec.acreditacion || '-'}</td>
                      <td>{rec.lugarCalibracion || '-'}</td>
                      <td style={{ color: 'var(--color-text-muted)' }}>{rec.fechaRecepcion ? formatDate(rec.fechaRecepcion) : '-'}</td>
                      <td style={{ color: 'var(--color-text-muted)' }}>{rec.fechaCalibracion ? formatDate(rec.fechaCalibracion) : '-'}</td>
                      <td style={{ fontWeight: 600 }}>{rec.noCertificado || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
