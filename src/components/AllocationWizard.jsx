import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { ArrowRight, Check } from 'lucide-react';
import Modal from './Modal';
import { RISK_PRESETS, projectGrowth, formatCurrency } from '../data/mock';

export default function AllocationWizard({ onClose, onCreate }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [allocation, setAllocation] = useState(300);
  const [risk, setRisk] = useState('Medium');

  const projection = useMemo(
    () => projectGrowth({ monthlyContribution: allocation, riskKey: risk, years: 10 }),
    [allocation, risk]
  );
  const projected10y = projection[projection.length - 1].value;
  const totalContributions = allocation * 12 * 10;

  const canNext = step === 1 ? name.trim().length >= 2 : true;

  return (
    <Modal title="New allocation" subtitle={`Step ${step} of 3`} onClose={onClose} width={560}>
      <div className="wizard-progress">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`wizard-progress-step ${s <= step ? 'active' : ''}`} />
        ))}
      </div>

      {step === 1 && (
        <div>
          <label className="field-label">Give this allocation a name</label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. House deposit fund"
            className="input"
          />
          <p className="text-muted" style={{ fontSize: '13px', marginTop: '8px' }}>
            You'll see this name on your dashboard. You can change it later.
          </p>
        </div>
      )}

      {step === 2 && (
        <div>
          <label className="field-label">Monthly contribution</label>
          <div className="amount-display">{formatCurrency(allocation)}</div>
          <input
            type="range"
            min="50"
            max="2000"
            step="50"
            value={allocation}
            onChange={(e) => setAllocation(Number(e.target.value))}
            className="slider"
          />
          <div className="slider-range-labels">
            <span>$50</span>
            <span>$2,000</span>
          </div>

          <label className="field-label" style={{ marginTop: '32px' }}>Risk profile</label>
          <div className="risk-options">
            {Object.entries(RISK_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => setRisk(key)}
                className={`risk-option ${risk === key ? 'selected' : ''}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 500 }}>{preset.label}</span>
                  <span className="text-muted" style={{ fontSize: '13px' }}>
                    ~{Math.round(preset.expectedAnnualReturn * 100)}%/yr
                  </span>
                </div>
                <p className="text-secondary" style={{ fontSize: '13px', marginTop: '6px' }}>
                  {preset.blurb}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="text-secondary" style={{ fontSize: '14px', marginBottom: '16px' }}>
            If you contribute <strong>{formatCurrency(allocation)}/month</strong> at <strong>{risk}</strong> risk for 10 years:
          </p>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
            <div>
              <p className="text-muted" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>You contribute</p>
              <p style={{ fontSize: '22px', fontWeight: 500 }}>{formatCurrency(totalContributions)}</p>
            </div>
            <div>
              <p className="text-muted" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Projected value</p>
              <p style={{ fontSize: '22px', fontWeight: 500, color: 'var(--status-active)' }}>{formatCurrency(projected10y)}</p>
            </div>
          </div>

          <div style={{ height: '180px', marginBottom: '16px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projection} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--status-active)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--status-active)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '12px' }}
                  formatter={(v) => formatCurrency(v)}
                />
                <Area type="monotone" dataKey="value" stroke="var(--status-active)" strokeWidth={2} fill="url(#growthFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="info-box">
            <strong>Risk limits enforced:</strong> max {RISK_PRESETS[risk].maxDrawdownPct}% drawdown,
            no single position {'>'} {RISK_PRESETS[risk].maxSinglePositionPct}%. Allowed: {RISK_PRESETS[risk].allowedAssets.join(', ')}.
          </div>
        </div>
      )}

      <footer className="modal-footer">
        {step > 1 ? (
          <button className="btn-ghost" onClick={() => setStep(step - 1)}>Back</button>
        ) : (
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
        )}
        {step < 3 ? (
          <button className="btn-primary" disabled={!canNext} onClick={() => setStep(step + 1)}>
            Continue <ArrowRight size={16} />
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={() => {
              onCreate({
                id: Date.now(),
                name: name.trim(),
                allocation,
                risk,
                active: true,
                createdAt: 'May 2026',
                limits: {
                  maxDrawdownPct: RISK_PRESETS[risk].maxDrawdownPct,
                  maxSinglePositionPct: RISK_PRESETS[risk].maxSinglePositionPct,
                  allowedAssets: [...RISK_PRESETS[risk].allowedAssets],
                },
              });
              onClose();
            }}
          >
            <Check size={16} /> Activate plan
          </button>
        )}
      </footer>
    </Modal>
  );
}
