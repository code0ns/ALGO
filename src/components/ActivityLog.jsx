import React from 'react';
import { ShoppingCart, ShieldCheck, Repeat, ArrowDownToLine, FileText } from 'lucide-react';
import { MOCK_ACTIVITY } from '../data/mock';

const ICONS = {
  buy: ShoppingCart,
  check: ShieldCheck,
  rebalance: Repeat,
  deposit: ArrowDownToLine,
  report: FileText,
};

// "What the autopilot did" — the trust-building feed.
export default function ActivityLog() {
  return (
    <div className="card" style={{ padding: '8px 0' }}>
      {MOCK_ACTIVITY.map((entry, i) => {
        const Icon = ICONS[entry.type] || ShieldCheck;
        return (
          <div
            key={entry.id}
            className="activity-row"
            style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border-color)' }}
          >
            <div className="activity-icon">
              <Icon size={16} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '14px', fontWeight: 500 }}>{entry.text}</p>
              <p className="text-muted" style={{ fontSize: '12px', marginTop: '2px' }}>
                {entry.ts} · {entry.meta}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
