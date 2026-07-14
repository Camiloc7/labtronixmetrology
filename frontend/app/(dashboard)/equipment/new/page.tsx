'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, FloppyDisk } from '@phosphor-icons/react';
import { equipmentApi, clientsApi } from '@/lib/api';
import type { Client, CreateEquipmentDto } from '@/lib/types';

export default function NewEquipmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState<CreateEquipmentDto>({
    clientId: '',
    brand: '',
    model: '',
    serialNumber: '',
    capacity: '',
    location: '',
    notes: '',
  });

  useEffect(() => {
    clientsApi.getAll().then(setClients).catch(() => toast.error('Error al cargar clientes'));
  }, []);

  const set = (field: keyof CreateEquipmentDto, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientId) { toast.error('Selecciona un cliente'); return; }
    setLoading(true);
    try {
      await equipmentApi.create(form);
      toast.success('Equipo registrado correctamente');
      router.push('/equipment');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Error al registrar');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <Link href="/equipment" className="btn btn--ghost btn--sm" style={{ marginBottom: 12, display: 'inline-flex' }}>
            <ArrowLeft size={16} /> Volver a Equipos
          </Link>
          <h1 className="page-header__title">Registrar Equipo</h1>
          <p className="page-header__subtitle">Registrar el ingreso de un nuevo equipo al laboratorio</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Cliente *</label>
              <select
                className="form-input"
                value={form.clientId}
                onChange={(e) => set('clientId', e.target.value)}
                required
              >
                <option value="">Seleccionar cliente...</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.companyName} {c.nit ? `(${c.nit})` : ''}</option>
                ))}
              </select>
            </div>

            {[
              { key: 'brand', label: 'Marca', placeholder: 'Mettler Toledo' },
              { key: 'model', label: 'Modelo', placeholder: 'ME54' },
              { key: 'serialNumber', label: 'N° de Serie', placeholder: 'SN123456789' },
              { key: 'capacity', label: 'Capacidad / Rango', placeholder: '220g / 0.1mg' },
              { key: 'location', label: 'Ubicación en laboratorio', placeholder: 'Área 1 - Rack 3' },
            ].map((f) => (
              <div key={f.key} className="form-group">
                <label className="form-label">{f.label}</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={f.placeholder}
                  value={(form as any)[f.key] || ''}
                  onChange={(e) => set(f.key as keyof CreateEquipmentDto, e.target.value)}
                />
              </div>
            ))}

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Observaciones</label>
              <textarea className="form-input" rows={3} value={form.notes || ''} onChange={(e) => set('notes', e.target.value)} style={{ resize: 'vertical' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
            <Link href="/equipment" className="btn btn--secondary">Cancelar</Link>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <FloppyDisk size={18} weight="bold" />}
              {loading ? 'Guardando...' : 'Registrar Equipo'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
