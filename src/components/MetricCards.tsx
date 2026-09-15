import React from 'react';
import { 
  DollarSign, 
  BarChart3, 
  Percent, 
  Scale, 
  Target,
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp
} from 'lucide-react';
import { MetricSummary } from '../types';

interface MetricCardsProps {
  metrics: MetricSummary;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  const isProfitPositive = metrics.netProfit >= 0;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Net Profit Card */}
      <div 
        id="metric-net-profit"
        className="relative overflow-hidden rounded-xl border border-emerald-500/30 bg-gradient-to-b from-[#111927] to-[#0c121d] p-5 shadow-lg transition-all duration-200 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Net Profit</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <h3 className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${isProfitPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isProfitPositive ? '+' : ''}${Math.abs(metrics.netProfit).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-800/80">
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+{metrics.profitChangePercent}%</span>
            <span className="text-slate-500 font-normal ml-0.5">this month</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Max DD: <span className="text-slate-300 font-medium">{metrics.maxDrawdownPercent}%</span>
          </span>
        </div>
      </div>

      {/* 2. Total Trades Card */}
      <div 
        id="metric-total-trades"
        className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#0e1422] p-5 shadow-sm transition-all duration-200 hover:border-slate-700 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Total Trades</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <BarChart3 className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
            {metrics.totalTrades}
          </h3>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-800/80">
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+{metrics.tradesThisWeek}</span>
            <span className="text-slate-500 font-normal ml-0.5">this week</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            <span className="text-emerald-400">{metrics.totalWins}W</span> / <span className="text-rose-400">{metrics.totalLosses}L</span> / <span className="text-amber-400">{metrics.totalBreakeven}BE</span>
          </span>
        </div>
      </div>

      {/* 3. Win Rate (%) Card */}
      <div 
        id="metric-win-rate"
        className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#0e1422] p-5 shadow-sm transition-all duration-200 hover:border-slate-700 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Win Rate (%)</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Percent className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              {metrics.winRate}%
            </h3>
            <span className="text-xs font-medium text-slate-400">decisive</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-800/80">
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+{metrics.winRateChange}%</span>
            <span className="text-slate-500 font-normal ml-0.5">vs avg</span>
          </div>
          <span className="text-[11px] font-medium text-emerald-400/90 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
            {metrics.currentStreak.count} {metrics.currentStreak.type} Streak
          </span>
        </div>
      </div>

      {/* 4. Profit Factor Card */}
      <div 
        id="metric-profit-factor"
        className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#0e1422] p-5 shadow-sm transition-all duration-200 hover:border-slate-700 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Profit Factor</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Scale className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              {metrics.profitFactor}
            </h3>
            <span className="text-xs font-semibold text-emerald-400">High Edge</span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-800/80">
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+{metrics.profitFactorChange}</span>
            <span className="text-slate-500 font-normal ml-0.5">trend</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Benchmark: <span className="text-slate-300 font-medium">&gt; 1.50</span>
          </span>
        </div>
      </div>

      {/* 5. Average RR (Risk/Reward) Card */}
      <div 
        id="metric-avg-rr"
        className="relative overflow-hidden rounded-xl border border-slate-800 bg-[#0e1422] p-5 shadow-sm transition-all duration-200 hover:border-slate-700 group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Average RR</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Target className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              1 : {metrics.avgRiskReward}
            </h3>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-slate-800/80">
          <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span>+{metrics.avgRiskRewardChange}R</span>
            <span className="text-slate-500 font-normal ml-0.5">vs baseline</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Win/Loss: <span className="text-slate-300 font-medium">{metrics.avgLoss > 0 ? (metrics.avgWin / metrics.avgLoss).toFixed(2) : '2.0'}x</span>
          </span>
        </div>
      </div>
    </section>
  );
};
