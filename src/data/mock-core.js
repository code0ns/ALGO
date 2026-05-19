// Core mock data — presets, projection math, historical series, plans, formatters.
// Re-exported by ./mock.js along with content-heavy stuff in ./mock-content.js.

export const RISK_PRESETS = {
  Low: {
    label: 'Low',
    blurb: 'Bonds + blue-chip ETFs. Slow, steady, low drawdown.',
    expectedAnnualReturn: 0.05,
    volatility: 0.04,
    maxDrawdownPct: 8,
    maxSinglePositionPct: 15,
    allowedAssets: ['Bonds', 'Index ETFs'],
    composition: [
      { name: 'BND (Total Bond)', pct: 60, color: '#4263EB' },
      { name: 'VTI (Total Market)', pct: 30, color: '#37B24D' },
      { name: 'Cash reserve', pct: 10, color: '#ADB5BD' },
    ],
  },
  Medium: {
    label: 'Medium',
    blurb: 'Diversified equities. Balanced growth with controlled risk.',
    expectedAnnualReturn: 0.08,
    volatility: 0.10,
    maxDrawdownPct: 20,
    maxSinglePositionPct: 25,
    allowedAssets: ['Index ETFs', 'Blue-chip stocks'],
    composition: [
      { name: 'VTI (Total Market)', pct: 50, color: '#37B24D' },
      { name: 'VXUS (International)', pct: 25, color: '#F59F00' },
      { name: 'BND (Total Bond)', pct: 20, color: '#4263EB' },
      { name: 'Cash reserve', pct: 5, color: '#ADB5BD' },
    ],
  },
  High: {
    label: 'High',
    blurb: 'Growth stocks + small allocation to crypto. Higher upside, bigger swings.',
    expectedAnnualReturn: 0.12,
    volatility: 0.20,
    maxDrawdownPct: 35,
    maxSinglePositionPct: 40,
    allowedAssets: ['Index ETFs', 'Growth stocks', 'Crypto (limited)'],
    composition: [
      { name: 'QQQ (Growth)', pct: 40, color: '#7048E8' },
      { name: 'VTI (Total Market)', pct: 30, color: '#37B24D' },
      { name: 'VXUS (International)', pct: 15, color: '#F59F00' },
      { name: 'BTC/ETH (limited)', pct: 10, color: '#FAB005' },
      { name: 'Cash reserve', pct: 5, color: '#ADB5BD' },
    ],
  },
};

export function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function projectGrowth({ monthlyContribution, riskKey, years, startingValue = 0 }) {
  const preset = RISK_PRESETS[riskKey] || RISK_PRESETS.Medium;
  const monthlyReturn = preset.expectedAnnualReturn / 12;
  const monthlyVol = preset.volatility / Math.sqrt(12);
  const points = [];
  let value = startingValue;
  const now = new Date(2026, 4, 1);
  for (let i = 0; i <= years * 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const label = date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
    if (i > 0) {
      value += monthlyContribution;
      const noise = (seededRandom(i * 7 + Math.round(monthlyContribution) + Math.round(startingValue)) - 0.5) * monthlyVol * 2;
      value *= 1 + monthlyReturn + noise;
    }
    points.push({ month: label, value: Math.max(0, Math.round(value)) });
  }
  return points;
}

export const HISTORICAL_DEFAULT = (() => {
  const monthlyReturn = 0.083 / 12;
  const monthlyVol = 0.09 / Math.sqrt(12);
  const bMonthlyReturn = 0.072 / 12;
  const bMonthlyVol = 0.13 / Math.sqrt(12);
  const points = [];
  let value = 0, bench = 0;
  const start = new Date(2024, 10, 1);
  for (let i = 0; i < 19; i++) {
    const date = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const label = date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
    if (i > 0) {
      value += 750;
      bench += 750;
      const noise = (seededRandom(i * 11) - 0.5) * monthlyVol * 2;
      const bNoise = (seededRandom(i * 17 + 5) - 0.5) * bMonthlyVol * 2;
      value *= 1 + monthlyReturn + noise;
      bench *= 1 + bMonthlyReturn + bNoise;
    }
    points.push({ month: label, value: Math.max(0, Math.round(value)), benchmark: Math.max(0, Math.round(bench)) });
  }
  return points;
})();

export const INITIAL_PLANS = [
  { id: 1, name: 'Core Stability Plan', allocation: 500, risk: 'Low', active: true, createdAt: 'Nov 2024', goal: 'Long-term wealth',
    limits: { maxDrawdownPct: 8, maxSinglePositionPct: 15, allowedAssets: ['Bonds', 'Index ETFs'] } },
  { id: 2, name: 'Long-term Growth', allocation: 250, risk: 'Medium', active: false, createdAt: 'Feb 2025', goal: 'Retirement',
    limits: { maxDrawdownPct: 20, maxSinglePositionPct: 25, allowedAssets: ['Index ETFs', 'Blue-chip stocks'] } },
];

export function formatCurrency(value) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export function formatPrice(value) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
