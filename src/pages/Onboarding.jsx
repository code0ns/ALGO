import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { RISK_PRESETS, projectGrowth, formatCurrency } from '../data/mock';

// 3-step onboarding: monthly amount → risk tolerance → goal.
// On finish, hands the new user straight to a dashboard that reflects their setup.
export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(500);
  const [risk, setRisk] = useState('Medium');
  const [goal, setGoal] = useState('Long-term wealth');

  const projection = useMemo(
    () => projectGrowth({ monthlyContribution: amount, riskKey: risk, years: 20 }),
    [amount, risk]
  );
  const projected20y = projection[projection.length - 1].value;

  const finish = () => {
    // In a real app we'd POST this setup to the backend / broker API.
    // For the prototype, we just hand off to the dashboard.
    navigate('/dashboard', {
      state: { newPlan: { amount, risk, goal } },
    });
  };

  return (
    <div className="onboarding-shell">
      <header className="onboarding-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--accent-primary)' }}>
          <ShieldCheck size={22} />
          Infrastructure.
        </div>
        <button className="btn-ghost" onClick={() => navigate('/')}>
          Exit setup
        </button>
      </header>

      <main className="onboarding-main">
        <div className="onboarding-progress">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`wizard-progress-step ${s <= step ? 'active' : ''}`} />
          ))}
        </div>
        <p className="text-muted" style={{ fontSize: '13px', marginBottom: '32px' }}>
          Step {step} of 3 · Takes about 90 seconds
        </p>

        {step === 1 && (
          <section>
            <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>
              How much can you set aside each month?
            </h1>
            <p className="text-secondary" style={{ fontSize: '16px', marginBottom: '32px' }}>
              Pick an amount you won't miss. You can change it anytime.
            </p>
            <div className="amount-display" style={{ fontSize: '48px' }}>{formatCurrency(amount)}</div>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="slider"
            />
            <div className="slider-range-labels"><span>$50</span><span>$2,000</span></div>
            <div className="info-box" style={{ marginTop: '24px' }}>
              That's <strong>{formatCurrency(amount * 12)}</strong> per year going into your investments — automatically, on the 1st of every month.
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>
              How much swing can you handle?
            </h1>
            <p className="text-secondary" style={{ fontSize: '16px', marginBottom: '32px' }}>
              Higher risk usually means higher returns over the long run — but bigger drops along the way. The infrastructure will enforce strict limits regardless.
            </p>
            <div className="risk-options">
              {Object.entries(RISK_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  onClick={() => setRisk(key)}
                  className={`risk-option ${risk === key ? 'selected' : ''}`}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 500, fontSize: '16px' }}>{preset.label}</span>
                    <span className="text-muted" style={{ fontSize: '13px' }}>
                      ~{Math.round(preset.expectedAnnualReturn * 100)}%/yr · max −{preset.maxDrawdownPct}% drawdown
                    </span>
                  </div>
                  <p className="text-secondary" style={{ fontSize: '14px', marginTop: '8px' }}>
                    {preset.blurb}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>You're ready.</h1>
            <p className="text-secondary" style={{ fontSize: '16px', marginBottom: '24px' }}>
              Here's what your infrastructure will quietly do over the next 20 years if nothing changes:
            </p>

            <div style={{ display: 'flex', gap: '32px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div>
                <p className="text-muted" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>You contribute</p>
                <p style={{ fontSize: '28px', fontWeight: 500 }}>{formatCurrency(amount * 12 * 20)}</p>
              </div>
              <div>
                <p className="text-muted" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Projected value</p>
                <p style={{ fontSize: '28px', fontWeight: 500, color: 'var(--status-active)' }}>{formatCurrency(projected20y)}</p>
              </div>
              <div>
                <p className="text-muted" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk profile</p>
                <p style={{ fontSize: '28px', fontWeight: 500 }}>{risk}</p>
              </div>
            </div>

            <div style={{ height: '220px', marginBottom: '24px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projection} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="onboardFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--status-active)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="var(--status-active)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} interval={35} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '12px' }}
                    formatter={(v) => formatCurrency(v)}
                  />
                  <Area type="monotone" dataKey="value" stroke="var(--status-active)" strokeWidth={2} fill="url(#onboardFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="info-box">
              Projections use historical averages and are not guaranteed. Real returns will fluctuate.
              The infrastructure caps drawdown at {RISK_PRESETS[risk].maxDrawdownPct}% to protect you.
            </div>
          </section>
        )}
      </main>

      <footer className="onboarding-footer">
        <button
          className="btn-ghost"
          onClick={() => (step === 1 ? navigate('/') : setStep(step - 1))}
        >
          <ArrowLeft size={16} /> Back
        </button>
        {step < 3 ? (
          <button className="btn-primary" onClick={() => setStep(step + 1)}>
            Continue <ArrowRight size={16} />
          </button>
        ) : (
          <button className="btn-primary" onClick={finish}>
            <Check size={16} /> Start the infrastructure
          </button>
        )}
      </footer>
    </div>
  );
}
