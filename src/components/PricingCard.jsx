import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { PRICING, formatCurrency } from '../data/mock';

export default function PricingCard() {
  const navigate = useNavigate();
  return (
    <div className="card pricing-card">
      <p className="text-muted" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Pricing</p>
      <h3 style={{ fontSize: '36px', fontWeight: 500, margin: '8px 0', letterSpacing: '-0.02em' }}>{PRICING.feeLabel}</h3>
      <p className="text-secondary" style={{ fontSize: '14px', marginBottom: '20px' }}>
        Charged monthly. That's <strong>{formatCurrency(PRICING.example.annualFee)}/yr</strong> on a {formatCurrency(PRICING.example.balance)} balance.
      </p>
      <ul style={{ listStyle: 'none', display: 'grid', gap: '8px' }}>
        {PRICING.noFees.map((f) => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <Check size={14} color="var(--status-active)" /> {f}
          </li>
        ))}
      </ul>
      <p className="text-muted" style={{ fontSize: '12px', marginTop: '16px' }}>
        We make money from the management fee and nothing else. No payment for order flow, no kickbacks from fund providers.
      </p>
      <button className="btn-outline" style={{ marginTop: '20px', width: '100%' }} onClick={() => navigate('/faq')}>
        Read full FAQ
      </button>
    </div>
  );
}
