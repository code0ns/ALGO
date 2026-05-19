// Shared mock data + helpers for the prototype.

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

function seededRandom(seed) {
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
  const monthlyReturn = 0.08 / 12;
  const monthlyVol = 0.10 / Math.sqrt(12);
  const points = [];
  let value = 0;
  const start = new Date(2024, 10, 1);
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

function buildTradeMini({ entryPrice, targetPrice, days, seed }) {
  const series = [];
  for (let i = 0; i <= days; i++) {
    const t = i / days;
    const noise = (seededRandom(seed * 13 + i * 1.7) - 0.5) * Math.max(0.4, entryPrice * 0.005);
    const price = entryPrice + (targetPrice - entryPrice) * t + noise;
    series.push({ i, price: +price.toFixed(2) });
  }
  return series;
}

export const MOCK_ACTIVITY = [
  {
    id: 1,
    ts: 'May 18, 2026 - 09:31',
    type: 'buy',
    text: 'Auto-purchased $250 of VTI (Total Market ETF)',
    meta: 'Core Stability Plan',
    trade: {
      symbol: 'VTI',
      symbolName: 'Vanguard Total Stock Market ETF',
      shares: 1.087,
      entryPrice: 230.04,
      currentPrice: 234.18,
      side: 'long',
      chart: buildTradeMini({ entryPrice: 230.04, targetPrice: 234.18, days: 14, seed: 1 }),
    },
  },
  {
    id: 2,
    ts: 'May 18, 2026 - 09:31',
    type: 'buy',
    text: 'Auto-purchased $250 of BND (Total Bond ETF)',
    meta: 'Core Stability Plan',
    trade: {
      symbol: 'BND',
      symbolName: 'Vanguard Total Bond Market ETF',
      shares: 3.512,
      entryPrice: 71.18,
      currentPrice: 71.42,
      side: 'long',
      chart: buildTradeMini({ entryPrice: 71.18, targetPrice: 71.42, days: 14, seed: 2 }),
    },
  },
  {
    id: 3,
    ts: 'May 15, 2026 - 14:02',
    type: 'check',
    text: 'Risk check passed - current drawdown 2.1% (limit 8%)',
    meta: 'Core Stability Plan',
  },
  {
    id: 4,
    ts: 'May 10, 2026 - 11:18',
    type: 'rebalance',
    text: 'Rebalanced: shifted 3% from VTI to BND',
    meta: 'Core Stability Plan',
    trade: {
      symbol: 'BND/VTI',
      symbolName: 'Rebalance: $340 from VTI to BND',
      shares: 4.78,
      entryPrice: 71.10,
      currentPrice: 71.42,
      side: 'rebalance',
      chart: buildTradeMini({ entryPrice: 71.10, targetPrice: 71.42, days: 22, seed: 4 }),
    },
  },
  {
    id: 5,
    ts: 'May 03, 2026 - 09:30',
    type: 'deposit',
    text: 'Monthly contribution received - $750.00',
    meta: 'From linked bank account',
  },
  {
    id: 6,
    ts: 'Apr 30, 2026 - 16:00',
    type: 'report',
    text: 'Monthly statement generated',
    meta: 'Sent to your email',
  },
  {
    id: 7,
    ts: 'Apr 18, 2026 - 09:31',
    type: 'buy',
    text: 'Auto-purchased $500 of VTI (Total Market ETF)',
    meta: 'Core Stability Plan',
    trade: {
      symbol: 'VTI',
      symbolName: 'Vanguard Total Stock Market ETF',
      shares: 2.198,
      entryPrice: 227.50,
      currentPrice: 234.18,
      side: 'long',
      chart: buildTradeMini({ entryPrice: 227.50, targetPrice: 234.18, days: 44, seed: 7 }),
    },
  },
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

export function formatPrice(value) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
