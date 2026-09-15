import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Plus, Trash2, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

interface Alert {
  id: string;
  pair: string;
  condition: 'ABOVE' | 'BELOW';
  target: number;
  status: 'ACTIVE' | 'TRIGGERED';
}

const PAIRS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'NAS100', 'BTC/USD'];
const INITIAL_PRICES: Record<string, number> = {
  'EUR/USD': 1.0850,
  'GBP/USD': 1.2650,
  'USD/JPY': 150.25,
  'XAU/USD': 2350.00,
  'NAS100': 17500.0,
  'BTC/USD': 65000.00
};

export const PriceAlertManager: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', pair: 'EUR/USD', condition: 'ABOVE', target: 1.0900, status: 'ACTIVE' },
    { id: '2', pair: 'XAU/USD', condition: 'BELOW', target: 2340.00, status: 'ACTIVE' },
    { id: '3', pair: 'BTC/USD', condition: 'ABOVE', target: 66000.00, status: 'ACTIVE' }
  ]);
  
  const [prices, setPrices] = useState<Record<string, number>>(INITIAL_PRICES);
  const [newPair, setNewPair] = useState(PAIRS[0]);
  const [newCondition, setNewCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [newTarget, setNewTarget] = useState('');

  // Simulate price fluctuations and trigger alerts
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prevPrices => {
        const updatedPrices = { ...prevPrices };
        let pricesChanged = false;

        // Fluctuate prices slightly
        PAIRS.forEach(pair => {
          const current = updatedPrices[pair];
          const variance = current * 0.0005; // 0.05% fluctuation
          const change = (Math.random() - 0.5) * variance;
          updatedPrices[pair] = current + change;
          pricesChanged = true;
        });

        // Check alerts
        setAlerts(prevAlerts => {
          let alertsUpdated = false;
          const newAlerts = prevAlerts.map(alert => {
            if (alert.status === 'TRIGGERED') return alert;
            
            const currentPrice = updatedPrices[alert.pair];
            let triggered = false;
            
            if (alert.condition === 'ABOVE' && currentPrice >= alert.target) {
              triggered = true;
            } else if (alert.condition === 'BELOW' && currentPrice <= alert.target) {
              triggered = true;
            }

            if (triggered) {
              alertsUpdated = true;
              return { ...alert, status: 'TRIGGERED' as const };
            }
            return alert;
          });

          return alertsUpdated ? newAlerts : prevAlerts;
        });

        return updatedPrices;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleAddAlert = () => {
    const targetVal = parseFloat(newTarget);
    if (isNaN(targetVal) || targetVal <= 0) return;

    setAlerts(prev => [
      {
        id: Date.now().toString(),
        pair: newPair,
        condition: newCondition,
        target: targetVal,
        status: 'ACTIVE'
      },
      ...prev
    ]);
    setNewTarget('');
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const triggeredCount = alerts.filter(a => a.status === 'TRIGGERED').length;

  return (
    <div className="bg-[#0e1422] rounded-2xl border border-slate-800 p-5 shadow-lg flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Bell className="h-4 w-4 text-cyan-400" />
          Price Alerts
        </h2>
        <div className="flex items-center gap-2">
          {triggeredCount > 0 && (
            <span className="flex items-center gap-1 bg-rose-500/20 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30 animate-pulse">
              <BellRing className="h-3 w-3" />
              {triggeredCount} Triggered
            </span>
          )}
        </div>
      </div>

      {/* Add Alert Form */}
      <div className="flex gap-2 mb-4 bg-[#161f33] p-2 rounded-xl border border-slate-800/80">
        <select 
          value={newPair}
          onChange={(e) => setNewPair(e.target.value)}
          className="bg-[#0e1422] border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-cyan-500 w-24"
        >
          {PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        
        <select
          value={newCondition}
          onChange={(e) => setNewCondition(e.target.value as 'ABOVE' | 'BELOW')}
          className="bg-[#0e1422] border border-slate-700 text-slate-300 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-cyan-500 w-24"
        >
          <option value="ABOVE">Crosses &ge;</option>
          <option value="BELOW">Crosses &le;</option>
        </select>

        <input 
          type="number" 
          value={newTarget}
          onChange={(e) => setNewTarget(e.target.value)}
          placeholder={`e.g. ${(prices[newPair] || 0).toFixed(4)}`}
          className="flex-1 bg-[#0e1422] border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 min-w-0 placeholder:text-slate-600 font-mono"
        />

        <button 
          onClick={handleAddAlert}
          disabled={!newTarget}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-1.5 rounded-lg transition-colors flex items-center justify-center shrink-0"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 -mr-1 space-y-2 max-h-64">
        {alerts.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs font-medium">
            No active price alerts.
          </div>
        ) : (
          alerts.map(alert => (
            <div 
              key={alert.id} 
              className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                alert.status === 'TRIGGERED' 
                  ? 'bg-rose-500/10 border-rose-500/30' 
                  : 'bg-[#161f33]/60 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${alert.condition === 'ABOVE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {alert.condition === 'ABOVE' ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{alert.pair}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      alert.status === 'TRIGGERED' 
                        ? 'bg-rose-500 text-white' 
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {alert.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-mono">
                    <span>Target: <span className="text-slate-300 font-semibold">{alert.target}</span></span>
                    <span className="text-slate-600">•</span>
                    <span className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      {(prices[alert.pair] || 0).toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => removeAlert(alert.id)}
                className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
                title="Delete Alert"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
