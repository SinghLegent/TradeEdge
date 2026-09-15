import React from 'react';
import { Network, Info } from 'lucide-react';

const PAIRS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'NAS100', 'BTC/USD'];

const CORRELATION_DATA: Record<string, Record<string, number>> = {
  'EUR/USD': { 'EUR/USD': 1.00, 'GBP/USD': 0.85, 'USD/JPY': -0.25, 'XAU/USD': 0.60, 'NAS100': 0.35, 'BTC/USD': 0.20 },
  'GBP/USD': { 'EUR/USD': 0.85, 'GBP/USD': 1.00, 'USD/JPY': -0.15, 'XAU/USD': 0.50, 'NAS100': 0.45, 'BTC/USD': 0.30 },
  'USD/JPY': { 'EUR/USD': -0.25, 'GBP/USD': -0.15, 'USD/JPY': 1.00, 'XAU/USD': -0.45, 'NAS100': 0.10, 'BTC/USD': 0.05 },
  'XAU/USD': { 'EUR/USD': 0.60, 'GBP/USD': 0.50, 'USD/JPY': -0.45, 'XAU/USD': 1.00, 'NAS100': 0.15, 'BTC/USD': 0.40 },
  'NAS100':  { 'EUR/USD': 0.35, 'GBP/USD': 0.45, 'USD/JPY': 0.10, 'XAU/USD': 0.15, 'NAS100': 1.00, 'BTC/USD': 0.75 },
  'BTC/USD': { 'EUR/USD': 0.20, 'GBP/USD': 0.30, 'USD/JPY': 0.05, 'XAU/USD': 0.40, 'NAS100': 0.75, 'BTC/USD': 1.00 }
};

const getCellStyles = (val: number) => {
  if (val === 1) return 'bg-slate-800 text-slate-500 border-slate-800';
  if (val > 0.7) return 'bg-emerald-500/80 text-white font-bold border-emerald-400 shadow-[inset_0_0_10px_rgba(52,211,153,0.3)]';
  if (val > 0.3) return 'bg-emerald-500/40 text-emerald-100 border-emerald-500/50';
  if (val > 0) return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
  if (val < -0.7) return 'bg-rose-500/80 text-white font-bold border-rose-400 shadow-[inset_0_0_10px_rgba(244,63,94,0.3)]';
  if (val < -0.3) return 'bg-rose-500/40 text-rose-100 border-rose-500/50';
  if (val < 0) return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
  return 'bg-slate-800 text-slate-400 border-slate-700';
};

export const CorrelationMatrix: React.FC = () => {
  return (
    <div className="bg-[#0e1422] rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col h-full w-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Network className="h-4 w-4 text-cyan-400" />
          Exposure &amp; Correlation
        </h2>
        <span className="text-[10px] text-slate-500 uppercase font-semibold flex items-center gap-1">
          <Info className="h-3 w-3" /> Standard Market Matrix
        </span>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar pb-2">
        <div className="min-w-[400px]">
          {/* Header Row */}
          <div className="flex">
            <div className="w-20 shrink-0"></div>
            {PAIRS.map(col => (
              <div key={`header-${col}`} className="flex-1 text-center py-2 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                {col}
              </div>
            ))}
          </div>

          {/* Grid Rows */}
          <div className="space-y-1">
            {PAIRS.map(row => (
              <div key={`row-${row}`} className="flex items-center">
                <div className="w-20 shrink-0 text-[10px] font-bold text-slate-300">
                  {row}
                </div>
                {PAIRS.map(col => {
                  const val = CORRELATION_DATA[row][col];
                  const isDiagonal = row === col;
                  return (
                    <div key={`cell-${row}-${col}`} className="flex-1 p-0.5">
                      <div 
                        title={`${row} & ${col}: ${isDiagonal ? 'Identical' : (val > 0 ? '+' : '') + val.toFixed(2)}`}
                        className={`w-full flex items-center justify-center py-2.5 rounded-md border text-[11px] font-mono transition-all hover:scale-105 cursor-default ${getCellStyles(val)}`}
                      >
                        {isDiagonal ? '-' : (val > 0 ? '+' : '') + val.toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-center gap-4 text-[9px] uppercase font-bold text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 bg-emerald-500/80 rounded-sm"></div>
          <span>High Pos (+0.7 to 1.0)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 bg-emerald-500/40 rounded-sm"></div>
          <span>Mod Pos (+0.3 to 0.7)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 bg-slate-800 rounded-sm border border-slate-700"></div>
          <span>Neutral</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 bg-rose-500/40 rounded-sm"></div>
          <span>Mod Neg (-0.3 to -0.7)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 bg-rose-500/80 rounded-sm"></div>
          <span>High Neg (-0.7 to -1.0)</span>
        </div>
      </div>
    </div>
  );
};
