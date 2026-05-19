import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Power,
  Settings,
  Activity,
  ShieldAlert,
  BookOpen,
  Check,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import {
  RISK_PRESETS,
  HISTORICAL_DEFAULT,
  INITIAL_PLANS,
  formatCurrency,
} from '../data/mock';
import AllocationWizard from '../components/AllocationWizard';
import ActivityLog from '../components/ActivityLog';
import BrokerStatus from '../components/BrokerStatus';

const ALL_ASSETS = ['Bonds', 'Index ETFs', 'Blue-chip stocks', 'Growth stocks', 'Crypto (limited)'];

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [plans, setPlans] = useState(() => {
    const onboarded = location.state?.newPlan;
    if (!onboarded) return INITIAL_PLANS;
    return [
      {
        id: Date.now(),
        name: onboarded.goal || 'My first plan',
        allocation: onboarded.amount,
        risk: onboarded.risk,
        active: true,
        createdAt: 'May 2026',
        limits: {
          maxDrawdownPct: RISK_PRESETS[onboarded.risk].maxDrawdownPct,
          maxSinglePositionPct: RISK_PRESETS[onboarded.risk].maxSinglePositionPct,
          allowedAssets: [...RISK_PRESETS[onboarded.risk].allowedAssets],
        },
      },
      ...INITIAL_PLANS,
    ];
  });

  const [wizardOpen, setWizardOpen] = useState(false);
  const [expandedSettingsId, setExpandedSettingsId] = useState(null);

  const totalActiveAllocation = plans
    .filter((p) => p.active)
    .reduce((sum, p) => sum + p.allocation, 0);

  const togglePlan = (id) =>
    setPlans(plans.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));

  const updateLimits = (planId, limits) =>
    setPlans(plans.map((p) => (p.id === planId ? { ...p, limits } : p)));

  const currentValue = HISTORICAL_DEFAULT[HISTORICAL_DEFAULT.length - 1].value;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <header style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '16px 24px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
              <ArrowLeft size={20} />
            </button>
            <h1 style={{ fontSize: '20px', fontWeight: 500 }}>Infrastructure Control Panel</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="btn-ghost" onClick={() => navigate('/learn')}>
              <BookOpen size={16} /> Learn
            </button>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
              JD
            </div>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: '32px 24px 64px' }}>
        <BrokerStatus />

        {/* Hero numbers + historical chart */}
        <section style={{ marginBottom: '40px', marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p className="text-secondary" style={{ marginBottom: '4px', fontSize: '14px' }}>Current portfolio value</p>
              <h2 style={{ fontSize: '36px', fontWeight: 600 }}>{formatCurrency(currentValue)}</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="text-secondary" style={{ marginBottom: '4px', fontSize: '14px' }}>Monthly contribution (active plans)</p>
              <p style={{ fontSize: '18px', fontWeight: 500 }}>{formatCurrency(totalActiveAllocation)}</p>
            </div>
          </div>

          <div className="card" style={{ height: '300px', padding: '24px 0 0 0' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HISTORICAL_DEFAULT} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} dy={10} interval={2} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} dx={-10} tickFormatter={(val) => `$${Math.round(val/1000)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                  formatter={(v) => formatCurrency(v)}
                />
                <Line type="monotone" dataKey="value" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 3, fill: 'var(--bg-secondary)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Active plans with inline expandable risk settings */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px' }}>Active allocations</h3>
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }} onClick={() => setWizardOpen(true)}>
              <Plus size={16} /> New allocation
            </button>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {plans.map((plan) => {
              const isExpanded = expandedSettingsId === plan.id;
              return (
                <div key={plan.id} className="card" style={{ overflow: 'hidden' }}>
                  <div className="plan-row">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div className={`plan-avatar ${plan.active ? 'on' : ''}`}>
                        <Activity size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '16px', marginBottom: '4px', fontWeight: 500, color: plan.active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                          {plan.name}
                        </h4>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '14px', flexWrap: 'wrap' }} className="text-secondary">
                          <span>Monthly: {formatCurrency(plan.allocation)}</span>
                          <span>·</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <ShieldAlert size={14} /> Max drawdown: {plan.limits.maxDrawdownPct}%
                          </span>
                          <span>·</span>
                          <span>{plan.risk} risk</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`status-badge ${plan.active ? 'on' : 'off'}`}>
                        {plan.active ? 'Active' : 'Paused'}
                      </span>
                      <button
                        onClick={() => togglePlan(plan.id)}
                        className={`icon-btn ${plan.active ? '' : 'icon-btn-primary'}`}
                        title={plan.active ? 'Pause Allocation' : 'Resume Allocation'}
                      >
                        <Power size={18} />
                      </button>
                      <button
                        className={`icon-btn ${isExpanded ? 'icon-btn-active' : ''}`}
                        onClick={() => setExpandedSettingsId(isExpanded ? null : plan.id)}
                        title="Risk limits"
                        aria-expanded={isExpanded}
                      >
                        <Settings size={18} />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <InlineRiskSettings
                      plan={plan}
                      onSave={(limits) => {
                        updateLimits(plan.id, limits);
                        setExpandedSettingsId(null);
                      }}
                      onCancel={() => setExpandedSettingsId(null)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Activity log */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '20px' }}>What the infrastructure did</h3>
            <p className="text-muted" style={{ fontSize: '13px' }}>Click a trade for details · Last 30 days</p>
          </div>
          <ActivityLog />
        </section>
      </main>

      {wizardOpen && (
        <AllocationWizard
          onClose={() => setWizardOpen(false)}
          onCreate={(plan) => setPlans([plan, ...plans])}
        />
      )}
    </div>
  );
}

// --- Inline risk settings panel (no longer a modal) -----------------------
function InlineRiskSettings({ plan, onSave, onCancel }) {
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
    <div className="inline-risk-panel">
      <p className="text-muted" style={{ fontSize: '12px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
        Risk limits — hard caps the infrastructure enforces on every trade
      </p>

      <div className="inline-risk-grid">
        <div>
          <label className="field-label" style={{ marginBottom: '4px' }}>Max drawdown</label>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '20px', fontWeight: 500 }}>{limits.maxDrawdownPct}%</span>
            <span className="text-muted" style={{ fontSize: '12px' }}>Auto-pause beyond this</span>
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

        <div>
          <label className="field-label" style={{ marginBottom: '4px' }}>Max single position</label>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '20px', fontWeight: 500 }}>{limits.maxSinglePositionPct}%</span>
            <span className="text-muted" style={{ fontSize: '12px' }}>No single asset above this</span>
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
      </div>

      <div style={{ marginTop: '20px' }}>
        <label className="field-label" style={{ marginBottom: '6px' }}>Allowed asset categories</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
          {ALL_ASSETS.map((a) => {
            const on = limits.allowedAssets.includes(a);
            return (
              <button key={a} onClick={() => toggleAsset(a)} className={`chip ${on ? 'chip-on' : ''}`}>
                {on && <Check size={14} />} {a}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
        <button className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn-primary" onClick={() => onSave(limits)}>Save limits</button>
      </div>
    </div>
  );
}
