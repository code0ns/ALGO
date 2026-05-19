import React, { useState } from 'react';
import {
  ShoppingCart,
  ShieldCheck,
  Repeat,
  ArrowDownToLine,
  FileText,
  ChevronDown,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceDot,
} from 'recharts';
import { MOCK_ACTIVITY, formatPrice } from '../data/mock';

const ICONS = {
  buy: ShoppingCart,
  check: ShieldCheck,
  rebalance: Repeat,
  deposit: ArrowDownToLine,
  report: FileText,
};

// "What the autopilot did" feed. Entries with a `trade` payload expand on click to
// show a price mini-chart, position size, entry/current price, and live P&L.
export default function ActivityLog() {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="card" style={{ padding: '8px 0' }}>
      {MOCK_ACTIVITY.map((entry, i) => {
        const Icon = ICONS[entry.type] || ShieldCheck;
        const expandable = !!entry.trade;
        const isOpen = openId === entry.id;
        return (
          <div key={entry.id} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border-color)' }}>
            <button
              className={`activity-row activity-button ${expandable ? 'expandable' : ''}`}
              onClick={() => expandable && setOpenId(isOpen ? null : entry.id)}
              aria-expanded={isOpen}
            >
              <div className="activity-icon"><Icon size={16} /></div>
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <p style={{ fontSize: '14px', fontWeight: 500 }}>{entry.text}</p>
                <p className="text-muted" style={{ fontSize: '12px', marginTop: '2px' }}>
                  {entry.ts} · {entry.meta}
                </p>
              </div>
              {expandable && <TradePnlPill trade={entry.trade} />}
              {expandable && (
                <ChevronDown
                  size={16}
                  style={{
                    color: 'var(--text-muted)',
                    transition: 'transform 0.15s ease',
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                    flexShrink: 0,
                  }}
                />
              )}
            </button>

            {expandable && isOpen && <TradeDetail trade={entry.trade} />}
          </div>
        );
      })}
    </div>
  );
}

function TradePnlPill({ trade }) {
  const pnl = (trade.currentPrice - trade.entryPrice) * trade.shares;
  const pct = ((trade.currentPrice - trade.entryPrice) / trade.entryPrice) * 100;
  const positive = pnl >= 0;
  return (
    <span className={`pnl-pill ${positive ? 'up' : 'down'}`}>
      {positive ? '+' : ''}{formatPrice(pnl)} · {positive ? '+' : ''}{pct.toFixed(2)}%
    </span>
  );
}

function TradeDetail({ trade }) {
  const pnl = (trade.currentPrice - trade.entryPrice) * trade.shares;
  const pct = ((trade.currentPrice - trade.entryPrice) / trade.entryPrice) * 100;
  const positive = pnl >= 0;
  const positionValue = trade.currentPrice * trade.shares;

  return (
    <div className="trade-detail">
      <div className="trade-detail-grid">
        <Stat label="Symbol" value={trade.symbol} sub={trade.symbolName} />
        <Stat label="Shares" value={trade.shares.toFixed(3)} sub={`Position: ${formatPrice(positionValue)}`} />
        <Stat label="Entry price" value={formatPrice(trade.entryPrice)} />
        <Stat label="Current price" value={formatPrice(trade.currentPrice)} />
        <Stat
          label="Unrealized P&L"
          value={`${positive ? '+' : ''}${formatPrice(pnl)}`}
          sub={`${positive ? '+' : ''}${pct.toFixed(2)}%`}
          color={positive ? 'var(--status-active)' : '#c92a2a'}
        />
      </div>

      <div style={{ height: 140, marginTop: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trade.chart} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`tradeFill-${trade.symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={positive ? 'var(--status-active)' : '#c92a2a'} stopOpacity={0.2} />
                <stop offset="100%" stopColor={positive ? 'var(--status-active)' : '#c92a2a'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="i" hide />
            <YAxis
              domain={['dataMin - 0.5', 'dataMax + 0.5']}
              tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
              width={48}
              tickFormatter={(v) => `$${v.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontSize: '12px',
              }}
              formatter={(v) => [formatPrice(v), 'Price']}
              labelFormatter={() => ''}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={positive ? 'var(--status-active)' : '#c92a2a'}
              strokeWidth={2}
              fill={`url(#tradeFill-${trade.symbol})`}
              isAnimationActive={false}
            />
            <ReferenceDot
              x={0}
              y={trade.entryPrice}
              r={5}
              fill="var(--status-active)"
              stroke="var(--bg-secondary)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <p className="text-muted" style={{ fontSize: '11px', marginTop: '8px' }}>
        Green dot marks entry. Line shows price action since the position opened.
      </p>
    </div>
  );
}

function Stat({ label, value, sub, color }) {
  return (
    <div>
      <p className="text-muted" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </p>
      <p style={{ fontSize: '15px', fontWeight: 500, color: color || 'var(--text-primary)' }}>
        {value}
      </p>
      {sub && <p className="text-muted" style={{ fontSize: '12px', marginTop: '2px' }}>{sub}</p>}
    </div>
  );
}
