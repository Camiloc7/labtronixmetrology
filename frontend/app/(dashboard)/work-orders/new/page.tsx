'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Plus, Trash, ArrowLeft, FloppyDisk } from '@phosphor-icons/react';
import { workOrdersApi, equipmentApi, quotesApi, usersApi } from '@/lib/api';
import type { Client, Equipment, User, Quote, CreateWorkOrderDto } from '@/lib/types';
import ClientSelector from '@/components/ui/ClientSelector';

export default function NewWorkOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [technicians, setTechnicians] = useState<User[]>([]);

  const [form, setForm] = useState<CreateWorkOrderDto>({
    otNumber: '',
    clientId: '',
    quoteId: '',
    requestDate: new Date().toISOString().split('T')[0],
    serviceDate: new Date().toISOString().split('T')[0],
    activity: 'Calibración equipos de pesaje',
    certificateToName: '',
    certificateAddress: '',
    certificateContact: '',
    certificatePhone: '',
    certificateCity: '',
    requesterName: '',
    requesterRole: '',
    authorizerName: '',
    authorizerRole: '',
    items: [],
  });

  useEffect(() => {
    Promise.all([equipmentApi.getAll(), quotesApi.getAll(), usersApi.getAll()])
      .then(([e, q, u]) => {
        setEquipments(e);
        setQuotes(q);
        setTechnicians(u.filter((user: User) => user.role === 'TECNICO' || user.role === 'ADMIN'));
        
        // Auto-generate OT Number (in a real app, backend would generate this)
        const year = new Date().getFullYear().toString().slice(-2);
        const rand = Math.floor(1000 + Math.random() * 9000);
        setForm(prev => ({ ...prev, otNumber: `${rand}${year}` }));
      })
      .catch(() => toast.error('Error al cargar datos básicos'));
  }, []);

  const set = (field: keyof CreateWorkOrderDto, value: any) =>
    setForm((p) => ({ ...p, [field]: value }));

  const addItem = () => {
    setForm(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          equipmentId: '',
          assignedToId: '',
          serviceType: 'PROPIO',
          technicalNotes: 'Calibración con acreditación',
        }
      ]
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...form.items];
    (newItems[index] as any)[field] = value;
    setForm(prev => ({ ...prev, items: newItems }));
  };

  const removeItem = (index: number) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleClientChange = (clientId: string, client?: any) => {
    set('clientId', clientId);
    if (client) {
      setForm(prev => ({
        ...prev,
        certificateToName: client.companyName || '',
        certificateAddress: client.address || '',
        certificateContact: client.contactName || '',
        certificatePhone: client.phone || '',
        certificateCity: client.city || '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientId) { toast.error('Selecciona un cliente'); return; }
    if (form.items.length === 0) { toast.error('Agrega al menos un equipo a la OT'); return; }
    if (form.items.some(item => !item.equipmentId)) { toast.error('Todos los ítems deben tener un equipo seleccionado'); return; }

    setLoading(true);
    try {
      await workOrdersApi.create({
        ...form,
        quoteId: form.quoteId || undefined,
      });
      toast.success('Orden de trabajo creada exitosamente');
      router.push('/work-orders');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Error al crear OT');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header mb-6">
        <div>
          <Link href="/work-orders" className="text-muted hover:text-brand flex items-center gap-2 mb-2 text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> Volver a OTs
          </Link>
          <h1 className="page-title">Nueva Orden de Trabajo</h1>
          <p className="page-description">Crear una orden agrupada de servicios para el laboratorio</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            Información General
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">OT Número *</label>
              <input type="text" className="form-input" value={form.otNumber} onChange={e => set('otNumber', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Cliente *</label>
              <ClientSelector value={form.clientId} onChange={handleClientChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Oferta / Cotización Asociada</label>
              <select className="form-input" value={form.quoteId} onChange={e => set('quoteId', e.target.value)}>
                <option value="">Ninguna</option>
                {quotes.filter(q => !form.clientId || q.clientId === form.clientId).map(q => (
                  <option key={q.id} value={q.id}>{q.quoteNumber}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Actividad</label>
              <input type="text" className="form-input" value={form.activity} onChange={e => set('activity', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Fecha de Solicitud</label>
              <input type="date" className="form-input" value={form.requestDate} onChange={e => set('requestDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Fecha de Servicio</label>
              <input type="date" className="form-input" value={form.serviceDate} onChange={e => set('serviceDate', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Equipos a Calibrar</h2>
            <button type="button" onClick={addItem} className="btn btn-secondary btn-sm">
              <Plus size={16} /> Agregar Equipo
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {form.items.length === 0 ? (
              <div className="text-center py-6 text-muted border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                No hay equipos agregados
              </div>
            ) : (
              form.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-900/50 relative group">
                  <div className="md:col-span-4 form-group mb-0">
                    <label className="form-label text-xs">Equipo *</label>
                    <select
                      className="form-input form-input-sm"
                      value={item.equipmentId}
                      onChange={e => updateItem(index, 'equipmentId', e.target.value)}
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {equipments.filter(eq => !form.clientId || eq.clientId === form.clientId).map(eq => (
                        <option key={eq.id} value={eq.id}>[{eq.internalCode}] {eq.brand} {eq.model}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2 form-group mb-0">
                    <label className="form-label text-xs">Tipo Servicio</label>
                    <select
                      className="form-input form-input-sm"
                      value={item.serviceType}
                      onChange={e => updateItem(index, 'serviceType', e.target.value)}
                    >
                      <option value="PROPIO">Propio</option>
                      <option value="TERCERIZADO">Tercerizado</option>
                    </select>
                  </div>
                  <div className="md:col-span-3 form-group mb-0">
                    <label className="form-label text-xs">Asignado a</label>
                    <select
                      className="form-input form-input-sm"
                      value={item.assignedToId}
                      onChange={e => updateItem(index, 'assignedToId', e.target.value)}
                    >
                      <option value="">Sin asignar</option>
                      {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-12 form-group mb-0 mt-2">
                    <label className="form-label text-xs">Notas Técnicas</label>
                    <input
                      type="text"
                      className="form-input form-input-sm"
                      value={item.technicalNotes}
                      onChange={e => updateItem(index, 'technicalNotes', e.target.value)}
                      placeholder="Calibración con acreditación..."
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            Observaciones (Certificado a emitir)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Emitir a nombre de</label>
              <input type="text" className="form-input" value={form.certificateToName} onChange={e => set('certificateToName', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Dirección</label>
              <input type="text" className="form-input" value={form.certificateAddress} onChange={e => set('certificateAddress', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Contacto</label>
              <input type="text" className="form-input" value={form.certificateContact} onChange={e => set('certificateContact', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <input type="text" className="form-input" value={form.certificatePhone} onChange={e => set('certificatePhone', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Ciudad</label>
              <input type="text" className="form-input" value={form.certificateCity} onChange={e => set('certificateCity', e.target.value)} />
            </div>
          </div>
          
          <h3 className="text-md font-semibold mt-6 mb-4 text-slate-800 dark:text-white">Firmas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Solicitante (Nombre)</label>
              <input type="text" className="form-input" value={form.requesterName} onChange={e => set('requesterName', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Solicitante (Cargo)</label>
              <input type="text" className="form-input" value={form.requesterRole} onChange={e => set('requesterRole', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Autorizado por (Nombre)</label>
              <input type="text" className="form-input" value={form.authorizerName} onChange={e => set('authorizerName', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Autorizado por (Cargo)</label>
              <input type="text" className="form-input" value={form.authorizerRole} onChange={e => set('authorizerRole', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 sticky bottom-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg z-10">
          <Link href="/work-orders" className="btn btn-secondary">
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <span className="spinner w-4 h-4 border-2" /> : <FloppyDisk size={18} weight="bold" />}
            {loading ? 'Guardando...' : 'Crear Orden de Trabajo'}
          </button>
        </div>
      </form>
    </div>
  );
}
