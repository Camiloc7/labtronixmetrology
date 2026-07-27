'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash, ArrowLeft, FloppyDisk, FileText, ListNumbers, PenNib } from '@phosphor-icons/react';
import { requisitionsApi } from '@/lib/api';
import { CreateRequisitionDto, CreateRequisitionItemDto } from '@/lib/types';
import toast from 'react-hot-toast';
import Link from 'next/link';
import ClientSelector from '@/components/ui/ClientSelector';

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
    <div className="page-container fade-in">
      <datalist id="units">
        <option value="Und" />
        <option value="kg" />
        <option value="g" />
        <option value="mg" />
        <option value="L" />
        <option value="mL" />
        <option value="°C" />
        <option value="%HR" />
        <option value="kPa" />
        <option value="psi" />
        <option value="V" />
        <option value="A" />
        <option value="Hz" />
      </datalist>

      <header className="page-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/requisitions" className="btn btn-secondary" style={{ padding: '10px', borderRadius: '50%' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '2rem' }}>
              Nueva Requisición
            </h1>
            <p className="page-description">Crea una nueva requisición de compras o servicios</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
        {/* INFO GENERAL */}
        <section className="card" style={{ padding: '2rem', borderTop: '4px solid var(--color-brand)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <FileText size={28} color="var(--color-brand)" weight="duotone" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
              Información General
            </h2>
          </div>
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
        <section className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ListNumbers size={28} color="var(--color-brand)" weight="duotone" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
                Ítems a Requerir
              </h2>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setFormData({ ...formData, items: [...formData.items, { ...EMPTY_ITEM }] })}
            >
              <Plus size={16} />
              Agregar Ítem
            </button>
          </div>

          <div className="table-wrapper" style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            <table className="table" style={{ minWidth: 600, margin: 0 }}>
              <thead style={{ background: 'var(--color-surface-2)' }}>
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
                        list="units"
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
        <section className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <PenNib size={28} color="var(--color-brand)" weight="duotone" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--color-text)' }}>
              Observaciones y Firmas
            </h2>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-md)' }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Los certificados debe salir a nombre de:</label>
              <ClientSelector
                allowFreeText
                placeholder="Ej. LABORATORIOS REMO S.A.S."
                required
                value={formData.certificateToName}
                onChange={(val, client) => {
                  const name = client ? client.companyName : val;
                  if (client && !formData.certificateAddress) {
                    setFormData({ ...formData, certificateToName: name, certificateAddress: client.address || '' });
                  } else {
                    setFormData({ ...formData, certificateToName: name });
                  }
                }}
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

        <div style={{ 
          display: 'flex', justifyContent: 'flex-end', gap: '1rem', 
          marginTop: '2rem', padding: '1.25rem 0'
        }}>
          <Link href="/requisitions" className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            Cancelar
          </Link>
          <button type="submit" className="btn btn-primary" disabled={isPending} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
            {isPending ? 'Guardando...' : (
              <>
                <FloppyDisk size={22} weight="fill" />
                Guardar Requisición
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
