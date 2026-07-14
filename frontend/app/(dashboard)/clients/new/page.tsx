'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, FloppyDisk } from '@phosphor-icons/react';
import { clientsApi } from '@/lib/api';
import type { CreateClientDto } from '@/lib/types';

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CreateClientDto>({
    companyName: '',
    nit: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: '',
  });

  const set = (field: keyof CreateClientDto, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName.trim()) {
      toast.error('El nombre de la empresa es requerido');
      return;
    }
    setLoading(true);
    try {
      await clientsApi.create(form);
      toast.success('Cliente creado correctamente');
      router.push('/clients');
    } catch (err: any) {
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Error al crear cliente');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { id: 'companyName', label: 'Nombre de la empresa *', placeholder: 'Industrias ABC S.A.S', required: true },
    { id: 'nit', label: 'NIT', placeholder: '900123456-7' },
    { id: 'contactName', label: 'Nombre de contacto', placeholder: 'Carlos García' },
    { id: 'phone', label: 'Teléfono', placeholder: '3001234567' },
    { id: 'email', label: 'Correo electrónico', placeholder: 'contacto@empresa.com', type: 'email' },
    { id: 'city', label: 'Ciudad', placeholder: 'Bogotá' },
    { id: 'address', label: 'Dirección', placeholder: 'Cra 10 # 20-30' },
  ] as const;

  return (
    <div>
      <div className="page-header">
        <div>
          <Link href="/clients" className="btn btn--ghost btn--sm" style={{ marginBottom: 12, display: 'inline-flex' }}>
            <ArrowLeft size={16} /> Volver a Clientes
          </Link>
          <h1 className="page-header__title">Nuevo Cliente</h1>
          <p className="page-header__subtitle">Registrar una nueva empresa cliente en el sistema</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
        style={{ maxWidth: 700 }}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            {fields.map((field) => (
              <div key={field.id} className="form-group" style={field.id === 'address' ? { gridColumn: 'span 2' } : {}}>
                <label className="form-label">{field.label}</label>
                <input
                  id={field.id}
                  type={(field as any).type || 'text'}
                  className="form-input"
                  placeholder={field.placeholder}
                  value={(form as any)[field.id]}
                  onChange={(e) => set(field.id as keyof CreateClientDto, e.target.value)}
                  required={(field as any).required}
                />
              </div>
            ))}

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Notas internas</label>
              <textarea
                className="form-input"
                placeholder="Información adicional sobre el cliente..."
                rows={3}
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
            <Link href="/clients" className="btn btn--secondary">Cancelar</Link>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <FloppyDisk size={18} weight="bold" />}
              {loading ? 'Guardando...' : 'Guardar Cliente'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
