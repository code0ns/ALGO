// Lesson data + the synthetic market series each lesson visualises.
// Series are generated deterministically so demos always look identical.

function seeded(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildMarketsSeries() {
  const series = [];
  for (let i = 0; i < 60; i++) {
    const drift = 0.15 * i;
    const swing = Math.sin(i / 8) * 3;
    const noise = (seeded(i * 2.3) - 0.5) * 1.2;
    const price = 100 + drift + swing + noise;
    series.push({ i, price: +price.toFixed(2) });
  }
  return series;
}

// Lesson 2 — Indicators (RSI). Price dips first (RSI < 30 around i=18),
// then peaks (RSI > 70 around i=44). Entry at trough, exit at peak.
function buildRsiSeries() {
  const series = [];
  for (let i = 0; i < 60; i++) {
    const dipFactor = Math.exp(-Math.pow((i - 18) / 8, 2)) * -12;
    const peakFactor = Math.exp(-Math.pow((i - 44) / 10, 2)) * 14;
    const noise = (seeded(i * 3.1) - 0.5) * 0.9;
    const price = 100 + dipFactor + peakFactor + noise;
    series.push({ i, price: +price.toFixed(2) });
  }
  const period = 14;
  let avgGain = 0, avgLoss = 0;
  for (let i = 1; i < series.length; i++) {
    const change = series[i].price - series[i - 1].price;
    const gain = Math.max(change, 0);
    const loss = Math.max(-change, 0);
    if (i <= period) {
      avgGain += gain;
      avgLoss += loss;
      if (i === period) {
        avgGain /= period;
        avgLoss /= period;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        series[i].rsi = +(100 - 100 / (1 + rs)).toFixed(1);
      }
    } else {
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      series[i].rsi = +(100 - 100 / (1 + rs)).toFixed(1);
    }
  }
  for (let i = 0; i < series.length; i++) {
    const w = series.slice(Math.max(0, i - 19), i + 1);
    series[i].sma = +(w.reduce((s, p) => s + p.price, 0) / w.length).toFixed(2);
  }
  return series;
}

// Lesson 3 — TA. Segment boundaries (lengths 8,10,9,11,9,12):
// 7=BOT, 17=TOP, 26=BOT, 37=TOP, 46=BOT, 58=TOP
function buildSupportResistanceSeries() {
  const series = [];
  const bounces = [
    { from: 105, to: 95.5, len: 8 },
    { from: 95.5, to: 109.2, len: 10 },
    { from: 109.2, to: 96.1, len: 9 },
    { from: 96.1, to: 110.4, len: 11 },
    { from: 110.4, to: 95.8, len: 9 },
    { from: 95.8, to: 112.0, len: 12 },
  ];
  let i = 0;
  for (const seg of bounces) {
    for (let s = 0; s < seg.len; s++) {
      const t = s / (seg.len - 1);
      const noise = (seeded(i * 1.9) - 0.5) * 0.6;
      const price = seg.from + (seg.to - seg.from) * t + noise;
      series.push({ i, price: +price.toFixed(2), support: 95, resistance: 110 });
      i++;
    }
  }
  return series;
}

function buildSmaCrossoverSeries() {
  const series = [];
  for (let i = 0; i < 60; i++) {
    const a = i < 20 ? -0.4 * i : i < 40 ? -8 + 0.6 * (i - 20) : 4 - 0.5 * (i - 40);
    const noise = (seeded(i * 2.7) - 0.5) * 1.2;
    const price = 100 + a + noise;
    series.push({ i, price: +price.toFixed(2) });
  }
  for (let i = 0; i < series.length; i++) {
    const w = series.slice(Math.max(0, i - 19), i + 1);
    series[i].sma = +(w.reduce((s, p) => s + p.price, 0) / w.length).toFixed(2);
  }
  return series;
}

function buildCopyTradingSeries() {
  const series = [];
  let lead = 100;
  for (let i = 0; i < 60; i++) {
    const drift = 0.4;
    const wave = Math.sin(i / 6) * 1.2;
    const noise = (seeded(i * 5.3) - 0.5) * 1.8;
    lead = lead + drift + wave * 0.3 + noise * 0.4;
    series.push({ i, leadPrice: +lead.toFixed(2) });
  }
  for (let i = 0; i < series.length; i++) {
    const prevLead = i === 0 ? series[0].leadPrice : series[i - 1].leadPrice;
    const baseStart = 100;
    const leadChangePct = (prevLead - 100) / 100;
    series[i].yourPrice = +(baseStart * (1 + leadChangePct * 0.4)).toFixed(2);
  }
  return series;
}

function buildBreakoutSeries() {
  const series = [];
  const ceiling = 102;
  const floor = 98;
  for (let i = 0; i < 60; i++) {
    let price;
    if (i < 35) {
      const t = i / 35;
      const wave = Math.sin(i / 1.7) * (1.6 - t * 0.5);
      const noise = (seeded(i * 3.7) - 0.5) * 0.6;
      price = 100 + wave + noise;
    } else {
      const t = (i - 35) / 25;
      const noise = (seeded(i * 4.1) - 0.5) * 1.0;
      price = 102 + Math.pow(t, 1.3) * 14 + noise;
    }
    series.push({ i, price: +price.toFixed(2), ceiling, floor });
  }
  return series;
}

export const LESSONS = [
  {
    id: 'markets', number: 1, title: 'Markets',
    summary: "A market is just buyers and sellers agreeing on a price. When more people want to buy than sell, the price goes up. That's it.",
    howItWorks: 'You buy an asset (a share, an ETF, a coin) at one price. Later you sell it at another. The difference is your profit or loss. Markets move because new information, news, or sentiment shifts what people are willing to pay.',
    example: "You buy 10 shares of an ETF at $100. A few weeks later it's $108. You sell. You made $80 (minus tiny fees). If it dropped to $94 instead, you'd be down $60.",
    keyTerms: [
      { term: 'Position', def: 'An asset you currently hold, with a buy price and a size.' },
      { term: 'P&L', def: "Profit and Loss - how much you're up or down on a position." },
    ],
    chart: { series: buildMarketsSeries(), overlays: [],
      trades: [
        { atIndex: 10, type: 'entry', annotation: 'You buy 10 shares at the current price. This opens a position.' },
        { atIndex: 48, type: 'exit', annotation: 'You sell. Price moved up - that difference, times your position size, is your profit.' },
      ],
    },
  },
  {
    id: 'indicators', number: 2, title: 'Indicators',
    summary: 'Indicators like RSI and Moving Averages help you spot when an asset is overbought or oversold. They give you signals instead of guesses.',
    howItWorks: "Indicators are math run over recent prices to produce a signal. They don't predict the future - they summarise what just happened so you can react with rules instead of feelings.",
    example: "RSI above 70 often means an asset is 'overbought' and may pull back. Below 30, it's 'oversold' and may bounce.",
    keyTerms: [
      { term: 'RSI', def: 'Relative Strength Index, 0-100 momentum gauge.' },
      { term: 'SMA', def: 'Simple Moving Average - average of last N prices.' },
    ],
    chart: { series: buildRsiSeries(),
      overlays: [{ key: 'sma', label: '20-day SMA', color: 'var(--accent-secondary)' }],
      bottom: { key: 'rsi', label: 'RSI (14)', min: 0, max: 100,
        bands: [
          { at: 30, label: 'Oversold (30)', color: 'var(--status-active)' },
          { at: 70, label: 'Overbought (70)', color: 'var(--status-paused)' },
        ],
      },
      trades: [
        { atIndex: 19, type: 'entry', annotation: 'RSI dropped below 30 - market looks oversold. Rule says: buy.' },
        { atIndex: 45, type: 'exit', annotation: 'RSI crossed above 70 - overbought. Rule says: take profit.' },
      ],
    },
  },
  {
    id: 'technical-analysis', number: 3, title: 'Technical Analysis',
    summary: 'Technical analysis reads patterns in price charts - support, resistance, trend lines. It turns the chart into a map.',
    howItWorks: "TA assumes the chart already reflects all known information. Instead of valuing the company, you study the crowd's behaviour through price and volume.",
    example: "A price keeps bouncing off $95 - that's support. Break it and traders expect a drop to the next level.",
    keyTerms: [
      { term: 'Support', def: 'A price floor where buyers tend to step in.' },
      { term: 'Resistance', def: 'A price ceiling where sellers tend to take profit.' },
    ],
    chart: { series: buildSupportResistanceSeries(), overlays: [],
      bands: [
        { at: 95, label: 'Support', color: 'var(--status-active)' },
        { at: 110, label: 'Resistance', color: 'var(--status-paused)' },
      ],
      trades: [
        { atIndex: 7,  type: 'entry', annotation: 'Price bounced off $95 support - buying near the floor.' },
        { atIndex: 17, type: 'exit',  annotation: 'Price hit $110 resistance - selling near the ceiling.' },
        { atIndex: 26, type: 'entry', annotation: 'Another bounce off support - repeat the trade.' },
        { atIndex: 37, type: 'exit',  annotation: 'Hit resistance again - take profit.' },
        { atIndex: 46, type: 'entry', annotation: 'Support held a third time. Same rule, same action.' },
      ],
    },
  },
  {
    id: 'strategies', number: 4, title: 'Strategies',
    summary: 'A strategy is a repeatable set of rules. Consistency beats intuition over time.',
    howItWorks: 'A strategy turns trading into a process: defined entry, exit, position size, and risk per trade. Edge comes from running it for many trades, not winning any single one.',
    example: "'Buy when price closes above 20-day SMA, sell when it closes below.' Same rule, every day, no exceptions.",
    keyTerms: [
      { term: 'Edge', def: 'A statistical advantage that pays off over many trades.' },
      { term: 'Drawdown', def: 'Peak-to-trough loss on your account.' },
    ],
    chart: { series: buildSmaCrossoverSeries(),
      overlays: [{ key: 'sma', label: '20-day SMA', color: 'var(--accent-secondary)' }],
      trades: [
        { atIndex: 28, type: 'entry', annotation: 'Price closed above the 20-day SMA - strategy rule triggers a buy.' },
        { atIndex: 49, type: 'exit',  annotation: 'Price closed below the 20-day SMA - strategy rule triggers a sell. No exceptions.' },
      ],
    },
  },
  {
    id: 'copy-trading', number: 5, title: 'Copy Trading',
    summary: 'Copy trading lets you mirror experienced traders. Useful, but you only learn if you understand why they trade.',
    howItWorks: "You allocate capital to follow another trader's live trades automatically. It's a shortcut to expertise - and to inheriting their mistakes.",
    example: 'Allocate 10% of capital to a top trader. Every trade they place, your account places proportionally.',
    keyTerms: [
      { term: 'Lead trader', def: 'The trader whose moves you mirror.' },
      { term: 'Allocation', def: 'Share of capital assigned to a strategy or trader.' },
    ],
    chart: { series: buildCopyTradingSeries(),
      overlays: [
        { key: 'leadPrice', label: 'Lead trader account', color: 'var(--accent-primary)' },
        { key: 'yourPrice', label: 'Your account (40% allocation)', color: 'var(--status-active)' },
      ],
      hidePricePanel: true,
      trades: [
        { atIndex: 12, type: 'entry', annotation: 'Lead trader opened a position - your account mirrored it at 40% size, 1 tick later.' },
        { atIndex: 32, type: 'exit',  annotation: 'Lead trader closed - your account closed in parallel, banking 40% of their P&L.' },
      ],
    },
  },
  {
    id: 'automated-trading', number: 6, title: 'Automated Trading',
    summary: "Bots execute strategies 24/7 without emotion. The hard part isn't running them - it's designing one that actually works.",
    howItWorks: 'An algo trades by rules without human input. Removing emotion is the easy win. The real work is backtesting, managing risk, and knowing when to turn it off.',
    example: 'A breakout bot watches 50 assets at once and fires the moment any of them breaks a key level - faster than any human.',
    keyTerms: [
      { term: 'Backtest', def: 'Running a strategy on historical data to estimate its edge.' },
      { term: 'Kill switch', def: 'A safeguard that halts the bot when losses exceed a limit.' },
    ],
    chart: { series: buildBreakoutSeries(), overlays: [],
      bands: [
        { at: 102, label: 'Breakout level', color: 'var(--status-paused)' },
        { at: 98, label: 'Range floor', color: 'var(--text-muted)' },
      ],
      trades: [
        { atIndex: 36, type: 'entry', annotation: 'Price broke the $102 ceiling. Bot detected breakout and entered within milliseconds - no human could.' },
        { atIndex: 56, type: 'exit',  annotation: 'Trailing stop hit. Bot closed automatically, locking in the move.' },
      ],
    },
  },
];

export function getLesson(id) {
  return LESSONS.find((l) => l.id === id);
}
