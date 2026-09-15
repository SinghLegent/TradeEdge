import React, { useState } from 'react';
import { 
  RefreshCw, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Server, 
  Cpu, 
  Key, 
  ExternalLink,
  Zap
} from 'lucide-react';

export const BrokerSyncView: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState('32 seconds ago');
  const [autoSync, setAutoSync] = useState(true);

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced('Just now');
    }, 1200);
  };

  const brokers = [
    {
      id: 'mt5',
      name: 'MetaTrader 5 Bridge',
      provider: 'IC Markets (Raw Spread Server)',
      type: 'Forex & Commodities',
      accountNumber: '8492019',
      status: 'CONNECTED',
      ping: '14ms',
      tradesImported: 94,
      lastOrder: '2026-09-14 10:30',
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    },
    {
      id: 'binance',
      name: 'Binance Futures API',
      provider: 'Binance USD-M Futures',
      type: 'Crypto Perpetual Swaps',
      accountNumber: 'api_***90x2',
      status: 'CONNECTED',
      ping: '22ms',
      tradesImported: 62,
      lastOrder: '2026-09-14 14:15',
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      id: 'ibkr',
      name: 'Interactive Brokers TWS',
      provider: 'IBKR Pro Gate',
      type: 'Equities & US Indices',
      accountNumber: 'U9812401',
      status: 'CONNECTED',
      ping: '38ms',
      tradesImported: 28,
      lastOrder: '2026-09-12 15:40',
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 'webhook',
      name: 'TradingView Webhook Listener',
      provider: 'Pine Script Alert Engine',
      type: 'Automated Signal Intake',
      accountNumber: 'hook_secret_v4',
      status: 'ACTIVE',
      ping: '9ms',
      tradesImported: 184,
      lastOrder: 'Live Realtime',
      iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Sync Controls */}
      <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Broker &amp; Exchange Synchronization</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time automated trade import via low-latency FIX/WebSocket bridges. Ensures zero missed fills, exact slippage tracking, and automated commission reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs font-mono">
            <span className="text-slate-400 block text-[11px]">Last Synchronized</span>
            <span className="text-slate-200 font-semibold">{lastSynced}</span>
          </div>

          <button
            id="sync-now-btn"
            onClick={handleSyncNow}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Feeds...' : 'Sync All Accounts'}</span>
          </button>
        </div>
      </div>

      {/* Connected Brokers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {brokers.map((broker) => (
          <div
            key={broker.id}
            className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${broker.iconColor}`}>
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{broker.name}</h3>
                    <p className="text-xs text-slate-400">{broker.provider}</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 font-mono">
                  <CheckCircle2 className="h-3 w-3" />
                  {broker.status}
                </span>
              </div>

              {/* Specs */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block">Account / Token</span>
                  <span className="text-slate-200 font-medium">{broker.accountNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Round-Trip Latency</span>
                  <span className="text-emerald-400 font-semibold">{broker.ping}</span>
                </div>
                <div className="mt-1">
                  <span className="text-[10px] text-slate-400 block">Trades Recorded</span>
                  <span className="text-white font-bold">{broker.tradesImported} trades</span>
                </div>
                <div className="mt-1">
                  <span className="text-[10px] text-slate-400 block">Latest Fill</span>
                  <span className="text-slate-300">{broker.lastOrder}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">{broker.type}</span>
              <button className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1">
                <span>Configure Bridge</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Webhook & Security card */}
      <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Security &amp; Read-Only Execution Protocol</span>
        </div>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          TradeEdge connects exclusively through read-only telemetry API endpoints. Account withdrawal permissions and discretionary placing abilities are strictly prohibited and structurally rejected at network edge. All historical journal timestamps are cryptographically matched to exchange order books.
        </p>
      </div>
    </div>
  );
};
