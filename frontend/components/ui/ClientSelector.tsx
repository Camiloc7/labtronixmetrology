'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CaretDown, Check, MagnifyingGlass, X } from '@phosphor-icons/react';
import { clientsApi } from '@/lib/api';

interface ClientSelectorProps {
  value: string;
  onChange: (value: string, client?: any) => void;
  placeholder?: string;
  allowFreeText?: boolean;
  required?: boolean;
}

export default function ClientSelector({ value, onChange, placeholder = 'Buscar cliente por nombre o NIT...', allowFreeText = false, required = false }: ClientSelectorProps) {
  const [clients, setClients] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial load
  useEffect(() => {
    fetchClients('');
  }, []);

  // Update search term when value changes externally
  useEffect(() => {
    if (isOpen) return; // Si el usuario está interactuando, no sobreescribir su búsqueda

    if (value && clients.length > 0) {
      const selected = clients.find(c => c.id === value || c.companyName === value);
      if (selected) {
        setSearchTerm(selected.companyName);
      } else if (allowFreeText) {
        setSearchTerm(value);
      }
    } else if (!value) {
      setSearchTerm('');
    }
  }, [value, clients, allowFreeText, isOpen]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (!allowFreeText && !value) {
          setSearchTerm('');
        } else if (allowFreeText && searchTerm !== value) {
          // If free text, sync it on blur
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [allowFreeText, value, searchTerm]);

  const fetchClients = async (search: string) => {
    setLoading(true);
    try {
      const res = await clientsApi.getAll(1, 50, search);
      const sortedClients = (res.data || []).sort((a: any, b: any) => a.companyName.localeCompare(b.companyName));
      setClients(sortedClients);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;
    const delayDebounceFn = setTimeout(() => {
      fetchClients(searchTerm);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, isOpen]);

  const handleSelect = (client: any) => {
    setSearchTerm(client.companyName);
    onChange(client.id, client); // En modo estricto pasamos el ID. En modo libre se espera manejar el client.
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchTerm('');
    onChange('', undefined);
    inputRef.current?.focus();
    setIsOpen(true);
  };

  return (
    <div style={{ position: 'relative' }} ref={containerRef}>
      <div 
        className="form-input" 
        style={{ display: 'flex', alignItems: 'center', padding: '0 8px', cursor: 'text', borderColor: isOpen ? 'var(--color-brand)' : undefined }}
        onClick={() => { setIsOpen(true); inputRef.current?.focus(); }}
      >
        <MagnifyingGlass size={18} color="var(--color-text-muted)" style={{ margin: '0 8px' }} />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            if (allowFreeText) {
              onChange(e.target.value);
            } else if (!e.target.value) {
              onChange('');
            }
          }}
          placeholder={placeholder}
          required={required && !value}
          style={{ border: 'none', outline: 'none', flex: 1, backgroundColor: 'transparent', padding: '10px 0', fontSize: '0.95rem' }}
        />
        {searchTerm && (
          <button type="button" onClick={handleClear} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}>
            <X size={16} color="var(--color-text-muted)" />
          </button>
        )}
        <CaretDown size={16} color="var(--color-text-muted)" style={{ margin: '0 8px', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: 4,
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--color-border)',
              maxHeight: 300,
              overflowY: 'auto',
              zIndex: 50
            }}
          >
            {loading ? (
              <div style={{ padding: 16, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Buscando...</div>
            ) : clients.length > 0 ? (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {clients.map(client => {
                  const isSelected = value === client.id || value === client.companyName;
                  return (
                    <li 
                      key={client.id}
                      onClick={() => handleSelect(client)}
                      style={{ 
                        padding: '12px 16px', 
                        cursor: 'pointer', 
                        borderBottom: '1px solid var(--color-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: isSelected ? 'rgba(23,115,234,0.05)' : 'transparent'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-alt)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isSelected ? 'rgba(23,115,234,0.05)' : 'transparent'}
                    >
                      <div>
                        <div style={{ fontWeight: isSelected ? 600 : 400, color: isSelected ? 'var(--color-brand)' : 'inherit' }}>
                          {client.companyName}
                        </div>
                        {client.nit && <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>NIT: {client.nit}</div>}
                      </div>
                      {isSelected && <Check size={18} color="var(--color-brand)" weight="bold" />}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div style={{ padding: 16, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                No se encontraron clientes.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
