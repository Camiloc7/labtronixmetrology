import React, { useEffect } from 'react';
import { X } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  disableClose?: boolean;
}

export function Modal({ isOpen, onClose, title, children, disableClose = false }: ModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !disableClose) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="modal-overlay" 
          onClick={handleOverlayClick}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px'
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            className="modal"
            style={{
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-lg)',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div 
              className="modal__header"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '20px 24px',
                borderBottom: '1px solid var(--color-border)'
              }}
            >
              <h2 className="modal__title" style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                {title}
              </h2>
              <button 
                className="modal__close" 
                onClick={() => !disableClose && onClose()}
                disabled={disableClose}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: disableClose ? 'not-allowed' : 'pointer',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px',
                  borderRadius: 'var(--radius-sm)'
                }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div 
              className="modal__body"
              style={{
                padding: '24px',
                overflowY: 'auto'
              }}
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
