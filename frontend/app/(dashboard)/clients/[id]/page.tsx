'use client';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, PencilSimple, FloppyDisk, X } from '@phosphor-icons/react';
import { clientsApi } from '@/lib/api';
import { formatDate, formatDateTime } from '@/lib/utils/formatters';
import type { Client, ClientContact } from '@/lib/types';
import ContactEditor from '@/components/clients/ContactEditor';
import { useAuth } from '@/lib/hooks/useAuth';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const canManage = user?.role === 'ADMIN' || user?.role === 'COMERCIAL';
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(searchParams.get('edit') === 'true' && canManage);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Client>>({ contacts: [] });

  useEffect(() => {
    clientsApi.getOne(id).then((data) => {
      setClient(data);
      setForm({ ...data, contacts: data.contacts || [] });
      if (searchParams.get('edit') === 'true' && !canManage) {
        setEditing(false);
      }
      setLoading(false);
    }).catch(() => {
      toast.error('Cliente no encontrado');
      router.push('/clients');
    });
  }, [id, canManage, searchParams]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // El backend valida con `forbidNonWhitelisted`: si se envía la entidad
      // completa (id, createdAt, updatedAt) responde 400. Enviamos solo los
      // campos que este formulario edita.
      const payload: Record<string, string | undefined> = {};
      const textFields = [
        'companyName',
        'nit',
        'contactName',
        'phone',
        'city',
        'address',
        'notes',
      ] as const;
      for (const field of textFields) {
        const value = form[field];
        if (value !== undefined) payload[field] = value;
      }
      // @IsEmail() rechaza la cadena vacía: si se deja en blanco, no se envía.
      if (form.email) payload.email = form.email;

      const updated = await clientsApi.update(id, payload);
      setClient(updated);
      setEditing(false);
      toast.success('Cliente actualizado');
    } catch {
      toast.error('Error al actualizar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}><div className="spinner spinner--lg" /></div>;
  if (!client) return null;

  const rows = [
    { label: 'NIT', value: client.nit },
    { label: 'Contacto', value: client.contactName },
    { label: 'Teléfono', value: client.phone },
    { label: 'Email', value: client.email },
    { label: 'Ciudad', value: client.city },
    { label: 'Dirección', value: client.address },
    { label: 'Creado', value: formatDateTime(client.createdAt) },
    { label: 'Actualizado', value: formatDateTime(client.updatedAt) },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <Link href="/clients" className="btn btn--ghost btn--sm" style={{ marginBottom: 12, display: 'inline-flex' }}>
            <ArrowLeft size={16} /> Volver a Clientes
          </Link>
          <h1 className="page-header__title">{client.companyName}</h1>
          <p className="page-header__subtitle">NIT: {client.nit || '—'} · {formatDate(client.createdAt)}</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {canManage && (
            editing ? (
              <>
                <button className="btn btn--secondary" onClick={() => setEditing(false)}>
                  <X size={16} /> Cancelar
                </button>
                <button className="btn btn--primary" onClick={handleSave} disabled={saving}>
                  {saving ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <FloppyDisk size={16} weight="bold" />}
                  Guardar
                </button>
              </>
            ) : (
              <button className="btn btn--primary" onClick={() => setEditing(true)}>
                <PencilSimple size={16} weight="bold" /> Editar
              </button>
            )
          )}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card">
        {editing ? (
          <div className="grid-2" style={{ gap: 20 }}>
            {[
              { key: 'companyName', label: 'Empresa *', placeholder: 'Nombre de la empresa' },
              { key: 'nit', label: 'NIT', placeholder: '900123456-7' },
              { key: 'contactName', label: 'Contacto', placeholder: 'Nombre del contacto' },
              { key: 'phone', label: 'Teléfono', placeholder: '3001234567' },
              { key: 'email', label: 'Email', placeholder: 'email@empresa.com', type: 'email' },
              { key: 'city', label: 'Ciudad', placeholder: 'Bogotá' },
              { key: 'address', label: 'Dirección', placeholder: 'Cra 10 # 20-30' },
            ].map((f) => (
              <div key={f.key} className="form-group" style={f.key === 'address' ? { gridColumn: 'span 2' } : {}}>
                <label className="form-label">{f.label}</label>
                <input
                  type={(f as any).type || 'text'}
                  className="form-input"
                  placeholder={f.placeholder}
                  value={(form as any)[f.key] || ''}
                  onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                />
              </div>
            ))}
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Notas</label>
              <textarea
                className="form-input"
                rows={3}
                value={form.notes || ''}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              />
            </div>
            <div style={{ gridColumn: 'span 2', marginTop: 8 }}>
              <ContactEditor value={(form.contacts as ClientContact[]) || []} onChange={(contacts) => setForm((p) => ({ ...p, contacts }))} />
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Información del cliente</h2>
              <span className={`badge ${client.isActive ? 'badge--green' : 'badge--gray'}`}>
                {client.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="grid-2">
              {rows.map((row) => row.value ? (
                <div key={row.label}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 4 }}>
                    {row.label}
                  </div>
                  <div style={{ fontSize: '0.875rem' }}>{row.value}</div>
                </div>
              ) : null)}
            </div>
            {(client.contacts?.length || 0) > 0 && (
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 10 }}>Contactos</div>
                <div style={{ display: 'grid', gap: 10 }}>
                  {client.contacts!.map((c, i) => (
                    <div key={c.id || i} style={{ border: '1px solid var(--color-border)', borderRadius: 10, padding: 12 }}>
                      <div style={{ fontWeight: 600 }}>{c.name} <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>({c.type}{c.position ? ` ? ${c.position}` : ''}{c.isPrimary ? ' ? Principal' : ''})</span></div>
                      {(c.phones?.filter(Boolean).length || 0) > 0 && <div style={{ fontSize: 13 }}>{c.phones.filter(Boolean).join(', ')}</div>}
                      {(c.emails?.filter(Boolean).length || 0) > 0 && <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{c.emails.filter(Boolean).join(', ')}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {client.notes && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 6 }}>Notas</div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>{client.notes}</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
