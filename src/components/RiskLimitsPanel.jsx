import React, { useState } from 'react';
import { Check } from 'lucide-react';
import Modal from './Modal';

const ALL_ASSETS = ['Bonds', 'Index ETFs', 'Blue-chip stocks', 'Growth stocks', 'Crypto (limited)'];

// Per-allocation risk configuration. Edits a copy of plan.limits and returns it via onSave.
export default function RiskLimitsPanel({ plan, onClose, onSave }) {
  const [limits, setLimits] = useState(plan.limits);

  const toggleAsset = (asset) => {
    setLimits((l) => ({
      ...l,
      allowedAssets: l.allowedAssets.includes(asset)
        ? l.allowedAssets.filter((a) => a !== asset)
        : [...l.allowedAssets, asset],
    }));
  };

  return (
    <Modal
      title={`Risk limits — ${plan.name}`}
      subtitle="Hard limits the infrastructure enforces on every trade. Never exceeded."
      onClose={onClose}
      width={560}
    >
      <div>
        <label className="field-label">Maximum drawdown</label>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: '24px', fontWeight: 500 }}>{limits.maxDrawdownPct}%</span>
          <span className="text-muted" style={{ fontSize: '13px' }}>
            Auto-pause if portfolio drops more than this
          </span>
        </div>
        <input
          type="range"
          min="3"
          max="50"
          step="1"
          value={limits.maxDrawdownPct}
          onChange={(e) => setLimits({ ...limits, maxDrawdownPct: Number(e.target.value) })}
          className="slider"
        />
        <div className="slider-range-labels"><span>3%</span><span>50%</span></div>
      </div>

      <div style={{ marginTop: '28px' }}>
        <label className="field-label">Max single position size</label>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: '24px', fontWeight: 500 }}>{limits.maxSinglePositionPct}%</span>
          <span className="text-muted" style={{ fontSize: '13px' }}>
            No single asset above this share of the plan
          </span>
        </div>
        <input
          type="range"
          min="5"
          max="100"
          step="5"
          value={limits.maxSinglePositionPct}
          onChange={(e) => setLimits({ ...limits, maxSinglePositionPct: Number(e.target.value) })}
          className="slider"
        />
        <div className="slider-range-labels"><span>5%</span><span>100%</span></div>
      </div>

      <div style={{ marginTop: '28px' }}>
        <label className="field-label">Allowed asset categories</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
          {ALL_ASSETS.map((a) => {
            const on = limits.allowedAssets.includes(a);
            return (
              <button
                key={a}
                onClick={() => toggleAsset(a)}
                className={`chip ${on ? 'chip-on' : ''}`}
              >
                {on && <Check size={14} />} {a}
              </button>
            );
          })}
        </div>
      </div>

      <footer className="modal-footer">
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
        <button
          className="btn-primary"
          onClick={() => { onSave(limits); onClose(); }}
        >
          Save limits
        </button>
      </footer>
    </Modal>
  );
}
