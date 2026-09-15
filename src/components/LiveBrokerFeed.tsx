import React, { useState, useEffect } from 'react';
import { Activity, XCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface LiveTrade {
  id: string;
  pair: string;
  type: 'BUY' | 'SELL';
  lot: number;
  open: number;
  current: number;
  sl: number;
  tp: number;
  pnl: number;
}

export const LiveBrokerFeed: React.FC = () => {
  const [trades, setTrades] = useState<LiveTrade[]>([
    { id: '1', pair: 'EUR/USD', type: 'BUY', lot: 1.0, open: 1.0850, current: 1.0862, sl: 1.0820, tp: 1.0950, pnl: 120.00 },
    { id: '2', pair: 'XAU/USD', type: 'SELL', lot: 0.5, open: 2350.50, current: 2352.00, sl: 2360.00, tp: 2330.00, pnl: -75.00 },
    { id: '3', pair: 'NAS100', type: 'BUY', lot: 2.0, open: 17500.0, current: 17515.5, sl: 17400.0, tp: 17700.0, pnl: 62.00 }
  ]);
  
  const [totalPnl, setTotalPnl] = useState(107.00);
  const [trend, setTrend] = useState<'up' | 'down' | null>(null);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTrades(prevTrades => {
        let newTotal = 0;
        const updated = prevTrades.map(t => {
          // Add some random jitter to the current price
          const variance = t.current * 0.0002;
          const shift = (Math.random() - 0.5) * variance;
          const newCurrent = t.current + shift;
          
          // Re-calc PnL roughly
          let newPnl = t.pnl;
          if (t.pair === 'EUR/USD') {
            newPnl = t.type === 'BUY' ? (newCurrent - t.open) * 100000 * t.lot : (t.open - newCurrent) * 100000 * t.lot;
          } else if (t.pair === 'XAU/USD') {
            newPnl = t.type === 'BUY' ? (newCurrent - t.open) * 100 * t.lot : (t.open - newCurrent) * 100 * t.lot;
          } else {
            newPnl = t.type === 'BUY' ? (newCurrent - t.open) * 2 * t.lot : (t.open - newCurrent) * 2 * t.lot;
          }

          newTotal += newPnl;
          return { ...t, current: newCurrent, pnl: newPnl };
        });

        setTotalPnl(prev => {
          if (newTotal > prev) setTrend('up');
          else if (newTotal < prev) setTrend('down');
          
          setTimeout(() => setTrend(null), 1500);
          return newTotal;
        });

        return updated;
      });
    }, 3000); // Update every 3s

    return () => clearInterval(interval);
  }, []);

  const closeTrade = (id: string) => {
    setTrades(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="w-full mb-6 space-y-4">
      {/* Floating PnL Card */}
      <div className={`relative overflow-hidden rounded-2xl border transition-colors duration-500 bg-[#0e1422] ${
        trend === 'up' ? 'border-emerald-500/50 shadow-[0_0_25px_rgba(52,211,153,0.15)] bg-emerald-500/5' : 
        trend === 'down' ? 'border-rose-500/50 shadow-[0_0_25px_rgba(244,63,94,0.15)] bg-rose-500/5' : 
        'border-slate-800 shadow-xl'
      }`}>
        <div className="p-5 flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl border ${totalPnl >= 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
              <Activity className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Total Open Floating PnL</h2>
              <div className={`font-mono text-4xl sm:text-5xl font-black tracking-tight ${totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {totalPnl >= 0 ? '+' : '-'}${Math.abs(totalPnl).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Metrics Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 w-full md:w-auto mt-2 md:mt-0">
            <div className="bg-[#161f33]/60 px-4 py-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Open Positions</span>
              <span className="font-mono text-base font-bold text-white">{trades.length} Trades Running</span>
            </div>
            <div className="bg-[#161f33]/60 px-4 py-2.5 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Margin (Used / Free)</span>
              <span className="font-mono text-base font-bold text-white">$1,250 / $8,750</span>
            </div>
            <div className="bg-[#161f33]/60 px-4 py-2.5 rounded-xl border border-slate-800/80 col-span-2 md:col-span-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold block mb-0.5">Net Floating Pips/Pts</span>
              <span className={`font-mono text-base font-bold ${totalPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {totalPnl >= 0 ? '+' : '-'}{(Math.abs(totalPnl) / 10).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Broker Positions Feed (Table) */}
      <div className="bg-[#0e1422] rounded-xl border border-slate-800 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#161f33] border-b border-slate-800 text-xs uppercase font-bold text-slate-400">
              <tr>
                <th className="px-4 py-3">Pair / Symbol</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Lot Size</th>
                <th className="px-4 py-3">Open Price</th>
                <th className="px-4 py-3 text-cyan-400">Live Price</th>
                <th className="px-4 py-3">Stop Loss</th>
                <th className="px-4 py-3">Take Profit</th>
                <th className="px-4 py-3">Live PnL</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {trades.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500 font-sans">
                    No active positions running on this broker.
                  </td>
                </tr>
              ) : trades.map((trade) => (
                <tr key={trade.id} className="hover:bg-[#161f33]/40 transition-colors">
                  <td className="px-4 py-3 font-bold text-white font-sans">{trade.pair}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      trade.type === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{trade.lot.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-300">
                    {trade.pair.includes('JPY') ? trade.open.toFixed(3) : trade.open.toFixed(5)}
                  </td>
                  <td className={`px-4 py-3 font-bold transition-colors duration-300 ${
                    trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-cyan-400'
                  }`}>
                    {trade.pair.includes('JPY') ? trade.current.toFixed(3) : trade.current.toFixed(5)}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {trade.pair.includes('JPY') ? trade.sl.toFixed(3) : trade.sl.toFixed(5)}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {trade.pair.includes('JPY') ? trade.tp.toFixed(3) : trade.tp.toFixed(5)}
                  </td>
                  <td className={`px-4 py-3 font-bold ${trade.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {trade.pnl >= 0 ? '+' : '-'}${Math.abs(trade.pnl).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => closeTrade(trade.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-slate-700 hover:border-rose-500/50 rounded flex items-center gap-1.5 transition-colors font-sans text-xs ml-auto"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Close Position
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
