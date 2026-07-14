'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, PencilSimple, Trash, UserCircle, Check, X } from '@phosphor-icons/react';
import { usersApi } from '@/lib/api';
import { formatDate, getInitials, ROLE_LABELS } from '@/lib/utils/formatters';
import type { User, CreateUserDto, UserRole } from '@/lib/types';

const ROLES: UserRole[] = ['ADMIN', 'COMERCIAL', 'TECNICO'];
const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'badge--red',
  COMERCIAL: 'badge--blue',
  TECNICO: 'badge--purple',
};

const EMPTY_FORM: CreateUserDto = { name: '', email: '', password: '', role: 'COMERCIAL' };

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<CreateUserDto>({ ...EMPTY_FORM });
  const [submitting, setSubmitting] = useState(false);

  const fetchUsers = () => {
    usersApi.getAll().then(setUsers).catch(() => toast.error('Error al cargar usuarios')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => { setForm({ ...EMPTY_FORM }); setEditingUser(null); setShowForm(true); };
  const openEdit = (user: User) => {
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
    setEditingUser(user);
    setShowForm(true);
  };
  const closeForm = () => { setShowForm(false); setEditingUser(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingUser) {
        const payload: any = { name: form.name, email: form.email, role: form.role };
        if (form.password) payload.password = form.password;
        await usersApi.update(editingUser.id, payload);
        toast.success('Usuario actualizado');
      } else {
        await usersApi.create(form);
        toast.success('Usuario creado');
      }
      closeForm();
      fetchUsers();
    } catch (err: any) {
      const msg = err.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg.join(', ') : msg || 'Error');
    } finally { setSubmitting(false); }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm('¿Desactivar este usuario?')) return;
    try {
      await usersApi.deactivate(id);
      toast.success('Usuario desactivado');
      fetchUsers();
    } catch { toast.error('Error al desactivar'); }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Gestión de Usuarios</h1>
          <p className="page-header__subtitle">Administrar cuentas y roles del sistema</p>
        </div>
        <button className="btn btn--primary" onClick={openCreate}>
          <Plus size={18} weight="bold" /> Nuevo Usuario
        </button>
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={(e) => { if (e.target === e.currentTarget) closeForm(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="modal"
            >
              <div className="modal__header">
                <h2 className="modal__title">{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                <button className="modal__close" onClick={closeForm}><X size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Nombre completo *</label>
                  <input type="text" className="form-input" placeholder="Juan Pérez" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Correo electrónico *</label>
                  <input type="email" className="form-input" placeholder="usuario@labtronix.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">{editingUser ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}</label>
                  <input type="password" className="form-input" placeholder="Mínimo 8 caracteres" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required={!editingUser} minLength={editingUser ? 0 : 8} />
                </div>
                <div className="form-group">
                  <label className="form-label">Rol *</label>
                  <select className="form-input" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as UserRole }))}>
                    {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                  <button type="button" className="btn btn--secondary" onClick={closeForm}>Cancelar</button>
                  <button type="submit" className="btn btn--primary" disabled={submitting}>
                    {submitting ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : <Check size={16} weight="bold" />}
                    {editingUser ? 'Actualizar' : 'Crear Usuario'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner spinner--lg" /></div>
      ) : (
        <div className="grid-3">
          <AnimatePresence>
            {users.map((user, i) => (
              <motion.div key={user.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div className="card card--hoverable">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      background: 'var(--color-brand)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: 'white',
                      flexShrink: 0,
                    }}>
                      {getInitials(user.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <span className={`badge ${ROLE_COLORS[user.role]}`}>{ROLE_LABELS[user.role]}</span>
                      <span className={`badge ${user.isActive ? 'badge--green' : 'badge--gray'}`}>{user.isActive ? 'Activo' : 'Inactivo'}</span>
                    </div>
                  </div>

                  <div className="divider" style={{ margin: '12px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-subtle)' }}>{formatDate(user.createdAt)}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn--secondary btn--sm" onClick={() => openEdit(user)} style={{ padding: '5px 10px' }}>
                        <PencilSimple size={14} />
                      </button>
                      {user.isActive && (
                        <button className="btn btn--danger btn--sm" onClick={() => handleDeactivate(user.id)} style={{ padding: '5px 10px' }}>
                          <Trash size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
