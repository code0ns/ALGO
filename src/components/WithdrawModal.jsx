import React, { useState } from 'react';
import { Check, Building2, Info } from 'lucide-react';
import Modal from './Modal';
import { formatCurrency } from '../data/mock';

export default function WithdrawModal({ availableBalance, onClose, onConfirm }) {
  const [stage, setStage] = useState('amount');
  const [amount, setAmount] = useState(Math.min(500, Math.floor(availableBalance / 2)));

  const valid = amount > 0 && amount <= availableBalance;

  return (
    <Modal title="Withdraw funds" subtitle="No fees — typically arrives in 2–3 business days." onClose={onClose} width={520}>
      {stage === 'amount' && (
        <div>
          <label className="field-label">Amount</label>
          <div className="amount-display" style={{ fontSize: '36px' }}>{formatCurrency(amount)}</div>
          <input type="range" min="0" max={availableBalance} step="50" value={amount}
            onChange={(e) => setAmount(Number(e.target.value))} className="slider" />
          <div className="slider-range-labels">
            <span>$0</span>
            <span>{formatCurrency(availableBalance)} available</span>
          </div>

          <div className="info-box" style={{ marginTop: '20px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
            <Info size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
            <span>
              Selling assets to fund withdrawal may incur a small bid/ask spread cost.
              Tax may be owed on realised gains — your annual statement will reflect this.
            </span>
          </div>

          <div className="card" style={{ padding: '16px', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="bank-tile-icon" style={{ backgroundColor: '#117ACA', width: 36, height: 36 }}>
              <Building2 size={16} color="#fff" />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 500 }}>Chase ••• 4421</p>
              <p className="text-muted" style={{ fontSize: '12px' }}>Linked bank account</p>
            </div>
          </div>

          <footer className="modal-footer">
            <button className="btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn-primary" disabled={!valid} onClick={() => setStage('confirm')}>Continue</button>
          </footer>
        </div>
      )}

      {stage === 'confirm' && (
        <div>
          <p className="text-secondary" style={{ fontSize: '14px', marginBottom: '16px' }}>You're about to withdraw:</p>
          <div className="amount-display" style={{ fontSize: '36px', color: 'var(--accent-primary)' }}>{formatCurrency(amount)}</div>
          <p className="text-secondary" style={{ fontSize: '14px' }}>
            To Chase ••• 4421 — estimated arrival <strong>{new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong>
          </p>

          <div className="info-box" style={{ marginTop: '20px' }}>
            After this withdrawal, your remaining portfolio value will be approximately <strong>{formatCurrency(availableBalance - amount)}</strong>.
            Your monthly contribution plans continue as normal.
          </div>

          <footer className="modal-footer">
            <button className="btn-ghost" onClick={() => setStage('amount')}>Back</button>
            <button className="btn-primary" onClick={() => { onConfirm(amount); setStage('done'); }}>
              <Check size={16} /> Confirm withdrawal
            </button>
          </footer>
        </div>
      )}

      {stage === 'done' && (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div className="success-circle" style={{ margin: '0 auto 16px' }}><Check size={20} /></div>
          <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Withdrawal sent</h3>
          <p className="text-secondary" style={{ fontSize: '14px', maxWidth: '380px', margin: '0 auto' }}>
            {formatCurrency(amount)} is on its way to Chase ••• 4421. You'll get an email confirmation, and another when funds arrive.
          </p>
          <footer className="modal-footer" style={{ justifyContent: 'flex-end' }}>
            <button className="btn-primary" onClick={onClose}>Done</button>
          </footer>
        </div>
      )}
    </Modal>
  );
}
