// Shared mock data + helpers for the prototype.
// Realistic enough to feel like a working product, simple enough that anyone reading
// the code can swap these helpers for real broker / market-data API calls later.

export const RISK_PRESETS = {
  Low: {
    label: 'Low',
    blurb: 'Bonds + blue-chip ETFs. Slow, steady, low drawdown.',
    expectedAnnualReturn: 0.05,
    volatility: 0.04,
    maxDrawdownPct: 8,
    maxSinglePositionPct: 15,
    allowedAssets: ['Bonds', 'Index ETFs'],
  },
  Medium: {
    label: 'Medium',
    blurb: 'Diversified equities. Balanced growth with controlled risk.',
    expectedAnnualReturn: 0.08,
    volatility: 0.10,
    maxDrawdownPct: 20,
    maxSinglePositionPct: 25,
    allowedAssets: ['Index ETFs', 'Blue-chip stocks'],
  },
  High: {
    label: 'High',
    blurb: 'Growth stocks + small allocation to crypto. Higher upside, bigger swings.',
    expectedAnnualReturn: 0.12,
    volatility: 0.20,
    maxDrawdownPct: 35,
    maxSinglePositionPct: 40,
    allowedAssets: ['Index ETFs', 'Growth stocks', 'Crypto (limited)'],
  },
};

// Deterministic pseudo-random so the projection looks "alive" but doesn't jump on every render.
function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Project portfolio value forward N months with monthly contribution + risk profile.
// Returns an array of { month: 'Mon YY', value: number } points.
export function projectGrowth({ monthlyContribution, riskKey, years, startingValue = 0 }) {
  const preset = RISK_PRESETS[riskKey] || RISK_PRESETS.Medium;
  const monthlyReturn = preset.expectedAnnualReturn / 12;
  const monthlyVol = preset.volatility / Math.sqrt(12);

  const points = [];
  let value = startingValue;
  const now = new Date(2026, 4, 1); // May 2026, matches prototype "today"

  for (let i = 0; i <= years * 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const label = date.toLocaleString('en-US', { month: 'short', year: '2-digit' });

    // Add contribution at start of month, apply return with mild deterministic noise.
    if (i > 0) {
      value += monthlyContribution;
      const noise = (seededRandom(i * 7 + Math.round(monthlyContribution)) - 0.5) * monthlyVol * 2;
      value *= 1 + monthlyReturn + noise;
    }
    points.push({ month: label, value: Math.max(0, Math.round(value)) });
  }
  return points;
}

// A small history of "what already happened" for the dashboard hero chart.
// 18 months of past performance for the default $750/mo at Medium risk.
export const HISTORICAL_DEFAULT = (() => {
  const monthlyReturn = 0.08 / 12;
  const monthlyVol = 0.10 / Math.sqrt(12);
  const points = [];
  let value = 0;
  const start = new Date(2024, 10, 1); // Nov 2024
  for (let i = 0; i < 19; i++) {
    const date = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const label = date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
    if (i > 0) {
      value += 750;
      const noise = (seededRandom(i * 11) - 0.5) * monthlyVol * 2;
      value *= 1 + monthlyReturn + noise;
    }
    points.push({ month: label, value: Math.max(0, Math.round(value)) });
  }
  return points;
})();

// Mock activity log entries that "the infrastructure" generated.
export const MOCK_ACTIVITY = [
  { id: 1, ts: 'May 18, 2026 · 09:31', type: 'buy', text: 'Auto-purchased $250 of VTI (Total Market ETF)', meta: 'Core Stability Plan' },
  { id: 2, ts: 'May 18, 2026 · 09:31', type: 'buy', text: 'Auto-purchased $250 of BND (Total Bond ETF)', meta: 'Core Stability Plan' },
  { id: 3, ts: 'May 15, 2026 · 14:02', type: 'check', text: 'Risk check passed — current drawdown 2.1% (limit 8%)', meta: 'Core Stability Plan' },
  { id: 4, ts: 'May 10, 2026 · 11:18', type: 'rebalance', text: 'Rebalanced allocation: shifted 3% from VTI → BND', meta: 'Core Stability Plan' },
  { id: 5, ts: 'May 03, 2026 · 09:30', type: 'deposit', text: 'Monthly contribution received — $750.00', meta: 'From linked bank account' },
  { id: 6, ts: 'Apr 30, 2026 · 16:00', type: 'report', text: 'Monthly statement generated', meta: 'Sent to your email' },
  { id: 7, ts: 'Apr 18, 2026 · 09:31', type: 'buy', text: 'Auto-purchased $500 of VTI (Total Market ETF)', meta: 'Core Stability Plan' },
];

export const INITIAL_PLANS = [
  {
    id: 1,
    name: 'Core Stability Plan',
    allocation: 500,
    risk: 'Low',
    active: true,
    createdAt: 'Nov 2024',
    limits: {
      maxDrawdownPct: 8,
      maxSinglePositionPct: 15,
      allowedAssets: ['Bonds', 'Index ETFs'],
    },
  },
  {
    id: 2,
    name: 'Long-term Growth',
    allocation: 250,
    risk: 'Medium',
    active: false,
    createdAt: 'Feb 2025',
    limits: {
      maxDrawdownPct: 20,
      maxSinglePositionPct: 25,
      allowedAssets: ['Index ETFs', 'Blue-chip stocks'],
    },
  },
];

export function formatCurrency(value) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}
