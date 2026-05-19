import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Settings2, BarChart3 } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 600, fontSize: '18px', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={24} />
          Infrastructure.
        </div>
        <button className="btn-outline" onClick={() => navigate('/dashboard')}>
          Access Dashboard
        </button>
      </header>

      <main className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px 24px' }}>
        <div style={{ maxWidth: '600px', marginBottom: '64px' }}>
          <h1 style={{ fontSize: '48px', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.03em' }}>
            Financial growth on autopilot.
          </h1>
          <p className="text-secondary" style={{ fontSize: '20px', marginBottom: '40px', maxWidth: '480px' }}>
            Like a thermostat for your savings. Set your monthly contributions, adjust your risk limits, and let the infrastructure work for you. No stress, no screens.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn-primary" onClick={() => navigate('/dashboard')} style={{ fontSize: '16px' }}>
              Configure Infrastructure <ArrowRight size={18} />
            </button>
          </div>
        </div>

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
