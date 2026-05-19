import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  Settings2,
  BarChart3,
  BookOpen,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { RISK_PRESETS, projectGrowth, formatCurrency } from '../data/mock';

export default function Landing() {
  const navigate = useNavigate();

  // Interactive projection — moved from dashboard so visitors can play with it before signing up.
  const [startBalance, setStartBalance] = useState(2000);
  const [contribution, setContribution] = useState(500);
  const [years, setYears] = useState(15);
  const [risk, setRisk] = useState('Medium');

  const projection = useMemo(
    () => projectGrowth({
      monthlyContribution: contribution,
      riskKey: risk,
      years,
      startingValue: startBalance,
    }),
    [contribution, years, risk, startBalance]
  );
  const projectedEnd = projection[projection.length - 1].value;
  const totalContributions = startBalance + contribution * 12 * years;
  const gain = projectedEnd - totalContributions;

  return (
    <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 600, fontSize: '18px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={24} />
          Infrastructure.
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-ghost" onClick={() => navigate('/learn')}>
            <BookOpen size={16} /> Learn
          </button>
          <button className="btn-outline" onClick={() => navigate('/dashboard')}>
            See live dashboard
          </button>
        </div>
      </header>

      <main className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '64px 24px 32px' }}>
        <div style={{ maxWidth: '600px', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '48px', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.03em' }}>
            Financial growth on autopilot.
          </h1>
          <p className="text-secondary" style={{ fontSize: '20px', marginBottom: '40px', maxWidth: '480px' }}>
            Like a thermostat for your savings. Set your monthly contributions, adjust your risk limits, and let the infrastructure work for you. No stress, no screens.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => navigate('/onboarding')} style={{ fontSize: '16px' }}>
              Configure Infrastructure <ArrowRight size={18} />
            </button>
            <button className="btn-outline" onClick={() => navigate('/learn')}>
              <BookOpen size={16} /> Learn the basics first
            </button>
          </div>
        </div>

        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: '28px' }}>Project your future</h2>
            <p className="text-muted" style={{ fontSize: '13px' }}>Drag the sliders. See what compounding does.</p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div className="projection-controls">
              <div>
                <label className="field-label">Starting balance</label>
                <div style={{ fontSize: '22px', fontWeight: 500, marginBottom: '4px' }}>{formatCurrency(startBalance)}</div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={startBalance}
                  onChange={(e) => setStartBalance(Number(e.target.value))}
                  className="slider"
                />
                <div className="slider-range-labels"><span>$0</span><span>$50k</span></div>
              </div>
              <div>
                <label className="field-label">Monthly contribution</label>
                <div style={{ fontSize: '22px', fontWeight: 500, marginBottom: '4px' }}>{formatCurrency(contribution)}</div>
                <input
                  type="range"
                  min="50"
                  max="3000"
                  step="50"
                  value={contribution}
                  onChange={(e) => setContribution(Number(e.target.value))}
                  className="slider"
                />
                <div className="slider-range-labels"><span>$50</span><span>$3k</span></div>
              </div>
              <div>
                <label className="field-label">Years</label>
                <div style={{ fontSize: '22px', fontWeight: 500, marginBottom: '4px' }}>{years} years</div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="slider"
                />
                <div className="slider-range-labels"><span>1</span><span>30</span></div>
              </div>
              <div>
                <label className="field-label">Risk profile</label>
                <div className="risk-tabs" style={{ marginTop: '6px' }}>
                  {Object.keys(RISK_PRESETS).map((k) => (
                    <button
                      key={k}
                      className={`risk-tab ${risk === k ? 'active' : ''}`}
                      onClick={() => setRisk(k)}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <p className="text-muted" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>You contribute</p>
                <p style={{ fontSize: '20px', fontWeight: 500 }}>{formatCurrency(totalContributions)}</p>
              </div>
              <div>
                <p className="text-muted" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Compounded gains</p>
                <p style={{ fontSize: '20px', fontWeight: 500, color: 'var(--status-active)' }}>+{formatCurrency(gain)}</p>
              </div>
              <div>
                <p className="text-muted" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>In {years} years</p>
                <p style={{ fontSize: '28px', fontWeight: 600, color: 'var(--status-active)' }}>{formatCurrency(projectedEnd)}</p>
              </div>
            </div>

            <div style={{ height: '220px', marginTop: '16px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projection} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="landingFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--status-active)" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="var(--status-active)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
                    axisLine={false}
                    tickLine={false}
                    interval={Math.max(1, Math.floor(projection.length / 6))}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '12px' }}
                    formatter={(v) => formatCurrency(v)}
                  />
                  <Area type="monotone" dataKey="value" stroke="var(--status-active)" strokeWidth={2} fill="url(#landingFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <p className="text-muted" style={{ fontSize: '12px', marginTop: '8px' }}>
              Projections use historical averages for each risk profile. Real returns will fluctuate; risk limits cap the downside.
            </p>
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', borderTop: '1px solid var(--border-color)', paddingTop: '48px' }}>
          <div>
            <div style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
              <Settings2 size={24} />
            </div>
            <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>Set it and forget it</h3>
            <p className="text-secondary" style={{ fontSize: '15px' }}>
              Define your monthly allocation and risk parameters once. The system handles the rest.
            </p>
          </div>
          <div>
            <div style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
              <BarChart3 size={24} />
            </div>
            <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>Transparent reporting</h3>
            <p className="text-secondary" style={{ fontSize: '15px' }}>
              Clear, predictable views of your total balance. No complex charts, just steady growth.
            </p>
          </div>
          <div>
            <div style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>Risk limits enforced</h3>
            <p className="text-secondary" style={{ fontSize: '15px' }}>
              Strictly enforced limits ensure your exposure never exceeds what you configure.
            </p>
          </div>
        </div>
      </main>

      <footer style={{ padding: '32px 24px', textAlign: 'center', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
        <p className="text-muted" style={{ fontSize: '14px' }}>
          &copy; 2026 Infrastructure Systems. Reliable. Boring. Predictable.
        </p>
      </footer>
    </div>
  );
}
