'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, MagnifyingGlass, Wrench, Tag, Hash } from '@phosphor-icons/react';
import { equipmentApi } from '@/lib/api';
import { formatDate, formatDateTime } from '@/lib/utils/formatters';
import type { Equipment } from '@/lib/types';

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const data = await equipmentApi.getAll(search || undefined);
      setEquipment(data);
    } catch { toast.error('Error al cargar equipos'); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchData, 300);
    return () => clearTimeout(t);
  }, [fetchData]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">Equipos</h1>
          <p className="page-header__subtitle">Registro de equipos recibidos para calibración</p>
        </div>
        <Link href="/equipment/new" className="btn btn--primary">
          <Plus size={18} weight="bold" /> Registrar Equipo
        </Link>
      </div>

      <div className="search-bar" style={{ marginBottom: 24, maxWidth: 380 }}>
        <MagnifyingGlass size={18} color="var(--color-text-muted)" />
        <input
          type="text"
          placeholder="Buscar por marca, modelo, código..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner spinner--lg" /></div>
      ) : equipment.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Wrench size={48} weight="thin" className="empty-state__icon" />
            <p className="empty-state__title">Sin equipos registrados</p>
            <p className="empty-state__sub">Registra el primer equipo recibido en el laboratorio</p>
            <Link href="/equipment/new" className="btn btn--primary" style={{ marginTop: 12 }}>
              <Plus size={16} weight="bold" /> Registrar Equipo
            </Link>
          </div>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Cliente</th>
                <th>Marca / Modelo</th>
                <th>N° Serie</th>
                <th>Ubicación</th>
                <th>Recibido</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {equipment.map((eq, i) => (
                  <motion.tr
                    key={eq.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-brand-light)', fontWeight: 600 }}>
                        {eq.internalCode}
                      </span>
                    </td>
                    <td style={{ fontWeight: 500 }}>{eq.client?.companyName}</td>
                    <td>
                      <div>{eq.brand || '—'}</div>
                      {eq.model && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{eq.model}</div>}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{eq.serialNumber || '—'}</td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>{eq.location || '—'}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{formatDate(eq.receivedAt)}</td>
                    <td>
                      <Link href={`/equipment/${eq.id}`} className="btn btn--ghost btn--sm">Ver</Link>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
