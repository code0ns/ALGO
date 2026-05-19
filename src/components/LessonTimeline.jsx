import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
  CartesianGrid,
} from 'recharts';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';

// Interactive lesson chart with a scrubber that progressively reveals the timeline.
// Y/X-axis domain is computed from the full series so the chart geometry never changes
// as the user scrolls — only the visible portion of the line moves.
export default function LessonTimeline({ chart }) {
  const { series, overlays = [], bands = [], bottom, trades = [], hidePricePanel = false } = chart;
  const lastIndex = series.length - 1;
  const [scrub, setScrub] = useState(lastIndex);

  const visibleData = useMemo(() => series.slice(0, scrub + 1), [series, scrub]);
  const triggered = trades.filter((t) => t.atIndex <= scrub);
  const lastEvent = triggered[triggered.length - 1];

  const yKeys = hidePricePanel ? overlays.map((o) => o.key) : ['price', ...overlays.map((o) => o.key)];
  const allValues = series.flatMap((p) => yKeys.map((k) => p[k]).filter((v) => v != null));
  const yMin = Math.floor(Math.min(...allValues, ...bands.map((b) => b.at)) - 2);
  const yMax = Math.ceil(Math.max(...allValues, ...bands.map((b) => b.at)) + 2);

  return (
    <div className="lesson-timeline">
      <div style={{ height: 240, marginBottom: 8 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={visibleData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity={0.18} />
                <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="i"
              type="number"
              domain={[0, lastIndex]}
              ticks={[0, Math.round(lastIndex / 2), lastIndex]}
              tickFormatter={(v) => `Day ${v}`}
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[yMin, yMax]}
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              axisLine={false}
              tickLine={false}
              width={48}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '12px',
              }}
              formatter={(v, name) => [`$${v}`, name]}
              labelFormatter={(l) => `Day ${l}`}
            />

            {bands.map((b) => (
              <ReferenceLine
                key={b.label}
                y={b.at}
                stroke={b.color}
                strokeDasharray="4 4"
                label={{ value: b.label, position: 'insideTopRight', fill: b.color, fontSize: 11 }}
              />
            ))}

            {!hidePricePanel && (
              <Area
                type="monotone"
                dataKey="price"
                stroke="var(--accent-primary)"
                strokeWidth={2}
                fill="url(#priceFill)"
                isAnimationActive={false}
                name="Price"
              />
            )}

            {overlays.map((o) => (
              <Line
                key={o.key}
                type="monotone"
                dataKey={o.key}
                stroke={o.color}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                name={o.label}
              />
            ))}

            {triggered.map((t) => {
              const point = series[t.atIndex];
              const yKey = hidePricePanel ? overlays[0]?.key : 'price';
              const yVal = point[yKey];
              const isEntry = t.type === 'entry';
              return (
                <ReferenceDot
                  key={`${t.atIndex}-${t.type}`}
                  x={t.atIndex}
                  y={yVal}
                  r={7}
                  fill={isEntry ? 'var(--status-active)' : 'var(--status-paused)'}
                  stroke="var(--bg-secondary)"
                  strokeWidth={2}
                />
              );
            })}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {bottom && (
        <div style={{ height: 110, marginBottom: 8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={visibleData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="var(--border-color)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="i" type="number" domain={[0, lastIndex]} hide />
              <YAxis
                domain={[bottom.min, bottom.max]}
                tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '12px',
                }}
                labelFormatter={(l) => `Day ${l}`}
              />
              {bottom.bands?.map((b) => (
                <ReferenceLine
                  key={b.label}
                  y={b.at}
                  stroke={b.color}
                  strokeDasharray="4 4"
                  label={{ value: b.label, position: 'insideTopRight', fill: b.color, fontSize: 10 }}
                />
              ))}
              <Line
                type="monotone"
                dataKey={bottom.key}
                stroke="var(--accent-primary)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
                name={bottom.label}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="scrubber-wrap">
        <div className="scrubber-label">
          <span className="text-muted" style={{ fontSize: '12px' }}>
            Drag to scroll through time · Day {scrub + 1} of {series.length}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={lastIndex}
          value={scrub}
          onChange={(e) => setScrub(Number(e.target.value))}
          className="slider scrubber"
        />
      </div>

      <div className="lesson-callout">
        {lastEvent ? (
          <>
            <div className={`lesson-callout-icon ${lastEvent.type === 'entry' ? 'entry' : 'exit'}`}>
              {lastEvent.type === 'entry' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', fontWeight: 500, marginBottom: '2px' }}>
                {lastEvent.type === 'entry' ? 'Trade entered' : 'Trade closed'} · Day {lastEvent.atIndex + 1}
              </p>
              <p className="text-secondary" style={{ fontSize: '13px' }}>{lastEvent.annotation}</p>
            </div>
          </>
        ) : (
          <>
            <div className="lesson-callout-icon"><Info size={14} /></div>
            <p className="text-secondary" style={{ fontSize: '13px' }}>
              Scroll forward to see when the strategy triggers a trade.
            </p>
          </>
        )}
      </div>

      <div className="lesson-legend">
        {!hidePricePanel && (
          <span className="legend-item">
            <span className="legend-swatch" style={{ background: 'var(--accent-primary)' }} /> Price
          </span>
        )}
        {overlays.map((o) => (
          <span key={o.key} className="legend-item">
            <span className="legend-swatch" style={{ background: o.color }} /> {o.label}
          </span>
        ))}
        <span className="legend-item">
          <span className="legend-dot" style={{ background: 'var(--status-active)' }} /> Entry
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: 'var(--status-paused)' }} /> Exit
        </span>
      </div>
    </div>
  );
}
