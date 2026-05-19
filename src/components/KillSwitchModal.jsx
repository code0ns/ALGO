import React, { useState } from 'react';
import { AlertOctagon, ShieldOff } from 'lucide-react';
import Modal from './Modal';

export default function KillSwitchModal({ onClose, onConfirm }) {
  const [text, setText] = useState('');
  return (
    <Modal title="Pause everything" subtitle="The kill switch halts all trading and contributions across every plan." onClose={onClose} width={480}>
      <div className="kill-banner">
        <AlertOctagon size={20} />
        <div>
          <p style={{ fontSize: '14px', fontWeight: 500 }}>This will:</p>
          <ul style={{ marginLeft: '18px', marginTop: '6px', fontSize: '13px', lineHeight: 1.6 }}>
            <li>Pause monthly contributions on all plans</li>
            <li>Halt automated rebalancing and any pending trades</li>
            <li>Keep your existing holdings — no positions are sold</li>
            <li>Send you a confirmation email</li>
          </ul>
        </div>
      </div>

      <p className="text-secondary" style={{ fontSize: '13px', marginTop: '20px' }}>
        Type <strong>PAUSE</strong> to confirm:
      </p>
      <input className="input" style={{ marginTop: '8px' }} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type here" />

      <footer className="modal-footer">
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
        <button
          className="btn-danger"
          disabled={text !== 'PAUSE'}
          onClick={() => { onConfirm(); onClose(); }}
        >
          <ShieldOff size={16} /> Pause everything
        </button>
      </footer>
    </Modal>
  );
}
