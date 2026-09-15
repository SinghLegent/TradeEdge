export type AssetClass = 'forex' | 'crypto' | 'stock';

export type TradeOutcome = 'WIN' | 'LOSS' | 'BREAKEVEN';

export type TradeDirection = 'LONG' | 'SHORT';

export interface Trade {
  id: string;
  date: string;
  timestamp: number;
  symbol: string;
  assetClass: AssetClass;
  direction: TradeDirection;
  entryPrice: number;
  exitPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  lotSize?: number;
  pnl: number;
  pnlPercent: number;
  outcome: TradeOutcome;
  riskReward: number; // e.g., 2.5
  setup: string; // e.g. "Liquidity Sweep", "Fair Value Gap", "Break & Retest"
  timeframe: string; // e.g. "15m", "1h", "4h"
  notes?: string;
  chartScreenshot?: string;
  status: 'CLOSED' | 'OPEN';
  duration?: string;
}

export interface MetricSummary {
  netProfit: number;
  profitChangePercent: number;
  totalTrades: number;
  tradesThisWeek: number;
  winRate: number;
  winRateChange: number;
  profitFactor: number;
  profitFactorChange: number;
  avgRiskReward: number;
  avgRiskRewardChange: number;
  totalWins: number;
  totalLosses: number;
  totalBreakeven: number;
  largestWin: number;
  largestLoss: number;
  avgWin: number;
  avgLoss: number;
  maxDrawdownPercent: number;
  currentStreak: {
    type: 'WIN' | 'LOSS';
    count: number;
  };
}

export interface EquityPoint {
  date: string;
  timestamp: number;
  equity: number;
  pnl: number;
  drawdownPercent: number;
  tradeSymbol?: string;
  tradeOutcome?: TradeOutcome;
}

export interface PairStat {
  symbol: string;
  assetClass: AssetClass;
  totalTrades: number;
  wins: number;
  losses: number;
  winRate: number;
  netPnl: number;
  avgRr: number;
}

export type TimeframeFilter = '1W' | '1M' | 'YTD' | 'ALL';
export type AssetClassFilter = 'ALL' | 'FOREX' | 'CRYPTO' | 'STOCKS';
export type ActiveTab = 'dashboard' | 'trade_log' | 'broker_sync' | 'calculator' | 'settings' | 'chart_gallery';
