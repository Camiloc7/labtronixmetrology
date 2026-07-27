'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { quotesApi } from '@/lib/api';
import { CaretDown, CaretUp, FloppyDisk, Info } from '@phosphor-icons/react';

interface QuoteTrackingPanelProps {
  quoteId: string;
}

export default function QuoteTrackingPanel({ quoteId }: QuoteTrackingPanelProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>({});
  
  // Accordion state
  const [openSection, setOpenSection] = useState<string | null>('general');

  useEffect(() => {
    fetchTracking();
  }, [quoteId]);

  const fetchTracking = async () => {
    try {
      setLoading(true);
      const res = await quotesApi.getTracking(quoteId);
      
      // Convert dates to YYYY-MM-DD for inputs
      const formattedData = { ...res };
      Object.keys(formattedData).forEach(key => {
        if (formattedData[key] && typeof formattedData[key] === 'string' && formattedData[key].includes('T')) {
          formattedData[key] = formattedData[key].split('T')[0];
        }
      });
      
      setData(formattedData);
    } catch (error) {
      toast.error('Error al cargar la trazabilidad');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Clean empty strings to null for API
      const payload = { ...data };
      Object.keys(payload).forEach(key => {
        if (payload[key] === '') payload[key] = null;
      });
      
      await quotesApi.updateTracking(quoteId, payload);
      toast.success('Trazabilidad guardada correctamente');
    } catch (error) {
      toast.error('Error al guardar trazabilidad');
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}><div className="spinner" /> Cargando...</div>;

  const renderSectionHeader = (id: string, title: string) => (
    <div 
      onClick={() => toggleSection(id)}
      style={{
        padding: '16px 20px',
        backgroundColor: openSection === id ? 'var(--color-bg-alt)' : 'transparent',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
      }}
    >
      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: openSection === id ? 'var(--color-brand)' : 'inherit' }}>
        {title}
      </h3>
      {openSection === id ? <CaretUp size={20} /> : <CaretDown size={20} />}
    </div>
  );

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-surface)' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Seguimiento y Trazabilidad</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>Gestiona las fechas y documentos de toda la operación.</p>
        </div>
        <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
          {saving ? <div className="spinner" style={{ width: 16, height: 16 }} /> : <FloppyDisk size={18} />}
          Guardar Cambios
        </button>
      </div>

      {/* 1. Compras y Requisiciones */}
      <div>
        {renderSectionHeader('general', 'Compras y Requisiciones')}
        <AnimatePresence>
          {openSection === 'general' && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
              <div className="grid-2" style={{ padding: 20, gap: 20 }}>
                <div className="form-group">
                  <label>Fecha pactada del Servicio</label>
                  <input type="date" className="input" name="fechaPactadaServicio" value={data.fechaPactadaServicio || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>ID Orden de Trabajo (OT)</label>
                  <input type="text" className="input" name="idOrdenTrabajo" value={data.idOrdenTrabajo || ''} onChange={handleChange} placeholder="Ej: 119-24" />
                </div>
                <div className="form-group">
                  <label>ID Requisición</label>
                  <input type="text" className="input" name="idRequisicion" value={data.idRequisicion || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>ID Orden de Compra (OC)</label>
                  <input type="text" className="input" name="idOrdenCompra" value={data.idOrdenCompra || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Fecha de entrega OC</label>
                  <input type="date" className="input" name="fechaEntregaOc" value={data.fechaEntregaOc || ''} onChange={handleChange} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Operación y Equipos */}
      <div>
        {renderSectionHeader('operacion', 'Logística de Equipos')}
        <AnimatePresence>
          {openSection === 'operacion' && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
              <div className="grid-2" style={{ padding: 20, gap: 20 }}>
                <div className="form-group">
                  <label>Fecha Recepción de Equipos</label>
                  <input type="date" className="input" name="fechaRecepcionEquipos" value={data.fechaRecepcionEquipos || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>ID Recepción de Equipos</label>
                  <input type="text" className="input" name="idRecepcionEquipos" value={data.idRecepcionEquipos || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Fecha de Reporte (Servicio)</label>
                  <input type="date" className="input" name="fechaReporte" value={data.fechaReporte || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>ID Reporte de Servicio</label>
                  <input type="text" className="input" name="idReporteServicio" value={data.idReporteServicio || ''} onChange={handleChange} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Laboratorio Externo */}
      <div>
        {renderSectionHeader('externo', 'Laboratorio Externo (Subcontratación)')}
        <AnimatePresence>
          {openSection === 'externo' && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
              <div className="grid-2" style={{ padding: 20, gap: 20 }}>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Laboratorio Externo (Nombre)</label>
                  <input type="text" className="input" name="laboratorioExterno" value={data.laboratorioExterno || ''} onChange={handleChange} placeholder="Ej: INM, LOGAN..." />
                </div>
                <div className="form-group">
                  <label>Fecha de Ingreso a Lab. Externo</label>
                  <input type="date" className="input" name="fechaIngresoLabExterno" value={data.fechaIngresoLabExterno || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Fecha de Entrega (Lab Externo)</label>
                  <input type="date" className="input" name="fechaEntregaEquipoLabExterno" value={data.fechaEntregaEquipoLabExterno || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Fecha de Recoger el Equipo</label>
                  <input type="date" className="input" name="fechaRecogerEquipo" value={data.fechaRecogerEquipo || ''} onChange={handleChange} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. Despachos y Certificados */}
      <div>
        {renderSectionHeader('entregas', 'Despachos y Certificados')}
        <AnimatePresence>
          {openSection === 'entregas' && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
              <div className="grid-2" style={{ padding: 20, gap: 20 }}>
                <div className="form-group">
                  <label>Fecha Entrega al Cliente</label>
                  <input type="date" className="input" name="fechaEntregaEquipoCliente" value={data.fechaEntregaEquipoCliente || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>ID Reporte Entrega Servicios</label>
                  <input type="text" className="input" name="idReporteEntregaServicios" value={data.idReporteEntregaServicios || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Fecha Reporte Entrega</label>
                  <input type="date" className="input" name="fechaReporteEntregaServicio" value={data.fechaReporteEntregaServicio || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>ID Certificado</label>
                  <input type="text" className="input" name="idCertificado" value={data.idCertificado || ''} onChange={handleChange} placeholder="Ej: 4200243194" />
                </div>
                <div className="form-group">
                  <label>Fecha Emisión Certificado</label>
                  <input type="date" className="input" name="fechaEmisionCertificado" value={data.fechaEmisionCertificado || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Fecha Entrega Certificado</label>
                  <input type="date" className="input" name="fechaEntregaCertificado" value={data.fechaEntregaCertificado || ''} onChange={handleChange} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Facturación */}
      <div>
        {renderSectionHeader('facturacion', 'Facturación y Cobro')}
        <AnimatePresence>
          {openSection === 'facturacion' && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
              <div className="grid-2" style={{ padding: 20, gap: 20 }}>
                <div className="form-group">
                  <label>ID Factura</label>
                  <input type="text" className="input" name="idFactura" value={data.idFactura || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Fecha de Factura</label>
                  <input type="date" className="input" name="fechaFactura" value={data.fechaFactura || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Comprobante de Egreso</label>
                  <input type="text" className="input" name="comprobanteEgreso" value={data.comprobanteEgreso || ''} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Fecha de Pago</label>
                  <input type="date" className="input" name="fechaPago" value={data.fechaPago || ''} onChange={handleChange} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
