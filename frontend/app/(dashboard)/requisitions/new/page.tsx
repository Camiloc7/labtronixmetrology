'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash, ArrowLeft, FloppyDisk } from '@phosphor-icons/react';
import { requisitionsApi } from '@/lib/api';
import { CreateRequisitionDto, CreateRequisitionItemDto } from '@/lib/types';
import toast from 'react-hot-toast';
import Link from 'next/link';

const EMPTY_ITEM: CreateRequisitionItemDto = {
  description: '',
  quantity: 1,
  unitOfMeasure: 'Und',
};

export default function NewRequisitionPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const [formData, setFormData] = useState<CreateRequisitionDto>({
    consecutiveNumber: '',
    activity: 'Calibración de Equipos',
    date: new Date().toISOString().split('T')[0],
    certificateToName: '',
    certificateAddress: '',
    quoteNumber: '',
    requesterName: '',
    requesterRole: '',
    authorizerName: '',
    authorizerRole: '',
    items: [{ ...EMPTY_ITEM }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.consecutiveNumber.trim()) {
      toast.error('El número de consecutivo es obligatorio');
      return;
    }
    if (formData.items.length === 0) {
      toast.error('Debe agregar al menos un ítem');
      return;
    }
    setIsPending(true);
    try {
      const data = await requisitionsApi.create(formData);
      toast.success('Requisición creada exitosamente');
      router.push(`/requisitions/${data.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear la requisición');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="page-container fade-in" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <header className="page-header" style={{ marginBottom: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <Link href="/requisitions" className="btn btn-secondary btn-sm" style={{ padding: 8 }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="page-title">Nueva Requisición</h1>
            <p className="page-description">Crea una nueva requisición de compras o servicios</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
        {/* INFO GENERAL */}
        <section>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--spacing-md)', color: 'var(--color-text)' }}>
            Información General
          </h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)' }}>
            <div className="form-group">
              <label className="form-label">Consecutivo</label>
              <input
                type="text"
                className="input"
                required
                value={formData.consecutiveNumber}
                onChange={(e) => setFormData({ ...formData, consecutiveNumber: e.target.value })}
                placeholder="Ej. 151-26"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fecha</label>
              <input
                type="date"
                className="input"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Actividad</label>
              <input
                type="text"
                className="input"
                required
                value={formData.activity}
                onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* ITEMS */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text)' }}>Ítems</h2>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setFormData({ ...formData, items: [...formData.items, { ...EMPTY_ITEM }] })}
            >
              <Plus size={16} />
              Agregar Ítem
            </button>
          </div>

          <div className="table-wrapper" style={{ border: 'none', overflowX: 'auto' }}>
            <table className="table" style={{ minWidth: 600 }}>
              <thead>
                <tr>
                  <th style={{ width: 80 }}>Cantidad</th>
                  <th style={{ width: 100 }}>U. Medida</th>
                  <th>Descripción (Características técnicas)</th>
                  <th style={{ width: 60 }}></th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="number"
                        className="input"
                        min="1"
                        required
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[index].quantity = Number(e.target.value);
                          setFormData({ ...formData, items: newItems });
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input"
                        required
                        value={item.unitOfMeasure}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[index].unitOfMeasure = e.target.value;
                          setFormData({ ...formData, items: newItems });
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input"
                        required
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[index].description = e.target.value;
                          setFormData({ ...formData, items: newItems });
                        }}
                        placeholder="Ej. Balanza, Marca: RADWAG..."
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm text-error"
                        onClick={() => {
                          const newItems = formData.items.filter((_, i) => i !== index);
                          setFormData({ ...formData, items: newItems });
                        }}
                        disabled={formData.items.length === 1}
                      >
                        <Trash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* OBSERVACIONES Y FIRMAS */}
        <section>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--spacing-md)', color: 'var(--color-text)' }}>
            Observaciones y Firmas
          </h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Los certificados debe salir a nombre de:</label>
              <input
                type="text"
                className="input"
                required
                value={formData.certificateToName}
                onChange={(e) => setFormData({ ...formData, certificateToName: e.target.value })}
                placeholder="Ej. LABORATORIOS REMO S.A.S."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Dirección</label>
              <input
                type="text"
                className="input"
                required
                value={formData.certificateAddress}
                onChange={(e) => setFormData({ ...formData, certificateAddress: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Nº de Cotización Asociada</label>
              <input
                type="text"
                className="input"
                value={formData.quoteNumber}
                onChange={(e) => setFormData({ ...formData, quoteNumber: e.target.value })}
                placeholder="Opcional"
              />
            </div>
          </div>
          
          <div className="grid mt-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)' }}>
            <div className="form-group">
              <label className="form-label">Nombre del Solicitante</label>
              <input
                type="text"
                className="input"
                required
                value={formData.requesterName}
                onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Cargo del Solicitante</label>
              <input
                type="text"
                className="input"
                required
                value={formData.requesterRole}
                onChange={(e) => setFormData({ ...formData, requesterRole: e.target.value })}
              />
            </div>
          </div>

          <div className="grid mt-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)' }}>
            <div className="form-group">
              <label className="form-label">Nombre de quien Autoriza</label>
              <input
                type="text"
                className="input"
                value={formData.authorizerName}
                onChange={(e) => setFormData({ ...formData, authorizerName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Cargo de quien Autoriza</label>
              <input
                type="text"
                className="input"
                value={formData.authorizerRole}
                onChange={(e) => setFormData({ ...formData, authorizerRole: e.target.value })}
              />
            </div>
          </div>
        </section>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
          <Link href="/requisitions" className="btn btn-secondary">
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary" disabled={isPending}>
            {isPending ? 'Guardando...' : (
              <>
                <FloppyDisk size={20} />
                Guardar Requisición
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
