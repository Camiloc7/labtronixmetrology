'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, FloppyDisk } from '@phosphor-icons/react';
import { workOrdersApi, equipmentApi, clientsApi, usersApi } from '@/lib/api';
import type { Client, Equipment, User, CreateWorkOrderDto } from '@/lib/types';

export default function NewWorkOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [form, setForm] = useState<CreateWorkOrderDto>({
    equipmentId: '',
    clientId: '',
    quoteId: '',
    assignedToId: '',
    serviceType: 'PROPIO',
    technicalNotes: '',
  });

  useEffect(() => {
    Promise.all([clientsApi.getAll(), equipmentApi.getAll(), usersApi.getAll()])
      .then(([c, e, u]) => {
        setClients(c);
        setEquipment(e);
        setTechnicians(u.filter((user: User) => user.role === 'TECNICO' || user.role === 'ADMIN'));
      })
      .catch(() => toast.error('Error al cargar datos'));
  }, []);

  const set = (field: keyof CreateWorkOrderDto, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.equipmentId) { toast.error('Selecciona un equipo'); return; }
    if (!form.clientId) { toast.error('Selecciona un cliente'); return; }
    setLoading(true);
    try {
      const payload = {
        ...form,
        quoteId: form.quoteId || undefined,
        assignedToId: form.assignedToId || undefined,
      };
      await workOrdersApi.create(payload);
      toast.success('Orden de trabajo creada');
      router.push('/work-orders');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Error al crear OT');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <Link href="/work-orders" className="btn btn--ghost btn--sm" style={{ marginBottom: 12, display: 'inline-flex' }}>
            <ArrowLeft size={16} /> Volver a OTs
          </Link>
          <h1 className="page-header__title">Nueva Orden de Trabajo</h1>
          <p className="page-header__subtitle">Crear una nueva OT para un equipo en el laboratorio</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Cliente *</label>
              <select className="form-input" value={form.clientId} onChange={(e) => set('clientId', e.target.value)} required>
                <option value="">Seleccionar cliente...</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.companyName}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Equipo *</label>
              <select className="form-input" value={form.equipmentId} onChange={(e) => set('equipmentId', e.target.value)} required>
                <option value="">Seleccionar equipo...</option>
                {equipment.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    [{eq.internalCode}] {eq.brand} {eq.model}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tipo de Servicio</label>
              <select className="form-input" value={form.serviceType} onChange={(e) => set('serviceType', e.target.value)}>
                <option value="PROPIO">Propio</option>
                <option value="TERCERIZADO">Tercerizado</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Asignar a Técnico</label>
              <select className="form-input" value={form.assignedToId} onChange={(e) => set('assignedToId', e.target.value)}>
                <option value="">Sin asignar</option>
                {technicians.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.role})</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Notas Técnicas</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Observaciones técnicas iniciales, accesorios incluidos..."
                value={form.technicalNotes}
                onChange={(e) => set('technicalNotes', e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
            <Link href="/work-orders" className="btn btn--secondary">Cancelar</Link>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <FloppyDisk size={18} weight="bold" />}
              {loading ? 'Creando...' : 'Crear OT'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
