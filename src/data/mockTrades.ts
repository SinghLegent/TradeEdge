import { Trade, MetricSummary, EquityPoint, PairStat, AssetClassFilter, TimeframeFilter } from '../types';
import { SAMPLE_CHART_SVGS } from './sampleCharts';

export const INITIAL_STARTING_BALANCE = 100000;

export const INITIAL_TRADES: Trade[] = [
  {
    id: 'TRD-184',
    date: '2026-09-14 14:15',
    timestamp: new Date('2026-09-14T14:15:00').getTime(),
    symbol: 'BTC/USDT',
    assetClass: 'crypto',
    direction: 'LONG',
    entryPrice: 68450.00,
    exitPrice: 71200.00,
    stopLoss: 67500.00,
    takeProfit: 71200.00,
    lotSize: 1.00,
    pnl: 2750.00,
    pnlPercent: 4.02,
    outcome: 'WIN',
    riskReward: 3.1,
    setup: 'Liquidity Sweep + OB',
    timeframe: '15m',
    notes: 'Swept Asian session low, confirmed bullish CHoCH on 5m, clean target at 4h supply.',
    chartScreenshot: SAMPLE_CHART_SVGS.liquidity_sweep,
    status: 'CLOSED',
    duration: '2h 45m',
  },
  {
    id: 'TRD-183',
    date: '2026-09-13 10:30',
    timestamp: new Date('2026-09-13T10:30:00').getTime(),
    symbol: 'EUR/USD',
    assetClass: 'forex',
    direction: 'SHORT',
    entryPrice: 1.0924,
    exitPrice: 1.0862,
    stopLoss: 1.0945,
    takeProfit: 1.0862,
    lotSize: 3.00,
    pnl: 1860.00,
    pnlPercent: 0.57,
    outcome: 'WIN',
    riskReward: 2.8,
    setup: 'London Breakout',
    timeframe: '1h',
    notes: 'ECB rate decision dovish hold, aggressive selloff at London open.',
    chartScreenshot: SAMPLE_CHART_SVGS.breakout,
    status: 'CLOSED',
    duration: '4h 10m',
  },
  {
    id: 'TRD-182',
    date: '2026-09-12 15:40',
    timestamp: new Date('2026-09-12T15:40:00').getTime(),
    symbol: 'NVDA',
    assetClass: 'stock',
    direction: 'LONG',
    entryPrice: 132.50,
    exitPrice: 136.80,
    stopLoss: 130.80,
    takeProfit: 136.80,
    lotSize: 500,
    pnl: 2150.00,
    pnlPercent: 3.25,
    outcome: 'WIN',
    riskReward: 2.4,
    setup: 'Gap & Go Opening Drive',
    timeframe: '5m',
    notes: 'AI server expansion news, institutional buying volume on tape.',
    chartScreenshot: SAMPLE_CHART_SVGS.stock_gap,
    status: 'CLOSED',
    duration: '1h 15m',
  },
  {
    id: 'TRD-181',
    date: '2026-09-11 09:15',
    timestamp: new Date('2026-09-11T09:15:00').getTime(),
    symbol: 'XAU/USD',
    assetClass: 'forex',
    direction: 'LONG',
    entryPrice: 2575.20,
    exitPrice: 2598.60,
    stopLoss: 2568.00,
    takeProfit: 2600.00,
    lotSize: 1.50,
    pnl: 2340.00,
    pnlPercent: 0.91,
    outcome: 'WIN',
    riskReward: 3.2,
    setup: 'NY Session FVG Fill',
    timeframe: '15m',
    notes: 'Gold held daily support, clean reaction off 15m bullish fair value gap.',
    chartScreenshot: SAMPLE_CHART_SVGS.liquidity_sweep,
    status: 'CLOSED',
    duration: '3h 20m',
  },
  {
    id: 'TRD-180',
    date: '2026-09-10 13:00',
    timestamp: new Date('2026-09-10T13:00:00').getTime(),
    symbol: 'GBP/JPY',
    assetClass: 'forex',
    direction: 'SHORT',
    entryPrice: 194.20,
    exitPrice: 194.95,
    stopLoss: 194.95,
    takeProfit: 192.50,
    lotSize: 2.00,
    pnl: -750.00,
    pnlPercent: -0.39,
    outcome: 'LOSS',
    riskReward: -1.0,
    setup: 'Break & Retest',
    timeframe: '15m',
    notes: 'BoJ governor speech triggered sudden yen weakening. Hit stop loss strictly.',
    status: 'CLOSED',
    duration: '45m',
  },
  {
    id: 'TRD-179',
    date: '2026-09-09 11:20',
    timestamp: new Date('2026-09-09T11:20:00').getTime(),
    symbol: 'ETH/USDT',
    assetClass: 'crypto',
    direction: 'LONG',
    entryPrice: 2420.00,
    exitPrice: 2515.00,
    stopLoss: 2380.00,
    takeProfit: 2520.00,
    lotSize: 5.00,
    pnl: 1900.00,
    pnlPercent: 3.93,
    outcome: 'WIN',
    riskReward: 2.6,
    setup: 'Consolidation Break',
    timeframe: '1h',
    notes: 'Ethereum broke out of 3-day symmetrical triangle with rising delta.',
    chartScreenshot: SAMPLE_CHART_SVGS.liquidity_sweep,
    status: 'CLOSED',
    duration: '5h 30m',
  },
  {
    id: 'TRD-178',
    date: '2026-09-08 14:00',
    timestamp: new Date('2026-09-08T14:00:00').getTime(),
    symbol: 'SPY',
    assetClass: 'stock',
    direction: 'SHORT',
    entryPrice: 562.40,
    exitPrice: 558.10,
    stopLoss: 564.50,
    takeProfit: 558.00,
    lotSize: 400,
    pnl: 1720.00,
    pnlPercent: 0.76,
    outcome: 'WIN',
    riskReward: 2.1,
    setup: 'Overbought Mean Reversion',
    timeframe: '30m',
    notes: 'Rejected key psychological round number, heavy delta divergence.',
    chartScreenshot: SAMPLE_CHART_SVGS.breakout,
    status: 'CLOSED',
    duration: '2h 10m',
  },
  {
    id: 'TRD-177',
    date: '2026-09-07 10:15',
    timestamp: new Date('2026-09-07T10:15:00').getTime(),
    symbol: 'SOL/USDT',
    assetClass: 'crypto',
    direction: 'LONG',
    entryPrice: 142.50,
    exitPrice: 142.40,
    pnl: -20.00,
    pnlPercent: -0.07,
    outcome: 'BREAKEVEN',
    riskReward: 0.0,
    setup: 'Trend Pullback',
    timeframe: '15m',
    notes: 'Moved stop to BE after +1.5R. Took out trailing stop during chop.',
    status: 'CLOSED',
    duration: '1h 50m',
  },
  {
    id: 'TRD-176',
    date: '2026-09-05 08:45',
    timestamp: new Date('2026-09-05T08:45:00').getTime(),
    symbol: 'EUR/USD',
    assetClass: 'forex',
    direction: 'LONG',
    entryPrice: 1.0850,
    exitPrice: 1.0910,
    pnl: 1500.00,
    pnlPercent: 0.55,
    outcome: 'WIN',
    riskReward: 2.5,
    setup: 'London Open Expansion',
    timeframe: '15m',
    notes: 'Clean run on liquidity above yesterday high.',
    status: 'CLOSED',
    duration: '3h 15m',
  },
  {
    id: 'TRD-175',
    date: '2026-09-04 16:10',
    timestamp: new Date('2026-09-04T16:10:00').getTime(),
    symbol: 'BTC/USDT',
    assetClass: 'crypto',
    direction: 'SHORT',
    entryPrice: 67800.00,
    exitPrice: 68600.00,
    pnl: -800.00,
    pnlPercent: -1.18,
    outcome: 'LOSS',
    riskReward: -1.0,
    setup: 'Failed Auction Fade',
    timeframe: '15m',
    notes: 'Tried to fade high of day, but strong spot bidding pushed right through.',
    status: 'CLOSED',
    duration: '35m',
  },
  {
    id: 'TRD-174',
    date: '2026-09-02 12:30',
    timestamp: new Date('2026-09-02T12:30:00').getTime(),
    symbol: 'XAU/USD',
    assetClass: 'forex',
    direction: 'LONG',
    entryPrice: 2540.00,
    exitPrice: 2568.00,
    pnl: 2800.00,
    pnlPercent: 1.10,
    outcome: 'WIN',
    riskReward: 3.5,
    setup: 'Order Block Retest',
    timeframe: '1h',
    notes: 'Clean tap into 4h unmitigated order block, immediate strong displacement.',
    status: 'CLOSED',
    duration: '6h 00m',
  },
  {
    id: 'TRD-173',
    date: '2026-08-30 14:00',
    timestamp: new Date('2026-08-30T14:00:00').getTime(),
    symbol: 'NVDA',
    assetClass: 'stock',
    direction: 'LONG',
    entryPrice: 126.80,
    exitPrice: 131.20,
    pnl: 2200.00,
    pnlPercent: 3.47,
    outcome: 'WIN',
    riskReward: 2.7,
    setup: 'Earnings Momentum Follow-through',
    timeframe: '15m',
    notes: 'Held key VWAP level after morning dip, buyers stepped in.',
    status: 'CLOSED',
    duration: '2h 40m',
  },
  {
    id: 'TRD-172',
    date: '2026-08-28 11:15',
    timestamp: new Date('2026-08-28T11:15:00').getTime(),
    symbol: 'USD/JPY',
    assetClass: 'forex',
    direction: 'SHORT',
    entryPrice: 154.80,
    exitPrice: 153.90,
    pnl: 1450.00,
    pnlPercent: 0.58,
    outcome: 'WIN',
    riskReward: 2.2,
    setup: 'Resistance Rejection',
    timeframe: '1h',
    notes: 'Heavy resistance at 155.00 psychological level.',
    status: 'CLOSED',
    duration: '4h 25m',
  },
  {
    id: 'TRD-171',
    date: '2026-08-26 15:30',
    timestamp: new Date('2026-08-26T15:30:00').getTime(),
    symbol: 'GBP/JPY',
    assetClass: 'forex',
    direction: 'LONG',
    entryPrice: 192.50,
    exitPrice: 192.00,
    pnl: -500.00,
    pnlPercent: -0.26,
    outcome: 'LOSS',
    riskReward: -1.0,
    setup: 'Trend Pullback',
    timeframe: '30m',
    notes: 'Choppy London afternoon, closed early at stop.',
    status: 'CLOSED',
    duration: '1h 10m',
  },
  {
    id: 'TRD-170',
    date: '2026-08-24 13:45',
    timestamp: new Date('2026-08-24T13:45:00').getTime(),
    symbol: 'BTC/USDT',
    assetClass: 'crypto',
    direction: 'LONG',
    entryPrice: 64200.00,
    exitPrice: 66900.00,
    pnl: 3100.00,
    pnlPercent: 4.21,
    outcome: 'WIN',
    riskReward: 3.4,
    setup: 'Weekly Open Retest',
    timeframe: '4h',
    notes: 'Reclaimed weekly VWAP, massive CVD absorption on binance futures.',
    status: 'CLOSED',
    duration: '8h 20m',
  },
  {
    id: 'TRD-169',
    date: '2026-08-21 10:20',
    timestamp: new Date('2026-08-21T10:20:00').getTime(),
    symbol: 'EUR/USD',
    assetClass: 'forex',
    direction: 'SHORT',
    entryPrice: 1.0960,
    exitPrice: 1.0962,
    pnl: -40.00,
    pnlPercent: -0.02,
    outcome: 'BREAKEVEN',
    riskReward: 0.0,
    setup: 'London Open Sweep',
    timeframe: '15m',
    notes: 'Stalled before key target, scratch trade.',
    status: 'CLOSED',
    duration: '50m',
  },
  {
    id: 'TRD-168',
    date: '2026-08-19 14:15',
    timestamp: new Date('2026-08-19T14:15:00').getTime(),
    symbol: 'TSLA',
    assetClass: 'stock',
    direction: 'LONG',
    entryPrice: 218.40,
    exitPrice: 226.50,
    pnl: 1620.00,
    pnlPercent: 3.71,
    outcome: 'WIN',
    riskReward: 2.3,
    setup: 'Pre-market High Breakout',
    timeframe: '5m',
    notes: 'Clean volume surge over 220 pivot.',
    status: 'CLOSED',
    duration: '1h 45m',
  },
  {
    id: 'TRD-167',
    date: '2026-08-15 09:30',
    timestamp: new Date('2026-08-15T09:30:00').getTime(),
    symbol: 'XAU/USD',
    assetClass: 'forex',
    direction: 'SHORT',
    entryPrice: 2512.00,
    exitPrice: 2519.50,
    pnl: -750.00,
    pnlPercent: -0.30,
    outcome: 'LOSS',
    riskReward: -1.0,
    setup: 'Bearish Divergence',
    timeframe: '15m',
    notes: 'Divergence failed to materialize, stopped out safely.',
    status: 'CLOSED',
    duration: '40m',
  },
  {
    id: 'TRD-166',
    date: '2026-08-12 11:00',
    timestamp: new Date('2026-08-12T11:00:00').getTime(),
    symbol: 'ETH/USDT',
    assetClass: 'crypto',
    direction: 'LONG',
    entryPrice: 2310.00,
    exitPrice: 2425.00,
    pnl: 2300.00,
    pnlPercent: 4.98,
    outcome: 'WIN',
    riskReward: 3.0,
    setup: 'Higher Low Formation',
    timeframe: '1h',
    notes: 'Layer 1 rotation volume, smooth continuation to next liquidity pool.',
    status: 'CLOSED',
    duration: '6h 15m',
  },
  {
    id: 'TRD-165',
    date: '2026-08-08 15:10',
    timestamp: new Date('2026-08-08T15:10:00').getTime(),
    symbol: 'EUR/USD',
    assetClass: 'forex',
    direction: 'LONG',
    entryPrice: 1.0820,
    exitPrice: 1.0895,
    pnl: 1875.00,
    pnlPercent: 0.69,
    outcome: 'WIN',
    riskReward: 2.7,
    setup: 'NFP Post-Volatility Pullback',
    timeframe: '15m',
    notes: 'Post-news calm, institutional smart money sweep re-entry.',
    status: 'CLOSED',
    duration: '3h 50m',
  }
];

// Helper to synthesize realistic extended historical equity points & trades
export function generateComprehensiveData() {
  // Let's create an array of points simulating 6 months of trading leading up to current balance $142,850.50
  const points: EquityPoint[] = [];
  const startTimestamp = new Date('2026-03-01T09:00:00').getTime();
  const endTimestamp = new Date('2026-09-14T15:00:00').getTime();
  const totalDays = 197;
  
  // Realistic cumulative trajectory with pullbacks and expansions
  let currentBal = INITIAL_STARTING_BALANCE;
  let peakBal = INITIAL_STARTING_BALANCE;

  // Daily seed points
  const milestones = [
    { day: 0, pnl: 0 },
    { day: 15, pnl: 2800 },
    { day: 30, pnl: 6400 },
    { day: 45, pnl: 5200 }, // pullback
    { day: 60, pnl: 9800 },
    { day: 75, pnl: 14200 },
    { day: 90, pnl: 18600 },
    { day: 105, pnl: 16900 }, // pullback
    { day: 120, pnl: 23400 },
    { day: 135, pnl: 27800 },
    { day: 150, pnl: 31200 },
    { day: 165, pnl: 34500 },
    { day: 180, pnl: 39100 },
    { day: 190, pnl: 40100 },
    { day: 197, pnl: 42850.50 },
  ];

  for (let i = 0; i <= totalDays; i += 2) {
    const time = startTimestamp + (i / totalDays) * (endTimestamp - startTimestamp);
    const dateObj = new Date(time);
    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Interpolate milestones + add slight realistic noise
    let targetPnl = 0;
    for (let m = 0; m < milestones.length - 1; m++) {
      if (i >= milestones[m].day && i <= milestones[m + 1].day) {
        const ratio = (i - milestones[m].day) / (milestones[m + 1].day - milestones[m].day);
        targetPnl = milestones[m].pnl + ratio * (milestones[m + 1].pnl - milestones[m].pnl);
        break;
      }
    }
    if (i >= milestones[milestones.length - 1].day) {
      targetPnl = milestones[milestones.length - 1].pnl;
    }

    // Add tiny intra-week fluctuation
    const noise = Math.sin(i * 0.4) * 280;
    currentBal = INITIAL_STARTING_BALANCE + targetPnl + noise;
    if (i === totalDays) currentBal = INITIAL_STARTING_BALANCE + 42850.50;

    if (currentBal > peakBal) peakBal = currentBal;
    const dd = ((peakBal - currentBal) / peakBal) * 100;

    points.push({
      date: dateStr,
      timestamp: time,
      equity: Math.round(currentBal * 100) / 100,
      pnl: Math.round((currentBal - INITIAL_STARTING_BALANCE) * 100) / 100,
      drawdownPercent: Math.round(dd * 10) / 10,
    });
  }

  return points;
}

export function calculateMetrics(trades: Trade[]): MetricSummary {
  let netProfit = 0;
  let wins = 0;
  let losses = 0;
  let breakeven = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  let totalRr = 0;
  let largestWin = 0;
  let largestLoss = 0;

  // Streak
  let currentStreakType: 'WIN' | 'LOSS' = 'WIN';
  let streakCount = 0;

  trades.forEach((t, index) => {
    netProfit += t.pnl;
    if (t.outcome === 'WIN') {
      wins++;
      grossProfit += t.pnl;
      if (t.pnl > largestWin) largestWin = t.pnl;
      totalRr += Math.max(0, t.riskReward);
      if (index === 0) {
        currentStreakType = 'WIN';
        streakCount = 1;
      } else if (currentStreakType === 'WIN') {
        streakCount++;
      }
    } else if (t.outcome === 'LOSS') {
      losses++;
      grossLoss += Math.abs(t.pnl);
      if (Math.abs(t.pnl) > largestLoss) largestLoss = Math.abs(t.pnl);
      if (index === 0) {
        currentStreakType = 'LOSS';
        streakCount = 1;
      } else if (currentStreakType === 'LOSS') {
        streakCount++;
      }
    } else {
      breakeven++;
    }
  });

  const totalDecisive = wins + losses;
  const winRate = totalDecisive > 0 ? (wins / (wins + losses + breakeven)) * 100 : 0;
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 99 : 0;
  const avgRiskReward = wins > 0 ? totalRr / wins : 0;
  const avgWin = wins > 0 ? grossProfit / wins : 0;
  const avgLoss = losses > 0 ? grossLoss / losses : 0;

  return {
    netProfit: Math.round(netProfit * 100) / 100,
    profitChangePercent: 18.4, // +18.4% month
    totalTrades: trades.length,
    tradesThisWeek: 12,
    winRate: Math.round(winRate * 10) / 10,
    winRateChange: 3.2,
    profitFactor: Math.round(profitFactor * 100) / 100,
    profitFactorChange: 0.18,
    avgRiskReward: Math.round(avgRiskReward * 100) / 100,
    avgRiskRewardChange: 0.25,
    totalWins: wins,
    totalLosses: losses,
    totalBreakeven: breakeven,
    largestWin: Math.round(largestWin),
    largestLoss: Math.round(largestLoss),
    avgWin: Math.round(avgWin),
    avgLoss: Math.round(avgLoss),
    maxDrawdownPercent: 4.2,
    currentStreak: {
      type: currentStreakType,
      count: Math.max(1, streakCount),
    },
  };
}

export function getPairStats(trades: Trade[]): PairStat[] {
  const map: { [symbol: string]: { assetClass: AssetClassFilter; trades: number; wins: number; losses: number; pnl: number; totalRr: number } } = {};

  trades.forEach(t => {
    if (!map[t.symbol]) {
      map[t.symbol] = {
        assetClass: t.assetClass.toUpperCase() as AssetClassFilter,
        trades: 0,
        wins: 0,
        losses: 0,
        pnl: 0,
        totalRr: 0,
      };
    }
    map[t.symbol].trades++;
    map[t.symbol].pnl += t.pnl;
    if (t.outcome === 'WIN') {
      map[t.symbol].wins++;
      map[t.symbol].totalRr += Math.max(0, t.riskReward);
    } else if (t.outcome === 'LOSS') {
      map[t.symbol].losses++;
    }
  });

  return Object.entries(map).map(([symbol, data]) => {
    const wr = data.trades > 0 ? (data.wins / data.trades) * 100 : 0;
    const avgRr = data.wins > 0 ? data.totalRr / data.wins : 0;
    return {
      symbol,
      assetClass: (data.assetClass.toLowerCase()) as any,
      totalTrades: data.trades,
      wins: data.wins,
      losses: data.losses,
      winRate: Math.round(wr * 10) / 10,
      netPnl: Math.round(data.pnl * 100) / 100,
      avgRr: Math.round(avgRr * 100) / 100,
    };
  }).sort((a, b) => b.netPnl - a.netPnl);
}
