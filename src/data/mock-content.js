// Content-heavy mock data — activity log, FAQ, trust, pricing, banks, settings options.
// Re-exported by ./mock.js.

import { seededRandom } from './mock-core';

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
  { id: 1, ts: 'May 18, 2026 - 09:31', type: 'buy', text: 'Auto-purchased $250 of VTI (Total Market ETF)', meta: 'Core Stability Plan',
    trade: { symbol: 'VTI', symbolName: 'Vanguard Total Stock Market ETF', shares: 1.087, entryPrice: 230.04, currentPrice: 234.18, side: 'long',
      chart: buildTradeMini({ entryPrice: 230.04, targetPrice: 234.18, days: 14, seed: 1 }) } },
  { id: 2, ts: 'May 18, 2026 - 09:31', type: 'buy', text: 'Auto-purchased $250 of BND (Total Bond ETF)', meta: 'Core Stability Plan',
    trade: { symbol: 'BND', symbolName: 'Vanguard Total Bond Market ETF', shares: 3.512, entryPrice: 71.18, currentPrice: 71.42, side: 'long',
      chart: buildTradeMini({ entryPrice: 71.18, targetPrice: 71.42, days: 14, seed: 2 }) } },
  { id: 3, ts: 'May 15, 2026 - 14:02', type: 'check', text: 'Risk check passed - current drawdown 2.1% (limit 8%)', meta: 'Core Stability Plan' },
  { id: 4, ts: 'May 10, 2026 - 11:18', type: 'rebalance', text: 'Rebalanced: shifted 3% from VTI to BND', meta: 'Core Stability Plan',
    trade: { symbol: 'BND/VTI', symbolName: 'Rebalance: $340 from VTI to BND', shares: 4.78, entryPrice: 71.10, currentPrice: 71.42, side: 'rebalance',
      chart: buildTradeMini({ entryPrice: 71.10, targetPrice: 71.42, days: 22, seed: 4 }) } },
  { id: 5, ts: 'May 03, 2026 - 09:30', type: 'deposit', text: 'Monthly contribution received - $750.00', meta: 'From linked bank account' },
  { id: 6, ts: 'Apr 30, 2026 - 16:00', type: 'report', text: 'Monthly statement generated', meta: 'Sent to your email' },
  { id: 7, ts: 'Apr 18, 2026 - 09:31', type: 'buy', text: 'Auto-purchased $500 of VTI (Total Market ETF)', meta: 'Core Stability Plan',
    trade: { symbol: 'VTI', symbolName: 'Vanguard Total Stock Market ETF', shares: 2.198, entryPrice: 227.50, currentPrice: 234.18, side: 'long',
      chart: buildTradeMini({ entryPrice: 227.50, targetPrice: 234.18, days: 44, seed: 7 }) } },
];

export const GOALS = [
  { id: 'wealth', label: 'Long-term wealth', sub: 'No specific deadline.' },
  { id: 'retirement', label: 'Retirement', sub: '20+ years out.' },
  { id: 'house', label: 'House deposit', sub: '5-10 years out.' },
  { id: 'kids', label: 'Kids / education', sub: '10-15 years out.' },
  { id: 'rainy_day', label: 'Rainy-day fund', sub: 'Liquid, low risk.' },
  { id: 'other', label: 'Other', sub: 'Tell us in setup notes.' },
];

export const PRICING = {
  feePct: 0.25,
  feeLabel: '0.25% per year',
  example: { balance: 10000, annualFee: 25 },
  noFees: ['No deposit fees', 'No withdrawal fees', 'No trade commissions', 'No account minimums'],
};

export const TRUST = {
  custodian: 'Apex Custody Bank (segregated client accounts)',
  regulator: 'Regulated by the Financial Markets Authority (mock)',
  deposit_protection: 'Eligible deposits protected up to 100k EUR by the national deposit guarantee scheme',
  broker: 'Trades executed via Alpaca Securities (paper trading in this demo)',
};

export const FAQ = [
  { q: 'What happens to my money if you go bust?',
    a: 'Your assets are held in your name at a third-party custodian (Apex Custody Bank), not on our balance sheet. If we ceased operations, you would retain ownership and could transfer your holdings to another broker.' },
  { q: 'What if the market crashes?',
    a: 'Every plan has a hard max-drawdown limit you choose. If the portfolio drops more than that, contributions pause automatically and you receive a notification. You can resume manually at any time.' },
  { q: 'How is my money invested?',
    a: 'In low-cost diversified ETFs covering global stocks, bonds, and (for higher risk plans) a small crypto allocation. You can see the exact breakdown for your plan on the dashboard.' },
  { q: 'What are the fees?',
    a: 'A single 0.25% annual management fee, charged monthly. No deposit fees, withdrawal fees, trade commissions, or account minimums.' },
  { q: 'Can I withdraw my money any time?',
    a: 'Yes. Withdrawals are sent to your linked bank account and typically arrive within 2-3 business days. There are no fees or penalties.' },
  { q: 'Is this insured?',
    a: 'Cash balances are covered up to 100k EUR by the national deposit guarantee scheme. Investments are not insured against market losses (no broker offers that) but are held in segregated accounts under your name.' },
  { q: 'Do I owe taxes?',
    a: 'Yes - investment gains are generally taxable. You will receive an annual statement that summarises gains, losses, and dividends, which you can use to file your tax return.' },
  { q: 'Can I have more than one plan?',
    a: 'Yes - many users run a Retirement plan alongside a House Deposit plan with different risk settings. Each gets its own contributions, risk limits, and progress chart.' },
];

export const BANKS = [
  { id: 'chase', name: 'Chase', color: '#117ACA' },
  { id: 'boa', name: 'Bank of America', color: '#012169' },
  { id: 'wells', name: 'Wells Fargo', color: '#D71E28' },
  { id: 'revolut', name: 'Revolut', color: '#000000' },
  { id: 'n26', name: 'N26', color: '#36A18B' },
  { id: 'monzo', name: 'Monzo', color: '#FF3464' },
  { id: 'swedbank', name: 'Swedbank', color: '#FF5F00' },
  { id: 'seb', name: 'SEB', color: '#60BB46' },
];

export const DEFAULT_NOTIFICATIONS = {
  weekly_digest: true,
  drawdown_alert: true,
  drawdown_threshold_pct: 5,
  trade_executed: false,
  monthly_statement: true,
  product_updates: false,
};

export const TAX_WRAPPERS = [
  { id: 'personal', label: 'Personal account', sub: 'Standard taxable account. Most flexible.' },
  { id: 'tax_advantaged', label: 'Tax-advantaged account', sub: 'IRA / ISA / equivalent. May have contribution limits.' },
];
