import React from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  lastPage: number;
  onPageChange: (newPage: number) => void;
  onLimitChange?: (newLimit: number) => void;
}

export function Pagination({ page, limit, total, lastPage, onPageChange, onLimitChange }: PaginationProps) {
  if (total === 0) return null;

  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (lastPage <= 5) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', lastPage);
      } else if (page >= lastPage - 2) {
        pages.push(1, '...', lastPage - 3, lastPage - 2, lastPage - 1, lastPage);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', lastPage);
      }
    }
    return pages;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderTop: '1px solid var(--border-light)' }}>
      <div style={{ fontSize: 14, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span>
          Mostrando <strong>{startItem}</strong> a <strong>{endItem}</strong> de <strong>{total}</strong> resultados
        </span>
        {onLimitChange && (
          <select 
            value={limit} 
            onChange={(e) => onLimitChange(Number(e.target.value))}
            style={{ 
              padding: '4px 8px', 
              borderRadius: '6px', 
              border: '1px solid var(--border-light)',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--color-text-primary)',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {[5, 10, 20, 50, 100].map((opt) => (
              <option key={opt} value={opt}>{opt} por página</option>
            ))}
          </select>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className="btn btn--outline"
          style={{ padding: '6px 10px' }}
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <CaretLeft size={16} />
        </button>

        {getPageNumbers().map((p, i) => (
          typeof p === 'string' ? (
            <span key={`dots-${i}`} style={{ color: 'var(--color-text-muted)' }}>{p}</span>
          ) : (
            <button
              key={p}
              className={`btn ${p === page ? 'btn--primary' : 'btn--outline'}`}
              style={{ padding: '6px 12px' }}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        ))}

        <button
          className="btn btn--outline"
          style={{ padding: '6px 10px' }}
          disabled={page === lastPage}
          onClick={() => onPageChange(page + 1)}
        >
          <CaretRight size={16} />
        </button>
      </div>
    </div>
  );
}
