import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Mail, Receipt, ShieldAlert, FileText, Sparkles, Check } from 'lucide-react';
import { DEFAULT_NOTIFICATIONS, TAX_WRAPPERS } from '../data/mock';

export default function Settings() {
  const navigate = useNavigate();
  const [notif, setNotif] = useState(DEFAULT_NOTIFICATIONS);
  const [email, setEmail] = useState('alex@example.com');
  const [tax, setTax] = useState('personal');
  const [saved, setSaved] = useState(false);

  const toggle = (key) => setNotif({ ...notif, [key]: !notif[key] });
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 1800); };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <header style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '16px 24px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/dashboard')} style={{ color: 'var(--text-secondary)' }}>
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: '20px', fontWeight: 500 }}>Settings</h1>
        </div>
      </header>

      <main className="container" style={{ padding: '40px 24px 64px', maxWidth: '720px' }}>
        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Account</h2>
          <p className="text-secondary" style={{ fontSize: '14px', marginBottom: '20px' }}>Email used for notifications and statements.</p>
          <div className="card" style={{ padding: '20px' }}>
            <label className="field-label">Email address</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Account type</h2>
          <p className="text-secondary" style={{ fontSize: '14px', marginBottom: '20px' }}>Determines what tax treatment applies. Speak with a tax advisor if unsure.</p>
          <div className="risk-options">
            {TAX_WRAPPERS.map((w) => (
              <button key={w.id} onClick={() => setTax(w.id)} className={`risk-option ${tax === w.id ? 'selected' : ''}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 500 }}>{w.label}</span>
                </div>
                <p className="text-secondary" style={{ fontSize: '13px', marginTop: '6px' }}>{w.sub}</p>
              </button>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Notifications</h2>
          <p className="text-secondary" style={{ fontSize: '14px', marginBottom: '20px' }}>What we email you about, and when.</p>
          <div className="card">
            <SettingRow icon={Mail} title="Weekly digest" desc="One short summary of your portfolio each Monday." on={notif.weekly_digest} onChange={() => toggle('weekly_digest')} />
            <SettingRow icon={ShieldAlert} title={`Drawdown alert (${notif.drawdown_threshold_pct}%)`} desc="Alert me if any plan drops more than this from its peak." on={notif.drawdown_alert} onChange={() => toggle('drawdown_alert')}
              extra={
                notif.drawdown_alert ? (
                  <div style={{ padding: '4px 20px 16px' }}>
                    <input type="range" min="2" max="20" step="1" value={notif.drawdown_threshold_pct}
                      onChange={(e) => setNotif({ ...notif, drawdown_threshold_pct: Number(e.target.value) })}
                      className="slider" />
                    <div className="slider-range-labels"><span>2%</span><span>20%</span></div>
                  </div>
                ) : null
              } />
            <SettingRow icon={Receipt} title="Trade executed" desc="Get a ping every time the autopilot buys, sells, or rebalances." on={notif.trade_executed} onChange={() => toggle('trade_executed')} />
            <SettingRow icon={FileText} title="Monthly statement" desc="Detailed statement on the 1st of each month." on={notif.monthly_statement} onChange={() => toggle('monthly_statement')} />
            <SettingRow icon={Sparkles} title="Product updates" desc="Occasional emails about new features." on={notif.product_updates} onChange={() => toggle('product_updates')} />
          </div>
        </section>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
          {saved && <span className="text-secondary" style={{ fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Check size={14} color="var(--status-active)" /> Saved</span>}
          <button className="btn-primary" onClick={save}>Save changes</button>
        </div>
      </main>
    </div>
  );
}

function SettingRow({ icon: Icon, title, desc, on, onChange, extra }) {
  return (
    <div style={{ borderTop: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px' }}>
        <div className="activity-icon" style={{ marginTop: 0 }}><Icon size={16} /></div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '14px', fontWeight: 500 }}>{title}</p>
          <p className="text-muted" style={{ fontSize: '12px', marginTop: '2px' }}>{desc}</p>
        </div>
        <button onClick={onChange} className={`toggle ${on ? 'on' : ''}`}>
          <span className="toggle-knob" />
        </button>
      </div>
      {extra}
    </div>
  );
}
