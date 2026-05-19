import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, subtitle, onClose, children, width = 520 }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="modal-panel" style={{ maxWidth: width }} role="dialog" aria-modal="true">
        <header className="modal-header">
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 500 }}>{title}</h3>
            {subtitle && <p className="text-secondary" style={{ fontSize: '14px', marginTop: '4px' }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} className="modal-close" aria-label="Close">
            <X size={18} />
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
