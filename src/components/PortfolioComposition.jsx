import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export default function PortfolioComposition({ composition, title = 'What this plan holds' }) {
  return (
    <div className="composition-wrap">
      <div className="composition-chart">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={composition}
              dataKey="pct"
              nameKey="name"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={2}
              isAnimationActive={false}
            >
              {composition.map((slice) => (
                <Cell key={slice.name} fill={slice.color} stroke="var(--bg-secondary)" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '12px' }}
              formatter={(v, n) => [`${v}%`, n]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ flex: 1 }}>
        <p className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '8px' }}>
          {title}
        </p>
        <div style={{ display: 'grid', gap: '6px' }}>
          {composition.map((slice) => (
            <div key={slice.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: slice.color, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{slice.name}</span>
              <span className="text-secondary" style={{ fontWeight: 500 }}>{slice.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
