'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Plus, MagnifyingGlass, Buildings, Phone, Envelope,
  MapPin, PencilSimple, Trash, Eye,
} from '@phosphor-icons/react';
import { clientsApi, excelApi } from '@/lib/api';
import { ImportExportActions } from '@/components/ImportExportActions';
import { Pagination } from '@/components/ui/Pagination';
import { formatDate } from '@/lib/utils/formatters';
import type { Client } from '@/lib/types';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  const fetchClients = useCallback(async () => {
    try {
      const { data, meta } = await clientsApi.getAll(page, limit, search || undefined);
      setClients(data);
      setTotal(meta.total);
      setLastPage(meta.lastPage);
    } catch {
      toast.error('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    const t = setTimeout(fetchClients, 300);
    return () => clearTimeout(t);
  }, [fetchClients]);

  const handleDeactivate = async (id: string) => {
    if (!confirm('¿Desactivar este cliente?')) return;
    setDeletingId(id);
    try {
      await clientsApi.deactivate(id);
      toast.success('Cliente desactivado');
      fetchClients();
    } catch {
      toast.error('Error al desactivar');
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = async () => {
    await excelApi.downloadExcel('/clients/export', 'clientes.xlsx');
  };

  const handleImport = async (file: File) => {
    return await excelApi.uploadExcel('/clients/import', file);
  };

  const CLIENTS_COLUMNS = [
    { name: 'NombreEmpresa', description: 'Nombre del cliente', required: true },
    { name: 'NIT', description: 'Número de identificación tributaria (Llave única)' },
    { name: 'Contacto', description: 'Nombre del contacto principal' },
    { name: 'Telefono', description: 'Teléfono de contacto' },
    { name: 'Email', description: 'Correo electrónico' },
    { name: 'Direccion', description: 'Dirección física' },
    { name: 'Ciudad', description: 'Ciudad' },
    { name: 'Estado', description: 'Activo o Inactivo' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Clientes</h1>
          <p className="page-header__subtitle">Gestión de empresas clientes del laboratorio</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <ImportExportActions
            onExport={handleExport}
            onImport={handleImport}
            onImportSuccess={fetchClients}
            entityName="Clientes"
            expectedColumns={CLIENTS_COLUMNS}
          />
          <Link href="/clients/new" className="btn btn--primary">
            <Plus size={18} weight="bold" />
            Nuevo Cliente
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar" style={{ marginBottom: 24, maxWidth: 380 }}>
        <MagnifyingGlass size={18} color="var(--color-text-muted)" />
        <input
          type="text"
          placeholder="Buscar por nombre, NIT o contacto..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div className="spinner spinner--lg" />
        </div>
      ) : clients.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Buildings size={48} className="empty-state__icon" weight="thin" />
            <p className="empty-state__title">No hay clientes</p>
            <p className="empty-state__sub">Registra el primer cliente del laboratorio</p>
            <Link href="/clients/new" className="btn btn--primary" style={{ marginTop: 12 }}>
              <Plus size={16} weight="bold" /> Nuevo Cliente
            </Link>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Empresa</th>
                <th>NIT</th>
                <th>Contacto</th>
                <th>Ciudad</th>
                <th>Estado</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {clients.map((client) => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Buildings size={16} color="var(--color-brand)" weight="duotone" />
                        <span style={{ fontWeight: 600 }}>{client.companyName}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85em' }}>
                      {client.nit || '-'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.85em', color: 'var(--color-text-muted)' }}>
                        {client.contactName && <div><Phone size={12} style={{ display: 'inline', marginRight: 4 }} /> {client.contactName}</div>}
                        {client.email && <div><Envelope size={12} style={{ display: 'inline', marginRight: 4 }} /> {client.email}</div>}
                      </div>
                    </td>
                    <td>{client.city || '-'}</td>
                    <td>
                      <span className={`badge ${client.isActive ? 'badge--green' : 'badge--gray'}`}>
                        {client.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <Link
                          href={`/clients/${client.id}`}
                          className="btn btn--ghost btn--sm"
                          style={{ padding: '5px 10px' }}
                          title="Ver detalle"
                        >
                          <Eye size={15} />
                        </Link>
                        <Link
                          href={`/clients/${client.id}?edit=true`}
                          className="btn btn--secondary btn--sm"
                          style={{ padding: '5px 10px' }}
                          title="Editar"
                        >
                          <PencilSimple size={15} />
                        </Link>
                        <button
                          className="btn btn--danger btn--sm"
                          style={{ padding: '5px 10px' }}
                          title="Desactivar"
                          onClick={() => handleDeactivate(client.id)}
                          disabled={deletingId === client.id}
                        >
                          <Trash size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          <Pagination
            page={page}
            limit={limit}
            total={total}
            lastPage={lastPage}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
}
