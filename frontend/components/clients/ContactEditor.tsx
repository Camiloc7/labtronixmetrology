 'use client';
import { Plus, Trash } from '@phosphor-icons/react';
import type { ClientContact, ClientContactType } from '@/lib/types';

const TYPES: { value: ClientContactType; label: string }[] = [
  { value: 'TECNICO', label: 'T?cnico' },
  { value: 'COMPRAS', label: 'Compras' },
  { value: 'GENERAL', label: 'General' },
  { value: 'OTRO', label: 'Otro' },
];

function uid() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }

export function emptyContact(type: ClientContactType = 'TECNICO'): ClientContact {
  return { id: uid(), type, name: '', position: '', phones: [''], emails: [''], isPrimary: false };
}

export default function ContactEditor({ value, onChange }: { value: ClientContact[]; onChange: (v: ClientContact[]) => void }) {
  const contacts = value || [];
  const update = (i: number, patch: Partial<ClientContact>) => onChange(contacts.map((c, idx) => idx === i ? { ...c, ...patch } : c));
  const remove = (i: number) => onChange(contacts.filter((_, idx) => idx !== i));
  const add = (type: ClientContactType) => onChange([...contacts, emptyContact(type)]);

  const updateArr = (i: number, key: 'phones' | 'emails', arrIdx: number, val: string) => {
    const arr = [...(contacts[i][key] || [])]; arr[arrIdx] = val; update(i, { [key]: arr } as any);
  };
  const addArr = (i: number, key: 'phones' | 'emails') => update(i, { [key]: [...(contacts[i][key] || []), ''] } as any);
  const removeArr = (i: number, key: 'phones' | 'emails', arrIdx: number) => {
    const arr = (contacts[i][key] || []).filter((_, j) => j !== arrIdx); update(i, { [key]: arr.length ? arr : [''] } as any);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontWeight: 700 }}>Contactos</div>
          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Agrega contactos t?cnicos, de compras u otros. Cada persona puede tener cargo y varios tel?fonos/correos.</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" className="btn btn--secondary btn--sm" onClick={() => add('TECNICO')}><Plus size={14} /> T?cnico</button>
          <button type="button" className="btn btn--secondary btn--sm" onClick={() => add('COMPRAS')}><Plus size={14} /> Compras</button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => add('OTRO')}><Plus size={14} /> Otro</button>
        </div>
      </div>
      {contacts.length === 0 && <div style={{ fontSize: 13, color: 'var(--color-text-muted)', padding: 12, border: '1px dashed var(--color-border)', borderRadius: 10 }}>No hay contactos registrados.</div>}
      {contacts.map((c, i) => (
        <div key={c.id || i} style={{ border: '1px solid var(--color-border)', borderRadius: 12, padding: 14, display: 'grid', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select className="form-input" value={c.type} onChange={(e) => update(i, { type: e.target.value as ClientContactType })} style={{ width: 140 }}>
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <label style={{ fontSize: 12, display: 'flex', gap: 6, alignItems: 'center' }}><input type="checkbox" checked={!!c.isPrimary} onChange={(e) => update(i, { isPrimary: e.target.checked })} /> Principal</label>
            </div>
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => remove(i)}><Trash size={14} /> Quitar</button>
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group"><label className="form-label">Nombre</label><input className="form-input" value={c.name || ''} onChange={(e) => update(i, { name: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Cargo</label><input className="form-input" value={c.position || ''} onChange={(e) => update(i, { position: e.target.value })} /></div>
          </div>
          <div className="grid-2" style={{ gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Tel?fonos</label>
              {(c.phones?.length ? c.phones : ['']).map((ph, pi) => (
                <div key={pi} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                  <input className="form-input" value={ph} onChange={(e) => updateArr(i, 'phones', pi, e.target.value)} placeholder="3001234567" />
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => removeArr(i, 'phones', pi)}><Trash size={14} /></button>
                </div>
              ))}
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => addArr(i, 'phones')}><Plus size={14} /> Tel?fono</button>
            </div>
            <div className="form-group">
              <label className="form-label">Correos</label>
              {(c.emails?.length ? c.emails : ['']).map((em, ei) => (
                <div key={ei} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                  <input className="form-input" value={em} onChange={(e) => updateArr(i, 'emails', ei, e.target.value)} placeholder="correo@empresa.com" />
                  <button type="button" className="btn btn--ghost btn--sm" onClick={() => removeArr(i, 'emails', ei)}><Trash size={14} /></button>
                </div>
              ))}
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => addArr(i, 'emails')}><Plus size={14} /> Correo</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
