import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { FAQ as FAQ_ITEMS } from '../data/mock';
import TrustBadges from '../components/TrustBadges';

export default function FAQ() {
  const navigate = useNavigate();
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <header style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '16px 24px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/')} style={{ color: 'var(--text-secondary)' }}>
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: '20px', fontWeight: 500 }}>Common questions</h1>
        </div>
      </header>

      <main className="container" style={{ padding: '40px 24px 64px', maxWidth: '720px' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '12px' }}>The questions everyone asks first.</h2>
        <p className="text-secondary" style={{ fontSize: '16px', marginBottom: '32px' }}>
          No legalese. If something isn't here, email <a href="mailto:hello@infrastructure.example">hello@infrastructure.example</a>.
        </p>

        <div className="card">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border-color)' }}>
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  style={{ width: '100%', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '15px', fontWeight: 500 }}>{item.q}</span>
                  <ChevronDown size={16} style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
                </button>
                {isOpen && (
                  <p className="text-secondary" style={{ padding: '0 22px 18px', fontSize: '14px', lineHeight: 1.6 }}>
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <h3 style={{ fontSize: '18px', marginTop: '40px', marginBottom: '16px' }}>How your money is protected</h3>
        <TrustBadges />
      </main>
    </div>
  );
}
