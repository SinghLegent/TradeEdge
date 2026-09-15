import React, { useState } from 'react';
import { 
  PieChart, 
  Award, 
  ShieldAlert, 
  MinusCircle, 
  Flame,
  Scale,
  Sparkles
} from 'lucide-react';
import { MetricSummary } from '../types';

interface WinLossDonutProps {
  metrics: MetricSummary;
}

export const WinLossDonut: React.FC<WinLossDonutProps> = ({ metrics }) => {
  const [activeSegment, setActiveSegment] = useState<'all' | 'wins' | 'losses' | 'breakeven'>('all');

  const total = metrics.totalTrades || 1;
  const winPct = (metrics.totalWins / total) * 100;
  const lossPct = (metrics.totalLosses / total) * 100;
  const bePct = (metrics.totalBreakeven / total) * 100;

  // SVG Donut geometry
  const size = 200;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Arc stroke dash lengths
  const winStroke = (winPct / 100) * circumference;
  const lossStroke = (lossPct / 100) * circumference;
  const beStroke = (bePct / 100) * circumference;

  // Offsets (starting at top: -90 deg rotate)
  const winOffset = 0;
  const lossOffset = -winStroke;
  const beOffset = -(winStroke + lossStroke);

  return (
    <section 
      id="section-win-loss-ratio"
      className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 sm:p-6 shadow-xl transition-all flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <PieChart className="h-4 w-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">Win / Loss Ratio</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistical distribution and payoff expectancy
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400 font-mono">
          <Flame className="h-3.5 w-3.5 text-emerald-400 fill-emerald-400" />
          <span>{metrics.currentStreak.count} {metrics.currentStreak.type} Streak</span>
        </div>
      </div>

      {/* Main visual section: Donut + Legend */}
      <div className="mt-4 flex-1 flex flex-col sm:flex-row items-center justify-around gap-6">
        {/* SVG Donut */}
        <div className="relative flex items-center justify-center">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="transform -rotate-90"
          >
            <defs>
              <filter id="winGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#10b981" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#1e293b"
              strokeWidth={strokeWidth}
            />

            {/* Breakeven Segment */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth={activeSegment === 'breakeven' ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={`${beStroke} ${circumference - beStroke}`}
              strokeDashoffset={beOffset}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              opacity={activeSegment === 'all' || activeSegment === 'breakeven' ? 0.9 : 0.25}
              onMouseEnter={() => setActiveSegment('breakeven')}
              onMouseLeave={() => setActiveSegment('all')}
            />

            {/* Loss Segment */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#f43f5e"
              strokeWidth={activeSegment === 'losses' ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={`${lossStroke} ${circumference - lossStroke}`}
              strokeDashoffset={lossOffset}
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              opacity={activeSegment === 'all' || activeSegment === 'losses' ? 0.95 : 0.25}
              onMouseEnter={() => setActiveSegment('losses')}
              onMouseLeave={() => setActiveSegment('all')}
            />

            {/* Win Segment (on top with neon glow) */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="#10b981"
              strokeWidth={activeSegment === 'wins' ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={`${winStroke} ${circumference - winStroke}`}
              strokeDashoffset={winOffset}
              filter="url(#winGlow)"
              className="cursor-pointer transition-all duration-300 hover:opacity-100"
              opacity={activeSegment === 'all' || activeSegment === 'wins' ? 1 : 0.25}
              onMouseEnter={() => setActiveSegment('wins')}
              onMouseLeave={() => setActiveSegment('all')}
            />
          </svg>

          {/* Center Text inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none select-none">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {activeSegment === 'wins' ? 'Wins' : activeSegment === 'losses' ? 'Losses' : activeSegment === 'breakeven' ? 'Breakeven' : 'Win Rate'}
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              {activeSegment === 'wins'
                ? `${winPct.toFixed(1)}%`
                : activeSegment === 'losses'
                ? `${lossPct.toFixed(1)}%`
                : activeSegment === 'breakeven'
                ? `${bePct.toFixed(1)}%`
                : `${metrics.winRate}%`}
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {activeSegment === 'wins'
                ? `${metrics.totalWins} Trades`
                : activeSegment === 'losses'
                ? `${metrics.totalLosses} Trades`
                : activeSegment === 'breakeven'
                ? `${metrics.totalBreakeven} Trades`
                : `${metrics.totalTrades} Total`}
            </span>
          </div>
        </div>

        {/* Legend & Percentage breakdown */}
        <div className="w-full sm:w-auto flex-1 space-y-2.5">
          {/* Win Row */}
          <div 
            onMouseEnter={() => setActiveSegment('wins')}
            onMouseLeave={() => setActiveSegment('all')}
            className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
              activeSegment === 'wins' ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-slate-900/50 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span className="text-xs font-semibold text-slate-200">Wins</span>
            </div>
            <div className="flex items-center gap-3 font-mono">
              <span className="text-xs text-slate-400">{metrics.totalWins} trades</span>
              <span className="text-xs font-bold text-emerald-400 w-12 text-right">{winPct.toFixed(1)}%</span>
            </div>
          </div>

          {/* Loss Row */}
          <div 
            onMouseEnter={() => setActiveSegment('losses')}
            onMouseLeave={() => setActiveSegment('all')}
            className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
              activeSegment === 'losses' ? 'bg-rose-500/10 border-rose-500/40' : 'bg-slate-900/50 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-rose-400"></span>
              <span className="text-xs font-semibold text-slate-200">Losses</span>
            </div>
            <div className="flex items-center gap-3 font-mono">
              <span className="text-xs text-slate-400">{metrics.totalLosses} trades</span>
              <span className="text-xs font-bold text-rose-400 w-12 text-right">{lossPct.toFixed(1)}%</span>
            </div>
          </div>

          {/* Breakeven Row */}
          <div 
            onMouseEnter={() => setActiveSegment('breakeven')}
            onMouseLeave={() => setActiveSegment('all')}
            className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
              activeSegment === 'breakeven' ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-900/50 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-amber-400"></span>
              <span className="text-xs font-semibold text-slate-200">Breakeven</span>
            </div>
            <div className="flex items-center gap-3 font-mono">
              <span className="text-xs text-slate-400">{metrics.totalBreakeven} trades</span>
              <span className="text-xs font-bold text-amber-400 w-12 text-right">{bePct.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payoff ratio & statistical edge block */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block uppercase">Avg Win / Avg Loss</span>
          <span className="text-sm font-bold text-white mt-0.5 block">
            ${metrics.avgWin} <span className="text-slate-500">vs</span> ${metrics.avgLoss}
          </span>
          <span className="text-[10px] text-emerald-400 mt-0.5 block font-semibold">
            {metrics.avgLoss > 0 ? (metrics.avgWin / metrics.avgLoss).toFixed(2) : '2.0'}x Payoff Ratio
          </span>
        </div>

        <div className="p-2 rounded bg-slate-900/60 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 block uppercase">Trade Expectancy</span>
          <span className="text-sm font-bold text-emerald-400 mt-0.5 block">
            +${((winPct/100 * metrics.avgWin) - (lossPct/100 * metrics.avgLoss)).toFixed(2)}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            Per executed order
          </span>
        </div>
      </div>
    </section>
  );
};
