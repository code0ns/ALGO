import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  Power, 
  Settings, 
  Activity,
  ShieldAlert
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const mockData = [
  { name: 'Jan', value: 10000 },
  { name: 'Feb', value: 10400 },
  { name: 'Mar', value: 10350 },
  { name: 'Apr', value: 10800 },
  { name: 'May', value: 11200 },
  { name: 'Jun', value: 11450 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([
    { id: 1, name: 'Core Stability Plan', allocation: 500, active: true, risk: 'Low' },
    { id: 2, name: 'Long-term Growth', allocation: 250, active: false, risk: 'Medium' }
  ]);

  const togglePlan = (id) => {
    setPlans(plans.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Top Navigation */}
      <header style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', padding: '16px 24px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
              <ArrowLeft size={20} />
            </button>
            <h1 style={{ fontSize: '20px', fontWeight: 500 }}>Infrastructure Control Panel</h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
              JD
            </div>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: '40px 24px' }}>
        {/* Overview Section */}
        <section style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <p className="text-secondary" style={{ marginBottom: '4px', fontSize: '14px' }}>Total Projected Value</p>
              <h2 style={{ fontSize: '36px', fontWeight: 600 }}>$11,450.00</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="text-secondary" style={{ marginBottom: '4px', fontSize: '14px' }}>Monthly Contribution</p>
              <p style={{ fontSize: '18px', fontWeight: 500 }}>$750.00</p>
            </div>
          </div>

          <div className="card" style={{ height: '300px', padding: '24px 0 0 0' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-secondary)' }} dx={-10} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Line type="monotone" dataKey="value" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--bg-secondary)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Active Plans */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px' }}>Active Allocations</h3>
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '14px' }}>
              <Plus size={16} /> New Allocation
            </button>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {plans.map(plan => (
              <div key={plan.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ 
                    width: '48px', height: '48px', borderRadius: '50%', 
                    backgroundColor: plan.active ? 'rgba(43, 138, 62, 0.1)' : 'var(--bg-tertiary)',
                    color: plan.active ? 'var(--status-active)' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Activity size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', marginBottom: '4px', fontWeight: 500, color: plan.active ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {plan.name}
                    </h4>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '14px' }} className="text-secondary">
                      <span>Monthly: ${plan.allocation}</span>
                      <span>&bull;</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ShieldAlert size={14} /> Risk Limit: {plan.risk}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ 
                    fontSize: '13px', fontWeight: 500, 
                    color: plan.active ? 'var(--status-active)' : 'var(--text-muted)',
                    backgroundColor: plan.active ? 'rgba(43, 138, 62, 0.1)' : 'var(--bg-tertiary)',
                    padding: '4px 12px', borderRadius: '12px'
                  }}>
                    {plan.active ? 'Active' : 'Paused'}
                  </span>
                  
                  <button 
                    onClick={() => togglePlan(plan.id)}
                    style={{ 
                      padding: '8px', borderRadius: 'var(--radius-sm)',
                      backgroundColor: plan.active ? 'var(--bg-tertiary)' : 'var(--status-active)',
                      color: plan.active ? 'var(--text-secondary)' : '#fff',
                      transition: 'all 0.2s'
                    }}
                    title={plan.active ? "Pause Allocation" : "Resume Allocation"}
                  >
                    <Power size={18} />
                  </button>
                  <button style={{ padding: '8px', color: 'var(--text-secondary)' }} title="Configure Limits">
                    <Settings size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
