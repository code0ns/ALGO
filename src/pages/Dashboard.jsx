import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Power, Settings, Activity, ShieldAlert, BookOpen, Check,
  ArrowDownToLine, ArrowUpFromLine, ShieldOff, SettingsIcon, Sparkles, TrendingUp,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

import {
  RISK_PRESETS, HISTORICAL_DEFAULT, INITIAL_PLANS, formatCurrency, formatPrice, GOALS,
} from '../data/mock';
import AllocationWizard from '../components/AllocationWizard';
import ActivityLog from '../components/ActivityLog';
import BrokerStatus from '../components/BrokerStatus';
import PortfolioComposition from '../components/PortfolioComposition';
import WithdrawModal from '../components/WithdrawModal';
import KillSwitchModal from '../components/KillSwitchModal';

const ALL_ASSETS = ['Bonds', 'Index ETFs', 'Blue-chip stocks', 'Growth stocks', 'Crypto (limited)'];

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // Was the user just onboarded? Builds an empty first-run dashboard if so.
  const freshSignup = location.state?.freshSignup;
  const onboardedPlans = location.state?.newPlans;
  const onboardedName = location.state?.name;
  const justFunded = location.state?.funded;
  const justDeposited = location.state?.deposit;

  const [plans, setPlans] = useState(() => {
    if (onboardedPlans && onboardedPlans.length) {
      return onboardedPlans.map((p, i) => ({
        id: Date.now() + i,
        name: p.goal || 'My first plan',
        allocation: p.amount,
        risk: p.risk,
        active: true,
        createdAt: 'May 2026',
        goal: p.goal,
        limits: {
          maxDrawdownPct: RISK_PRESETS[p.risk].maxDrawdownPct,
          maxSinglePositionPct: RISK_PRESETS[p.risk].maxSinglePositionPct,
          allowedAssets: [...RISK_PRESETS[p.risk].allowedAssets],
        },
      }));
    }
    return INITIAL_PLANS;
  });

  const [wizardOpen, setWizardOpen] = useState(false);
  const [expandedSettingsId, setExpandedSettingsId] = useState(null);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [killOpen, setKillOpen] = useState(false);

  const totalActiveAllocation = plans.filter((p) => p.active).reduce((sum, p) => sum + p.allocation, 0);

  const togglePlan = (id) => setPlans(plans.map((p) => p.id === id ? { ...p, active: !p.active } : p));
  const updatePlan = (id, patch) => setPlans(plans.map((p) => p.id === id ? { ...p, ...patch } : p));
  const pauseAll = () => setPlans(plans.map((p) => ({ ...p, active: false })));

  // Empty state vs full state
  const isEmpty = freshSignup && !justFunded;
  const currentValue = isEmpty
    ? (justDeposited || 0)
    : HISTORICAL_DEFAULT[HISTORICAL_DEFAULT.length - 1].value;
  const benchmarkValue = HISTORICAL_DEFAULT[HISTORICAL_DEFAULT.length - 1].benchmark;
  const totalContributedHistorical = 750 * 18;
  const returnPct = isEmpty ? 0 : ((currentValue - totalContributedHistorical) / totalContributedHistorical) * 100;
  const benchPct = isEmpty ? 0 : ((benchmarkValue - totalContributedHistorical) / totalContributedHistorical) * 100;
  const outperformance = returnPct - benchPct;

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button className="btn-ghost" onClick={() => navigate('/learn')}>
              <BookOpen size={16} /> Learn
            </button>
            <button className="btn-ghost" onClick={() => navigate('/settings')}>
              <SettingsIcon size={16} /> Settings
            </button>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
              {(onboardedName || 'JD').slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: '32px 24px 64px' }}>
        <BrokerStatus />

        {isEmpty ? (
          <EmptyState
            name={onboardedName}
            plans={plans}
            onFund={() => navigate('/funding', { state: { amount: 500 } })}
          />
        ) : (
          <>
            {/* Hero: current value + return-vs-benchmark + history chart */}
            <section style={{ marginBottom: '40px', marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <p className="text-secondary" style={{ marginBottom: '4px', fontSize: '14px' }}>Current portfolio value</p>
                  <h2 style={{ fontSize: '36px', fontWeight: 600 }}>{formatCurrency(currentValue)}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <span className="pnl-pill up" style={{ fontSize: '13px' }}>
                      <TrendingUp size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                      +{returnPct.toFixed(1)}% total return
                    </span>
                    <span className="text-secondary" style={{ fontSize: '13px' }}>
                      vs S&P benchmark <strong>{benchPct >= 0 ? '+' : ''}{benchPct.toFixed(1)}%</strong>
                      {outperformance >= 0
                        ? <span style={{ color: 'var(--status-active)', marginLeft: '6px' }}>(beating by {outperformance.toFixed(1)}pt)</span>
                        : <span style={{ color: 'var(--status-down)', marginLeft: '6px' }}>(trailing by {Math.abs(outperformance).toFixed(1)}pt)</span>}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button className="btn-outline" onClick={() => navigate('/funding', { state: { amount: 250 } })}>
                    <ArrowDownToLine size={16} /> Deposit
                  </button>
                  <button className="btn-outline" onClick={() => setWithdrawOpen(true)}>
                    <ArrowUpFromLine size={16} /> Withdraw
                  </button>
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
                      formatter={(v, n) => [formatCurrency(v), n === 'value' ? 'Your portfolio' : 'S&P benchmark']}
                    />
                    <Line type="monotone" dataKey="benchmark" stroke="var(--text-muted)" strokeDasharray="4 4" strokeWidth={2} dot={false} name="benchmark" />
                    <Line type="monotone" dataKey="value" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 3, fill: 'var(--bg-secondary)', strokeWidth: 2 }} activeDot={{ r: 6 }} name="value" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: 'flex', gap: '14px', marginTop: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--accent-primary)' }} /> Your portfolio</span>
                <span className="legend-item"><span className="legend-swatch" style={{ background: 'var(--text-muted)', borderTop: '1px dashed var(--text-muted)' }} /> S&P benchmark</span>
                <span style={{ flex: 1 }} />
                <p className="text-muted" style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} /> Monthly contribution: {formatCurrency(totalActiveAllocation)}
                </p>
              </div>
            </section>
          </>
        )}

        {/* Active allocations with inline expandable settings (rename, amount, risk limits, composition) */}
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
                          {plan.goal && <><span>·</span><span>For: {plan.goal}</span></>}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`status-badge ${plan.active ? 'on' : 'off'}`}>
                        {plan.active ? 'Active' : 'Paused'}
                      </span>
                      <button onClick={() => togglePlan(plan.id)} className={`icon-btn ${plan.active ? '' : 'icon-btn-primary'}`} title={plan.active ? 'Pause' : 'Resume'}>
                        <Power size={18} />
                      </button>
                      <button className={`icon-btn ${isExpanded ? 'icon-btn-active' : ''}`} onClick={() => setExpandedSettingsId(isExpanded ? null : plan.id)} title="Settings" aria-expanded={isExpanded}>
                        <Settings size={18} />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <PlanSettings plan={plan} onSave={(patch) => { updatePlan(plan.id, patch); setExpandedSettingsId(null); }} onCancel={() => setExpandedSettingsId(null)} />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Activity log */}
        <section style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '20px' }}>What the infrastructure did</h3>
            <p className="text-muted" style={{ fontSize: '13px' }}>Click a trade for details · Last 30 days</p>
          </div>
          <ActivityLog />
        </section>

        {/* Kill switch */}
        <section style={{ marginTop: '40px', textAlign: 'center', padding: '24px 16px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-lg)' }}>
          <p className="text-secondary" style={{ fontSize: '13px', marginBottom: '12px' }}>
            Need to halt everything right now?
          </p>
          <button className="btn-danger" onClick={() => setKillOpen(true)}>
            <ShieldOff size={16} /> Pause all plans (kill switch)
          </button>
          <p className="text-muted" style={{ fontSize: '12px', marginTop: '10px' }}>
            Stops contributions and trades on every plan. Holdings are preserved.
          </p>
        </section>
      </main>

      {wizardOpen && <AllocationWizard onClose={() => setWizardOpen(false)} onCreate={(plan) => setPlans([plan, ...plans])} />}
      {withdrawOpen && <WithdrawModal availableBalance={currentValue} onClose={() => setWithdrawOpen(false)} onConfirm={() => {}} />}
      {killOpen && <KillSwitchModal onClose={() => setKillOpen(false)} onConfirm={pauseAll} />}
    </div>
  );
}

// --- Empty first-run state -----------------------------------------------
function EmptyState({ name, plans, onFund }) {
  const totalMonthly = plans.reduce((s, p) => s + p.allocation, 0);
  return (
    <section style={{ marginTop: '24px', marginBottom: '40px' }}>
      <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(43, 138, 62, 0.1)', color: 'var(--status-active)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <Check size={26} />
        </div>
        <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>You're set up{name ? `, ${name.split(' ')[0]}` : ''}.</h2>
        <p className="text-secondary" style={{ fontSize: '15px', maxWidth: '440px', margin: '0 auto 20px' }}>
          {plans.length} {plans.length === 1 ? 'plan' : 'plans'} ready. {formatCurrency(totalMonthly)} per month will start moving on the 1st once your bank is linked.
        </p>
        <button className="btn-primary" onClick={onFund}>
          <ArrowDownToLine size={16} /> Link bank & fund your account
        </button>
        <p className="text-muted" style={{ fontSize: '12px', marginTop: '12px' }}>
          You can also skip this and link a bank later — no monthly contributions will happen until you do.
        </p>
      </div>
    </section>
  );
}

// --- Inline plan settings (rename + amount + risk limits + composition) --
function PlanSettings({ plan, onSave, onCancel }) {
  const [name, setName] = useState(plan.name);
  const [allocation, setAllocation] = useState(plan.allocation);
  const [risk, setRisk] = useState(plan.risk);
  const [goal, setGoal] = useState(plan.goal || 'Long-term wealth');
  const [limits, setLimits] = useState(plan.limits);
  const composition = RISK_PRESETS[risk].composition;

  const toggleAsset = (asset) => setLimits((l) => ({
    ...l,
    allowedAssets: l.allowedAssets.includes(asset) ? l.allowedAssets.filter((a) => a !== asset) : [...l.allowedAssets, asset],
  }));

  return (
    <div className="inline-risk-panel">
      <p className="text-muted" style={{ fontSize: '12px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
        Edit plan
      </p>

      <div className="inline-risk-grid">
        <div>
          <label className="field-label">Name</label>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Goal</label>
          <select className="input" value={goal} onChange={(e) => setGoal(e.target.value)}>
            {GOALS.map((g) => <option key={g.id} value={g.label}>{g.label}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label className="field-label">Monthly contribution</label>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: '22px', fontWeight: 500 }}>{formatCurrency(allocation)}</span>
        </div>
        <input type="range" min="50" max="3000" step="50" value={allocation} onChange={(e) => setAllocation(Number(e.target.value))} className="slider" />
        <div className="slider-range-labels"><span>$50</span><span>$3,000</span></div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label className="field-label">Risk profile</label>
        <div className="risk-tabs" style={{ marginTop: '4px' }}>
          {Object.keys(RISK_PRESETS).map((k) => (
            <button key={k} className={`risk-tab ${risk === k ? 'active' : ''}`} onClick={() => {
              setRisk(k);
              setLimits({
                maxDrawdownPct: RISK_PRESETS[k].maxDrawdownPct,
                maxSinglePositionPct: RISK_PRESETS[k].maxSinglePositionPct,
                allowedAssets: [...RISK_PRESETS[k].allowedAssets],
              });
            }}>{k}</button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <PortfolioComposition composition={composition} title={`What ${name || 'this plan'} holds (${risk} risk)`} />
      </div>

      <div className="inline-risk-grid" style={{ marginTop: '24px' }}>
        <div>
          <label className="field-label" style={{ marginBottom: '4px' }}>Max drawdown</label>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '20px', fontWeight: 500 }}>{limits.maxDrawdownPct}%</span>
            <span className="text-muted" style={{ fontSize: '12px' }}>Auto-pause beyond this</span>
          </div>
          <input type="range" min="3" max="50" step="1" value={limits.maxDrawdownPct} onChange={(e) => setLimits({ ...limits, maxDrawdownPct: Number(e.target.value) })} className="slider" />
          <div className="slider-range-labels"><span>3%</span><span>50%</span></div>
        </div>
        <div>
          <label className="field-label" style={{ marginBottom: '4px' }}>Max single position</label>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '20px', fontWeight: 500 }}>{limits.maxSinglePositionPct}%</span>
            <span className="text-muted" style={{ fontSize: '12px' }}>No single asset above this</span>
          </div>
          <input type="range" min="5" max="100" step="5" value={limits.maxSinglePositionPct} onChange={(e) => setLimits({ ...limits, maxSinglePositionPct: Number(e.target.value) })} className="slider" />
          <div className="slider-range-labels"><span>5%</span><span>100%</span></div>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label className="field-label">Allowed asset categories</label>
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

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
        <button className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn-primary" onClick={() => onSave({ name, allocation, risk, goal, limits })}>Save changes</button>
      </div>
    </div>
  );
}
