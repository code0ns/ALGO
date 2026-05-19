import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, Lock, Building2, Loader2 } from 'lucide-react';
import { BANKS, formatCurrency } from '../data/mock';

export default function Funding() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialAmount = location.state?.amount || 250;

  const [stage, setStage] = useState('pick');
  const [bankId, setBankId] = useState(null);
  const [amount, setAmount] = useState(initialAmount);

  const bank = BANKS.find((b) => b.id === bankId);

  const submitAuth = () => {
    setStage('connecting');
    setTimeout(() => setStage('done'), 1100);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <header style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '16px 24px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/dashboard')} style={{ color: 'var(--text-secondary)' }}>
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: '20px', fontWeight: 500 }}>Link your bank</h1>
        </div>
      </header>

      <main className="container" style={{ padding: '40px 24px', maxWidth: '600px' }}>
        {stage === 'pick' && (
          <>
            <h2 style={{ fontSize: '28px', marginBottom: '12px' }}>Choose your bank</h2>
            <p className="text-secondary" style={{ fontSize: '15px', marginBottom: '8px' }}>
              We use a secure bank-link partner. Your credentials are never stored on our servers.
            </p>
            <p className="text-muted" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
              <Lock size={12} /> Bank-grade encryption — read-only access
            </p>
            <div className="bank-grid">
              {BANKS.map((b) => (
                <button key={b.id} onClick={() => { setBankId(b.id); setStage('auth'); }} className="bank-tile">
                  <div className="bank-tile-icon" style={{ backgroundColor: b.color }}>
                    <Building2 size={18} color="#fff" />
                  </div>
                  <span>{b.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {stage === 'auth' && bank && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div className="bank-tile-icon" style={{ backgroundColor: bank.color }}>
                <Building2 size={18} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: '16px', fontWeight: 500 }}>Sign in to {bank.name}</p>
                <p className="text-muted" style={{ fontSize: '12px' }}>Mock auth screen — nothing is sent anywhere</p>
              </div>
            </div>
            <label className="field-label">Username</label>
            <input className="input" placeholder="••••••••" />
            <label className="field-label" style={{ marginTop: '12px' }}>Password</label>
            <input className="input" type="password" placeholder="••••••••" />
            <p className="text-muted" style={{ fontSize: '12px', marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={12} /> Read-only access. We can verify the account and create transfers — never spend funds without your authorisation.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
              <button className="btn-ghost" onClick={() => setStage('pick')}>Cancel</button>
              <button className="btn-primary" onClick={submitAuth}>Connect</button>
            </div>
          </div>
        )}

        {stage === 'connecting' && (
          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <Loader2 size={32} className="spinner" style={{ color: 'var(--accent-primary)' }} />
            <p style={{ marginTop: '16px', fontWeight: 500 }}>Connecting to {bank?.name}...</p>
            <p className="text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>This usually takes a few seconds.</p>
          </div>
        )}

        {stage === 'done' && bank && (
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div className="success-circle"><Check size={20} /></div>
              <div>
                <p style={{ fontSize: '18px', fontWeight: 500 }}>{bank.name} linked</p>
                <p className="text-muted" style={{ fontSize: '13px' }}>Account ending ••• 4421</p>
              </div>
            </div>

            <label className="field-label">First deposit</label>
            <div style={{ fontSize: '28px', fontWeight: 500, marginBottom: '4px' }}>{formatCurrency(amount)}</div>
            <input type="range" min="0" max="5000" step="50" value={amount}
              onChange={(e) => setAmount(Number(e.target.value))} className="slider" />
            <div className="slider-range-labels"><span>$0 (skip)</span><span>$5,000</span></div>

            <p className="text-muted" style={{ fontSize: '12px', marginTop: '12px' }}>
              {amount === 0
                ? 'No initial deposit. Your monthly contributions will start on the 1st of next month.'
                : `Funds typically arrive within 1–2 business days. After that, your monthly contribution begins on the 1st.`}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
              <button className="btn-ghost" onClick={() => navigate('/dashboard')}>Skip deposit</button>
              <button className="btn-primary" onClick={() => navigate('/dashboard', { state: { funded: true, deposit: amount } })}>
                <Check size={16} /> Confirm
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
