import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Power,
  Settings,
  Activity,
  ShieldAlert,
  BookOpen,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

import {
  RISK_PRESETS,
  projectGrowth,
  HISTORICAL_DEFAULT,
  INITIAL_PLANS,
  formatCurrency,
} from '../data/mock';
import AllocationWizard from '../components/AllocationWizard';
import RiskLimitsPanel from '../components/RiskLimitsPanel';
import ActivityLog from '../components/ActivityLog';
import BrokerStatus from '../components/BrokerStatus';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // If the user came from onboarding, prepend their freshly-configured plan.
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
  const [limitsForPlan, setLimitsForPlan] = useState(null);

  // Interactive projection: user drags a slider, the long-term curve updates.
  const [projContribution, setProjContribution] = useState(750);
  const [projYears, setProjYears] = useState(10);
  const [projRisk, setProjRisk] = useState('Medium');
  const futureCurve = useMemo(
    () => projectGrowth({
      monthlyContribution: projContribution,
      riskKey: projRisk,
      years: projYears,
      startingValue: HISTORICAL_DEFAULT[HISTORICAL_DEFAULT.length - 1].value,
    }),
    [projContribution, projYears, projRisk]
  );
  const projectedEnd = futureCurve[futureCurve.length - 1].value;

  const totalActiveAllocation = plans
    .filter((p) => p.active)
    .reduce((sum, p) => sum + p.allocation, 0);

  const togglePlan = (id) =>
    setPlans(plans.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));

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

        {/* Interactive projection — the "wow" moment */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '20px' }}>Project your future</h3>
            <p className="text-muted" style={{ fontSize: '13px' }}>Adjust the sliders to see what happens</p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div className="projection-controls">
              <div>
                <label className="field-label">Monthly contribution</label>
                <div style={{ fontSize: '24px', fontWeight: 500, marginBottom: '4px' }}>{formatCurrency(projContribution)}</div>
                <input
                  type="range"
                  min="50"
                  max="3000"
                  step="50"
                  value={projContribution}
                  onChange={(e) => setProjContribution(Number(e.target.value))}
                  className="slider"
                />
              </div>
              <div>
                <label className="field-label">Years</label>
                <div style={{ fontSize: '24px', fontWeight: 500, marginBottom: '4px' }}>{projYears} years</div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={projYears}
                  onChange={(e) => setProjYears(Number(e.target.value))}
                  className="slider"
                />
              </div>
              <div>
                <label className="field-label">Risk</label>
                <div className="risk-tabs">
                  {Object.keys(RISK_PRESETS).map((k) => (
                    <button
                      key={k}
                      className={`risk-tab ${projRisk === k ? 'active' : ''}`}
                      onClick={() => setProjRisk(k)}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '20px', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <span className="text-secondary" style={{ fontSize: '14px' }}>
                Projected value in {projYears} years:
              </span>
              <span style={{ fontSize: '28px', fontWeight: 500, color: 'var(--status-active)' }}>
                {formatCurrency(projectedEnd)}
              </span>
            </div>

            <div style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={futureCurve} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--status-active)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="var(--status-active)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} interval={Math.max(1, Math.floor(futureCurve.length / 6))} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '12px' }}
                    formatter={(v) => formatCurrency(v)}
                  />
                  <Area type="monotone" dataKey="value" stroke="var(--status-active)" strokeWidth={2} fill="url(#dashFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Active plans */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px' }}>Active allocations</h3>
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }} onClick={() => setWizardOpen(true)}>
              <Plus size={16} /> New allocation
            </button>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {plans.map((plan) => (
              <div key={plan.id} className="card plan-row">
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
                    className="icon-btn"
                    onClick={() => setLimitsForPlan(plan)}
                    title="Configure risk limits"
                  >
                    <Settings size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Activity log */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '20px' }}>What the infrastructure did</h3>
            <p className="text-muted" style={{ fontSize: '13px' }}>Last 30 days</p>
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

      {limitsForPlan && (
        <RiskLimitsPanel
          plan={limitsForPlan}
          onClose={() => setLimitsForPlan(null)}
          onSave={(limits) => {
            setPlans(plans.map((p) => (p.id === limitsForPlan.id ? { ...p, limits } : p)));
          }}
        />
      )}
    </div>
  );
}
