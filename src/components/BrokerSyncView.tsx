import React, { useState } from 'react';
import { 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  Server, 
  Plug,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  X,
  Activity,
  ArrowRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface BrokerConfig {
  platform: string;
  serverName: string;
  accountId: string;
}

export const BrokerSyncView: React.FC = () => {
  const [connectedBroker, setConnectedBroker] = useState<BrokerConfig | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState('Just now');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  // Add broker form state
  const [addForm, setAddForm] = useState({
    platform: 'MetaTrader 5',
    serverName: '',
    accountId: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced('Just now');
    }, 1200);
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.serverName || !addForm.accountId || !addForm.password) return;
    
    setIsSyncing(true);
    setShowAddModal(false);
    setTimeout(() => {
      setConnectedBroker({
        platform: addForm.platform,
        serverName: addForm.serverName,
        accountId: addForm.accountId.substring(0, 4) + '****'
      });
      setIsSyncing(false);
      setLastSynced('Just now');
    }, 1500);
  };

  const handleDisconnect = () => {
    setConnectedBroker(null);
    setShowDisconnectModal(false);
  };

  // Mock live trades for the table
  const liveTrades = [
    { id: 'pos-1', symbol: 'XAU/USD', direction: 'LONG', entry: '2345.50', current: '2352.10', volume: '1.50', pnl: 990.00 },
    { id: 'pos-2', symbol: 'EUR/USD', direction: 'SHORT', entry: '1.09200', current: '1.09150', volume: '3.00', pnl: 150.00 },
    { id: 'pos-3', symbol: 'US30', direction: 'LONG', entry: '39100', current: '39050', volume: '0.50', pnl: -250.00 },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. STATE LOGIC & CONDITIONAL RENDERING */}
      {!connectedBroker ? (
        // A) Disconnected State
        <div className="rounded-2xl border border-slate-800 bg-[#0e1422] p-10 flex flex-col items-center justify-center text-center shadow-xl min-h-[400px]">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 mb-6 relative">
            <Plug className="h-10 w-10 text-slate-500" />
            <div className="absolute top-2 right-2 w-3 h-3 bg-rose-500 rounded-full border-2 border-slate-900"></div>
          </div>
          <h2 className="text-2xl font-black text-white mb-3">No Broker Connected</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
            Link your MetaTrader 5 or exchange account to automatically stream live open trades and real-time floating PnL.
          </p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            <Plus className="h-5 w-5 stroke-[2.5]" />
            <span>Connect Broker</span>
          </button>
        </div>
      ) : (
        // B) Connected State
        <div className="space-y-6">
          {/* Active Broker Management Banner */}
          <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
            
            <div className="flex items-center gap-4 pl-3">
              <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                <Server className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-black text-white">{connectedBroker.serverName}</h3>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live & Synced
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
                  <span className="px-1.5 py-0.5 bg-slate-800 rounded">{connectedBroker.platform}</span>
                  <span>ID: {connectedBroker.accountId}</span>
                  <span className="flex items-center gap-1">
                    <RefreshCw className="h-3 w-3" /> Last sync: {lastSynced}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pl-3 lg:pl-0">
              <button
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
              
              <button
                onClick={() => setShowDisconnectModal(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 font-bold text-xs transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>

          {/* Live Trades Table */}
          <div className="rounded-xl border border-slate-800 bg-[#0e1422] shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-400" />
                <h3 className="text-white font-bold text-sm">Live Open Positions</h3>
              </div>
              <div className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                Floating PnL: +$890.00
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/30 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="p-4 pl-5">Pair</th>
                    <th className="p-4">Type</th>
                    <th className="p-4 text-right">Volume</th>
                    <th className="p-4 text-right">Entry</th>
                    <th className="p-4 text-right">Current Price</th>
                    <th className="p-4 pr-5 text-right">Floating PnL</th>
                  </tr>
                </thead>
                <tbody>
                  {liveTrades.map((trade) => {
                    const isLong = trade.direction === 'LONG';
                    const isWin = trade.pnl >= 0;
                    return (
                      <tr key={trade.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                        <td className="p-4 pl-5">
                          <span className="font-black text-white text-sm">{trade.symbol}</span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            isLong ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20' : 'text-orange-400 bg-orange-500/10 border border-orange-500/20'
                          }`}>
                            {isLong ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            {trade.direction}
                          </span>
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-slate-300">
                          {trade.volume}
                        </td>
                        <td className="p-4 text-right font-mono text-slate-400 text-xs">
                          {trade.entry}
                        </td>
                        <td className="p-4 text-right font-mono font-medium text-slate-200">
                          {trade.current}
                        </td>
                        <td className="p-4 pr-5 text-right font-mono font-black">
                          <span className={isWin ? 'text-emerald-400' : 'text-rose-400'}>
                            {isWin ? '+' : '-'}${Math.abs(trade.pnl).toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Security notice applies to both states */}
      <div className="rounded-xl border border-slate-800 bg-[#0e1422]/50 p-5">
        <div className="flex items-center gap-2 text-slate-300 font-bold text-xs mb-1">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Security & Read-Only Execution Protocol</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          TradeEdge connects exclusively through read-only telemetry API endpoints. Account withdrawal permissions and discretionary placing abilities are strictly prohibited and structurally rejected at network edge. All historical journal timestamps are cryptographically matched to exchange order books.
        </p>
      </div>

      {/* 2. ADD BROKER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#030712]/90 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          
          <div className="bg-[#0c101d] border border-slate-700 shadow-2xl rounded-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <h3 className="text-lg font-black text-white">Connect Broker Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleConnect} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Platform <span className="text-rose-500">*</span></label>
                  <select 
                    required
                    value={addForm.platform}
                    onChange={(e) => setAddForm({...addForm, platform: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500/50 font-medium"
                  >
                    <option>MetaTrader 5</option>
                    <option>MetaTrader 4</option>
                    <option>Binance</option>
                    <option>Bybit</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Broker / Server Name <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g., ICMarkets-Live01"
                    value={addForm.serverName}
                    onChange={(e) => setAddForm({...addForm, serverName: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500/50 font-medium placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Account Number / Login ID <span className="text-rose-500">*</span></label>
                  <input 
                    type="number" 
                    required
                    placeholder="e.g., 89230012"
                    value={addForm.accountId}
                    onChange={(e) => setAddForm({...addForm, accountId: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500/50 font-mono placeholder:text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Investor Password <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      placeholder="Enter investor password"
                      value={addForm.password}
                      onChange={(e) => setAddForm({...addForm, password: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-700 text-white text-sm rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-emerald-500/50 font-mono placeholder:text-slate-600"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 font-medium flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-emerald-500" />
                    Use your Read-Only/Investor password for safe read-only access
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-5 border-t border-slate-800 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-lg text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-lg text-sm font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)] flex items-center gap-2"
                >
                  Connect & Auto-Sync <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. DISCONNECT CONFIRMATION MODAL */}
      {showDisconnectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#030712]/90 backdrop-blur-sm" onClick={() => setShowDisconnectModal(false)}></div>
          
          <div className="bg-[#0c101d] border border-slate-700 shadow-2xl rounded-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="h-8 w-8 text-rose-500" />
            </div>
            
            <h3 className="text-xl font-black text-white mb-2">Disconnect Broker Account?</h3>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed px-4">
              Are you sure? Auto-sync will stop, and live open positions will no longer refresh automatically. Your historical logged trades will be preserved.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button 
                onClick={() => setShowDisconnectModal(false)}
                className="w-full px-5 py-3 rounded-xl text-sm font-bold bg-slate-800 text-white hover:bg-slate-700 transition-colors"
              >
                Keep Connected
              </button>
              <button 
                onClick={handleDisconnect}
                className="w-full px-5 py-3 rounded-xl text-sm font-bold bg-rose-500 text-white hover:bg-rose-400 transition-colors shadow-[0_0_15px_rgba(244,63,94,0.3)]"
              >
                Remove Broker
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
