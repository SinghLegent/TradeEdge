import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  DollarSign, 
  Percent, 
  ArrowRight, 
  Activity, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Info,
  Sparkles
} from 'lucide-react';

interface PositionCalculatorViewProps {
  currentBalance: number;
}

const PRESET_ASSETS = [
  { group: 'Forex', items: ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD'] },
  { group: 'Metals', items: ['XAUUSD'] },
  { group: 'Indices', items: ['NAS100', 'US30', 'SPX500'] },
  { group: 'Crypto', items: ['BTCUSD', 'ETHUSD', 'SOLUSD'] }
];

export const PositionCalculatorView: React.FC<PositionCalculatorViewProps> = ({
  currentBalance
}) => {
  const [selectedAsset, setSelectedAsset] = useState('EURUSD');
  const [livePrice, setLivePrice] = useState(1.0850);
  const [isLiveRefreshing, setIsLiveRefreshing] = useState(false);
  
  const [balance, setBalance] = useState<string>(Math.max(10000, currentBalance).toString());
  const [riskPercent, setRiskPercent] = useState<string>('1.0');
  
  const [tradeType, setTradeType] = useState<'LONG' | 'SHORT'>('LONG');
  const [entryPrice, setEntryPrice] = useState<string>(livePrice.toString());
  const [stopLoss, setStopLoss] = useState<string>('1.0800');
  const [takeProfit, setTakeProfit] = useState<string>('1.0950');

  // Simulated live price feed pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLiveRefreshing(true);
      setTimeout(() => setIsLiveRefreshing(false), 800);
      
      // slightly jitter the live price
      setLivePrice(prev => {
        const jitter = (Math.random() - 0.5) * 0.001 * prev;
        const newPrice = prev + jitter;
        return parseFloat(newPrice.toFixed(4));
      });
    }, 15000); // 15 seconds for more visible effect
    
    return () => clearInterval(interval);
  }, []);

  // Update entry price when selected asset changes (simulated fetch)
  useEffect(() => {
    let mockPrice = 1.0850;
    let mockSL = '1.0800';
    let mockTP = '1.0950';

    if (selectedAsset.includes('JPY')) {
      mockPrice = 150.25; mockSL = '149.50'; mockTP = '151.75';
    } else if (selectedAsset === 'XAUUSD') {
      mockPrice = 2350.50; mockSL = '2340.00'; mockTP = '2370.00';
    } else if (selectedAsset === 'BTCUSD') {
      mockPrice = 64500; mockSL = '63000'; mockTP = '68000';
    } else if (selectedAsset === 'ETHUSD') {
      mockPrice = 3450; mockSL = '3300'; mockTP = '3700';
    } else if (selectedAsset === 'NAS100') {
      mockPrice = 17500; mockSL = '17400'; mockTP = '17700';
    }

    setLivePrice(mockPrice);
    setEntryPrice(mockPrice.toString());
    setStopLoss(mockSL);
    setTakeProfit(mockTP);
  }, [selectedAsset]);

  // Derived math
  const numBalance = parseFloat(balance) || 0;
  const numRiskPercent = parseFloat(riskPercent) || 0;
  const dollarRisk = (numBalance * numRiskPercent) / 100;
  
  const numEntry = parseFloat(entryPrice) || 0;
  const numSL = parseFloat(stopLoss) || 0;
  const numTP = parseFloat(takeProfit) || 0;
  
  const isLong = tradeType === 'LONG';
  
  // Validation
  const isValidSL = isLong ? numSL < numEntry : numSL > numEntry;

  // Calculate Distance & Potential Profit
  const slDistanceRaw = Math.abs(numEntry - numSL);
  const tpDistanceRaw = Math.abs(numTP - numEntry);
  
  const riskRewardRatio = slDistanceRaw > 0 ? (tpDistanceRaw / slDistanceRaw).toFixed(2) : '0.00';

  // Asset Specific Lot Size Logic
  const calculations = useMemo(() => {
    if (!slDistanceRaw || !dollarRisk) return { size: 0, unit: 'Units', pips: 0, pipLabel: 'Points', profit: 0 };
    
    let size = 0;
    let unit = 'Lots';
    let pips = slDistanceRaw;
    let pipLabel = 'Points';

    if (selectedAsset === 'XAUUSD') {
      // Gold: Lot Size = ($ Risk Amount) / ( |Entry - SL| * 100 )
      size = dollarRisk / (slDistanceRaw * 100);
      unit = 'Lots';
      pips = slDistanceRaw * 10; // usually 10 pips per dollar in gold
      pipLabel = 'Pips';
    } else if (selectedAsset.includes('JPY')) {
      // JPY Pairs: Lot Size = ($ Risk Amount) / ( |Entry - SL| * 100 * Pip Value )
      // We will approximate Pip Value = ~ $6.65 per standard lot or something, but let's use standard assumption:
      // If base is USD, pip value = 1000 / current price. Let's use 1000/livePrice
      const pipValue = 1000 / livePrice; 
      size = dollarRisk / (slDistanceRaw * 100 * pipValue);
      pips = slDistanceRaw * 100;
      pipLabel = 'Pips';
    } else if (selectedAsset === 'BTCUSD' || selectedAsset === 'ETHUSD' || selectedAsset === 'SOLUSD') {
      // Crypto: Position Size = ($ Risk Amount) / |Entry - SL|
      size = dollarRisk / slDistanceRaw;
      unit = selectedAsset.replace('USD', '');
      pipLabel = 'Delta';
    } else if (selectedAsset === 'NAS100' || selectedAsset === 'US30' || selectedAsset === 'SPX500') {
      // Indices: Contract Size = ($ Risk Amount) / |Entry - SL|
      size = dollarRisk / slDistanceRaw;
      unit = 'Contracts';
    } else {
      // Default Forex (EURUSD, GBPUSD): Lot Size = ($ Risk Amount) / ( |Entry - SL| * 10,000 * $10 )
      size = dollarRisk / (slDistanceRaw * 10000 * 10);
      pips = slDistanceRaw * 10000;
      pipLabel = 'Pips';
    }

    const profit = size > 0 ? dollarRisk * parseFloat(riskRewardRatio) : 0;

    return { 
      size: Math.max(0, size), 
      unit, 
      pips, 
      pipLabel,
      profit
    };
  }, [dollarRisk, slDistanceRaw, selectedAsset, riskRewardRatio, livePrice]);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0e1422] p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Calculator className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Position Size &amp; Risk Calculator</h1>
            <p className="text-sm text-slate-400">Institutional precision for all asset classes</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Live Account Balance</span>
          <span className="text-2xl font-mono font-black text-white">
            ${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Inputs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Row 1: Asset & Live Feed */}
          <div className="bg-[#0e1422] p-5 rounded-2xl border border-slate-800 shadow-lg space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2">1. Select Market</h2>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-2/3">
                <select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full bg-[#161f33] border border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  {PRESET_ASSETS.map(group => (
                    <optgroup key={group.group} label={group.group}>
                      {group.items.map(item => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </optgroup>
                  ))}
                  <option value="CUSTOM">+ Add Custom Pair</option>
                </select>
              </div>
              <div className="w-full sm:w-1/3 flex justify-end">
                <div className={`relative px-4 py-2.5 rounded-xl border flex items-center gap-2 transition-colors duration-500 ${
                  isLiveRefreshing ? 'bg-cyan-500/20 border-cyan-400' : 'bg-[#090d15] border-slate-700'
                }`}>
                  <span className={`h-2 w-2 rounded-full ${isLiveRefreshing ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-500'}`}></span>
                  <span className="text-xs text-slate-400 font-semibold mr-1">LIVE</span>
                  <span className="font-mono text-sm font-bold text-white">{livePrice.toFixed(4)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Risk & Account Inputs */}
          <div className="bg-[#0e1422] p-5 rounded-2xl border border-slate-800 shadow-lg space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2">2. Capital &amp; Risk</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
                  <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                  Account Balance
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-slate-500">$</span>
                  <input
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    className="w-full bg-[#161f33] border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
                  <Percent className="h-3.5 w-3.5 text-slate-400" />
                  Risk Percentage
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="100"
                      value={riskPercent}
                      onChange={(e) => setRiskPercent(e.target.value)}
                      className="w-full bg-[#161f33] border border-slate-700 rounded-xl px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-mono text-slate-500">%</span>
                  </div>
                  <div className="flex-1">
                    <input 
                      type="range" 
                      min="0.1" 
                      max="5" 
                      step="0.1" 
                      value={riskPercent} 
                      onChange={(e) => setRiskPercent(e.target.value)}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#090d15] rounded-xl p-3 border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Total Dollar Risk</span>
              <span className="text-lg font-mono font-bold text-rose-400">
                ${dollarRisk.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Row 3: Trade Parameters */}
          <div className="bg-[#0e1422] p-5 rounded-2xl border border-slate-800 shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">3. Trade Parameters</h2>
              <div className="flex items-center bg-[#161f33] rounded-lg p-1 border border-slate-700">
                <button
                  type="button"
                  onClick={() => setTradeType('LONG')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                    isLong ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Long (Buy)
                </button>
                <button
                  type="button"
                  onClick={() => setTradeType('SHORT')}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                    !isLong ? 'bg-rose-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Short (Sell)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5 font-sans">Entry Price</label>
                <input
                  type="number"
                  step="any"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className="w-full bg-[#161f33] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5 font-sans flex items-center justify-between">
                  <span>Stop Loss (SL)</span>
                  {!isValidSL && (
                    <span className="text-[10px] text-rose-400">Invalid</span>
                  )}
                </label>
                <input
                  type="number"
                  step="any"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  className={`w-full bg-[#161f33] border rounded-xl px-3 py-2 text-sm text-white focus:outline-none ${
                    isValidSL ? 'border-slate-700 focus:border-cyan-500' : 'border-rose-500/50 focus:border-rose-500'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1.5 font-sans">Take Profit (TP)</label>
                <input
                  type="number"
                  step="any"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(e.target.value)}
                  className="w-full bg-[#161f33] border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
            
            {!isValidSL && (
              <p className="text-xs text-rose-400 flex items-center gap-1.5 mt-2">
                <Info className="h-3.5 w-3.5" />
                Invalid SL position for a {tradeType} trade.
              </p>
            )}
          </div>

        </div>

        {/* Right Column: Row 4 (Results & Execution Card) */}
        <div className="lg:col-span-5 h-full">
          <div className="bg-gradient-to-b from-[#11192b] to-[#0c1220] p-6 rounded-2xl border border-slate-800 shadow-2xl h-full flex flex-col relative overflow-hidden">
            {/* Neon accent backdrop */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500"></div>
            
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              Calculated Order Size
            </h2>

            {/* Highlighted Output */}
            <div className="bg-[#080c15] border border-cyan-500/40 rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(6,182,212,0.15)] relative mb-8">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#080c15] px-3 border border-cyan-500/40 rounded-full">
                Recommended
              </span>
              <div className="flex items-baseline justify-center gap-2 mt-2">
                <span className="font-mono text-5xl font-black text-white tracking-tighter">
                  {calculations.size < 0.01 ? calculations.size.toFixed(4) : calculations.size.toFixed(2)}
                </span>
                <span className="font-mono text-lg font-bold text-cyan-400">{calculations.unit}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-3 font-mono">
                {calculations.unit === 'Lots' ? `Standard 100,000 units` : `Exact position sizing`}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8 flex-1">
              <div className="bg-[#161f33]/50 p-4 rounded-xl border border-slate-800/80">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">Risk Amount</span>
                <span className="font-mono text-lg font-bold text-rose-400">
                  ${dollarRisk.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="bg-[#161f33]/50 p-4 rounded-xl border border-slate-800/80">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">Potential Profit</span>
                <span className="font-mono text-lg font-bold text-emerald-400">
                  ${calculations.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="bg-[#161f33]/50 p-4 rounded-xl border border-slate-800/80">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">Risk : Reward</span>
                <span className="font-mono text-lg font-bold text-white">
                  1 : {riskRewardRatio}
                </span>
              </div>
              <div className="bg-[#161f33]/50 p-4 rounded-xl border border-slate-800/80">
                <span className="text-[10px] uppercase font-semibold text-slate-500 block mb-1">SL Distance</span>
                <span className="font-mono text-lg font-bold text-white">
                  {calculations.pips.toFixed(1)} <span className="text-xs text-slate-400">{calculations.pipLabel}</span>
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full py-4 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-cyan-400/20">
              Apply to Journal Entry
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
