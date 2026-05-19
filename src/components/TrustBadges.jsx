import React from 'react';
import { ShieldCheck, Landmark, Lock } from 'lucide-react';
import { TRUST } from '../data/mock';

export default function TrustBadges({ compact = false }) {
  if (compact) {
    return (
      <div className="trust-badges-compact">
        <span className="trust-chip"><ShieldCheck size={14} /> Segregated custody</span>
        <span className="trust-chip"><Landmark size={14} /> Regulated (mock)</span>
        <span className="trust-chip"><Lock size={14} /> €100k deposit protection</span>
      </div>
    );
  }
  return (
    <div className="trust-badges">
      <div className="trust-row">
        <ShieldCheck size={18} />
        <div>
          <p style={{ fontSize: '14px', fontWeight: 500 }}>Funds held by {TRUST.custodian}</p>
          <p className="text-muted" style={{ fontSize: '12px' }}>Your assets are in your name, not on our balance sheet.</p>
        </div>
      </div>
      <div className="trust-row">
        <Landmark size={18} />
        <div>
          <p style={{ fontSize: '14px', fontWeight: 500 }}>{TRUST.regulator}</p>
          <p className="text-muted" style={{ fontSize: '12px' }}>{TRUST.broker}</p>
        </div>
      </div>
      <div className="trust-row">
        <Lock size={18} />
        <div>
          <p style={{ fontSize: '14px', fontWeight: 500 }}>{TRUST.deposit_protection}</p>
          <p className="text-muted" style={{ fontSize: '12px' }}>Investments aren't insured against market losses (no broker offers that).</p>
        </div>
      </div>
    </div>
  );
}
