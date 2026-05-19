import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ArrowLeft, Check, Plus, Trash2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { RISK_PRESETS, GOALS, projectGrowth, formatCurrency } from '../data/mock';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(500);
  const [risk, setRisk] = useState('Medium');
  const [goal, setGoal] = useState('wealth');
  const [extraPlans, setExtraPlans] = useState([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [agree, setAgree] = useState(false);

  const projection = useMemo(
    () => projectGrowth({ monthlyContribution: amount, riskKey: risk, years: 20 }),
    [amount, risk]
  );
  const projected20y = projection[projection.length - 1].value;

  const finish = () => {
    const firstPlan = { amount, risk, goal: GOALS.find(g => g.id === goal)?.label || goal };
    navigate('/dashboard', { state: { newPlans: [firstPlan, ...extraPlans], email, name, freshSignup: true } });
  };

  const totalSteps = 5;
  const emailValid = /\S+@\S+\.\S+/.test(email) && name.trim().length >= 2 && agree;

  return (
    <div className="onboarding-shell">
      <header className="onboarding-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: 'var(--accent-primary)' }}>
          <ShieldCheck size={22} />
          Infrastructure.
        </div>
        <button className="btn-ghost" onClick={() => navigate('/')}>Exit setup</button>
      </header>

      <main className="onboarding-main">
        <div className="onboarding-progress">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`wizard-progress-step ${i + 1 <= step ? 'active' : ''}`} />
          ))}
        </div>
        <p className="text-muted" style={{ fontSize: '13px', marginBottom: '32px' }}>
          Step {step} of {totalSteps} - Takes about 2 minutes
        </p>

        {step === 1 && (
          <section>
            <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>How much can you set aside each month?</h1>
            <p className="text-secondary" style={{ fontSize: '16px', marginBottom: '32px' }}>
              Pick an amount you won't miss. You can change it anytime.
            </p>
            <div className="amount-display" style={{ fontSize: '48px' }}>{formatCurrency(amount)}</div>
            <input type="range" min="50" max="2000" step="50" value={amount}
              onChange={(e) => setAmount(Number(e.target.value))} className="slider" />
            <div className="slider-range-labels"><span>$50</span><span>$2,000</span></div>
            <div className="info-box" style={{ marginTop: '24px' }}>
              That's <strong>{formatCurrency(amount * 12)}</strong> per year going into your investments - automatically, on the 1st of every month.
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>How much swing can you handle?</h1>
            <p className="text-secondary" style={{ fontSize: '16px', marginBottom: '32px' }}>
              Higher risk usually means higher returns - but bigger drops along the way. Hard limits will be enforced regardless.
            </p>
            <div className="risk-options">
              {Object.entries(RISK_PRESETS).map(([key, preset]) => (
                <button key={key} onClick={() => setRisk(key)} className={`risk-option ${risk === key ? 'selected' : ''}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 500, fontSize: '16px' }}>{preset.label}</span>
                    <span className="text-muted" style={{ fontSize: '13px' }}>
                      ~{Math.round(preset.expectedAnnualReturn * 100)}%/yr - max -{preset.maxDrawdownPct}% drawdown
                    </span>
                  </div>
                  <p className="text-secondary" style={{ fontSize: '14px', marginTop: '8px' }}>{preset.blurb}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>What's this for?</h1>
            <p className="text-secondary" style={{ fontSize: '16px', marginBottom: '32px' }}>
              Picking a goal helps us frame the projections and tune defaults. You can change it later.
            </p>
            <div className="risk-options">
              {GOALS.map((g) => (
                <button key={g.id} onClick={() => setGoal(g.id)} className={`risk-option ${goal === g.id ? 'selected' : ''}`}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 500, fontSize: '16px' }}>{g.label}</span>
                    <span className="text-muted" style={{ fontSize: '13px' }}>{g.sub}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 4 && (
          <section>
            <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Want to add another plan?</h1>
            <p className="text-secondary" style={{ fontSize: '16px', marginBottom: '32px' }}>
              Some people run separate plans for retirement, a house deposit, and a rainy-day fund. Each can have its own amount, risk, and goal.
            </p>
            <div className="info-box" style={{ marginBottom: '20px' }}>
              <strong>Your first plan:</strong> {formatCurrency(amount)}/month - {risk} risk - {GOALS.find(g => g.id === goal)?.label}
            </div>
            {extraPlans.map((p, i) => (
              <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', marginBottom: '8px' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 500 }}>Plan #{i + 2}</p>
                  <p className="text-secondary" style={{ fontSize: '13px' }}>
                    {formatCurrency(p.amount)}/month - {p.risk} risk - {p.goal}
                  </p>
                </div>
                <button className="icon-btn" onClick={() => setExtraPlans(extraPlans.filter((_, j) => j !== i))}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <ExtraPlanBuilder onAdd={(p) => setExtraPlans([...extraPlans, p])} />
          </section>
        )}

        {step === 5 && (
          <section>
            <h1 style={{ fontSize: '32px', marginBottom: '12px' }}>Create your account.</h1>
            <p className="text-secondary" style={{ fontSize: '16px', marginBottom: '24px' }}>
              We'll save your setup and email you when your first contribution is scheduled. No card needed yet.
            </p>
            <label className="field-label">Your name</label>
            <input className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Morgan" />
            <label className="field-label" style={{ marginTop: '16px' }}>Email address</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginTop: '20px', cursor: 'pointer' }}>
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ marginTop: '3px' }} />
              <span className="text-secondary" style={{ fontSize: '13px', lineHeight: 1.5 }}>
                I understand this is a research-preview prototype, no real money is at risk, and Infrastructure is not yet a registered investment advisor.
              </span>
            </label>
            <div className="info-box" style={{ marginTop: '24px' }}>
              <strong>Your setup:</strong> {1 + extraPlans.length} {extraPlans.length ? 'plans' : 'plan'} - {formatCurrency(amount + extraPlans.reduce((s, p) => s + p.amount, 0))} total monthly contribution.
              In 20 years at {risk} risk on your first plan, projected: <strong>{formatCurrency(projected20y)}</strong>.
            </div>
            <div style={{ height: '180px', marginTop: '16px' }}>
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
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '12px' }} formatter={(v) => formatCurrency(v)} />
                  <Area type="monotone" dataKey="value" stroke="var(--status-active)" strokeWidth={2} fill="url(#onboardFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}
      </main>

      <footer className="onboarding-footer">
        <button className="btn-ghost" onClick={() => (step === 1 ? navigate('/') : setStep(step - 1))}>
          <ArrowLeft size={16} /> Back
        </button>
        {step < 5 ? (
          <button className="btn-primary" onClick={() => setStep(step + 1)}>
            Continue <ArrowRight size={16} />
          </button>
        ) : (
          <button className="btn-primary" disabled={!emailValid} onClick={finish}>
            <Check size={16} /> Create account & continue
          </button>
        )}
      </footer>
    </div>
  );
}

function ExtraPlanBuilder({ onAdd }) {
  const [show, setShow] = useState(false);
  const [a, setA] = useState(200);
  const [r, setR] = useState('Medium');
  const [g, setG] = useState('house');

  if (!show) {
    return (
      <button className="btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShow(true)}>
        <Plus size={16} /> Add another plan
      </button>
    );
  }
  return (
    <div className="card" style={{ padding: '20px', marginTop: '8px' }}>
      <label className="field-label">Monthly contribution</label>
      <div style={{ fontSize: '20px', fontWeight: 500, marginBottom: '4px' }}>{formatCurrency(a)}</div>
      <input type="range" min="50" max="2000" step="50" value={a} onChange={(e) => setA(Number(e.target.value))} className="slider" />
      <label className="field-label" style={{ marginTop: '16px' }}>Risk</label>
      <div className="risk-tabs" style={{ marginTop: '4px' }}>
        {Object.keys(RISK_PRESETS).map((k) => (
          <button key={k} className={`risk-tab ${r === k ? 'active' : ''}`} onClick={() => setR(k)}>{k}</button>
        ))}
      </div>
      <label className="field-label" style={{ marginTop: '16px' }}>Goal</label>
      <select className="input" value={g} onChange={(e) => setG(e.target.value)}>
        {GOALS.map((opt) => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
      </select>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
        <button className="btn-ghost" onClick={() => setShow(false)}>Cancel</button>
        <button className="btn-primary" onClick={() => {
          onAdd({ amount: a, risk: r, goal: GOALS.find(x => x.id === g)?.label || g });
          setShow(false); setA(200); setR('Medium'); setG('house');
        }}>
          <Plus size={16} /> Add this plan
        </button>
      </div>
    </div>
  );
}
