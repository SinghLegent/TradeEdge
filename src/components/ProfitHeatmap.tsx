import React, { useMemo } from 'react';
import { Trade } from '../types';
import { Calendar } from 'lucide-react';

interface ProfitHeatmapProps {
  trades: Trade[];
}

interface DayData {
  date: Date;
  pnl: number;
  tradesCount: number;
}

export const ProfitHeatmap: React.FC<ProfitHeatmapProps> = ({ trades }) => {
  // Generate the last 49 days of data
  const heatmapData = useMemo(() => {
    const days: DayData[] = [];
    const today = new Date();
    // Normalize today to start of day
    today.setHours(0, 0, 0, 0);

    for (let i = 48; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push({
        date: d,
        pnl: 0,
        tradesCount: 0,
      });
    }

    // Map trades to days
    trades.forEach(trade => {
      const tradeDate = new Date(trade.date);
      tradeDate.setHours(0, 0, 0, 0);
      
      const timeDiff = today.getTime() - tradeDate.getTime();
      const daysAgo = Math.round(timeDiff / (1000 * 3600 * 24));
      
      if (daysAgo >= 0 && daysAgo < 49) {
        const index = 48 - daysAgo;
        days[index].pnl += trade.pnl;
        days[index].tradesCount += 1;
      }
    });

    return days;
  }, [trades]);

  // Determine intensity classes based on PnL
  const getCellClass = (pnl: number, count: number) => {
    if (count === 0) return 'bg-slate-800/40 border-slate-800 hover:border-slate-600'; // No activity
    if (pnl === 0) return 'bg-slate-700/50 border-slate-600'; // Breakeven

    if (pnl > 0) {
      if (pnl > 500) return 'bg-emerald-400 border-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.3)]';
      if (pnl > 100) return 'bg-emerald-500/80 border-emerald-400/80';
      return 'bg-emerald-700/60 border-emerald-600/60';
    } else {
      if (pnl < -500) return 'bg-rose-500 border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]';
      if (pnl < -100) return 'bg-rose-600/80 border-rose-500/80';
      return 'bg-rose-900/60 border-rose-800/60';
    }
  };

  return (
    <div className="bg-[#0e1422] rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Calendar className="h-4 w-4 text-emerald-400" />
          49-Day Intensity
        </h2>
        <span className="text-[10px] text-slate-500 uppercase font-semibold">P/L Heatmap</span>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center">
        {/* 7x7 Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {heatmapData.map((day, idx) => (
            <div
              key={idx}
              title={`${day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${
                day.tradesCount > 0 
                  ? (day.pnl >= 0 ? '+' : '') + '$' + day.pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : 'No trades'
              }`}
              className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7 rounded-sm border transition-colors cursor-crosshair ${getCellClass(day.pnl, day.tradesCount)}`}
            />
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-3 mt-6 text-[9px] uppercase font-bold text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>Loss</span>
            <div className="flex gap-0.5">
              <div className="h-2 w-2 rounded-sm bg-rose-500"></div>
              <div className="h-2 w-2 rounded-sm bg-rose-700/60"></div>
            </div>
          </div>
          <div className="h-3 w-px bg-slate-800"></div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-sm bg-slate-800/40 border border-slate-800"></div>
            <span>None</span>
          </div>
          <div className="h-3 w-px bg-slate-800"></div>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              <div className="h-2 w-2 rounded-sm bg-emerald-700/60"></div>
              <div className="h-2 w-2 rounded-sm bg-emerald-400"></div>
            </div>
            <span>Profit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
