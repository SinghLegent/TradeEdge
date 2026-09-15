import React, { useState, useMemo } from 'react';
import { 
  BarChart2, 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  ChevronRight,
  Filter
} from 'lucide-react';
import { PairStat, AssetClassFilter } from '../types';

interface PairPerformanceChartProps {
  pairs: PairStat[];
  assetFilter: AssetClassFilter;
}

export const PairPerformanceChart: React.FC<PairPerformanceChartProps> = ({
  pairs,
  assetFilter,
}) => {
  const [sortBy, setSortBy] = useState<'pnl' | 'trades' | 'winrate'>('pnl');
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);

  // Filter by asset class if active
  const filteredPairs = useMemo(() => {
    let list = pairs;
    if (assetFilter !== 'ALL') {
      const match = assetFilter.toLowerCase();
      list = pairs.filter(p => p.assetClass === match);
    }

    return [...list].sort((a, b) => {
      if (sortBy === 'pnl') return b.netPnl - a.netPnl;
      if (sortBy === 'trades') return b.totalTrades - a.totalTrades;
      if (sortBy === 'winrate') return b.winRate - a.winRate;
      return 0;
    });
  }, [pairs, assetFilter, sortBy]);

  // Max absolute PnL to scale bar widths
  const maxAbsPnl = useMemo(() => {
    if (!filteredPairs.length) return 1000;
    const max = Math.max(...filteredPairs.map(p => Math.abs(p.netPnl)));
    return max > 0 ? max : 1000;
  }, [filteredPairs]);

  return (
    <section 
      id="section-pair-performance"
      className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 sm:p-6 shadow-xl transition-all flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">Performance by Pair</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Net PnL distribution across high-frequency instruments
          </p>
        </div>

        {/* Sorting buttons */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setSortBy('pnl')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              sortBy === 'pnl' ? 'bg-slate-800 text-emerald-400 shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            PnL
          </button>
          <button
            onClick={() => setSortBy('winrate')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              sortBy === 'winrate' ? 'bg-slate-800 text-emerald-400 shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Win Rate
          </button>
          <button
            onClick={() => setSortBy('trades')}
            className={`px-2.5 py-1 rounded font-medium transition-all ${
              sortBy === 'trades' ? 'bg-slate-800 text-emerald-400 shadow-xs' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Volume
          </button>
        </div>
      </div>

      {/* Bar Chart Representation */}
      <div className="mt-4 flex-1 space-y-3.5">
        {filteredPairs.slice(0, 7).map((pair) => {
          const isPositive = pair.netPnl >= 0;
          const barWidthPercent = Math.min(100, Math.max(8, (Math.abs(pair.netPnl) / maxAbsPnl) * 100));
          const isHovered = hoveredSymbol === pair.symbol;

          return (
            <div
              key={pair.symbol}
              onMouseEnter={() => setHoveredSymbol(pair.symbol)}
              onMouseLeave={() => setHoveredSymbol(null)}
              className={`p-2.5 rounded-lg border transition-all ${
                isHovered
                  ? 'bg-slate-800/60 border-slate-700 shadow-md'
                  : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900/70'
              }`}
            >
              {/* Pair top row: Symbol, Asset Tag, Win Rate, and Net PnL */}
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-white text-sm tracking-tight">{pair.symbol}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    pair.assetClass === 'crypto' 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                      : pair.assetClass === 'forex' 
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                      : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  }`}>
                    {pair.assetClass}
                  </span>
                  <span className="text-slate-400 text-[11px] font-mono hidden sm:inline">
                    {pair.totalTrades} trades
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] font-mono text-slate-400 mr-2">
                      WR: <span className="text-slate-200 font-semibold">{pair.winRate}%</span>
                    </span>
                    <span className={`text-sm font-bold font-mono ${
                      isPositive ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {isPositive ? '+' : ''}${pair.netPnl.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar visualizer */}
              <div className="relative h-2.5 w-full rounded-full bg-slate-950 overflow-hidden">
                {/* Zero center axis or bar fill */}
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isPositive 
                      ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.4)]' 
                      : 'bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                  }`}
                  style={{ width: `${barWidthPercent}%` }}
                />
              </div>

              {/* Sub metrics when hovered */}
              {isHovered && (
                <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Record: <span className="text-emerald-400">{pair.wins}W</span> / <span className="text-rose-400">{pair.losses}L</span></span>
                  <span>Avg RR: <span className="text-white">1:{pair.avgRr}</span></span>
                  <span>Avg/Trade: <span className={pair.netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    ${(pair.netPnl / pair.totalTrades).toFixed(1)}
                  </span></span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer info */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span className="text-slate-400">Best Edge: <span className="text-emerald-400 font-bold">BTC/USDT</span> (+$15.4k)</span>
        <span className="text-slate-400">Lowest: <span className="text-rose-400 font-medium">GBP/JPY</span> (-$1.2k)</span>
      </div>
    </section>
  );
};
