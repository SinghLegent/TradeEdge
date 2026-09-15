import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Upload, 
  Image as ImageIcon, 
  Trash2, 
  Eye, 
  Check, 
  AlertCircle, 
  HelpCircle, 
  Sparkles,
  Calculator,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Trade, AssetClass, TradeDirection, TradeOutcome } from '../types';
import { CHART_PRESETS } from '../data/sampleCharts';
import { PositionSizeCalculator } from './PositionSizeCalculator';

interface TradeEntryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTrade: (trade: Trade) => void;
  editingTrade?: Trade | null;
  onClearEditing?: () => void;
  currentBalance?: number;
}

const POPULAR_PAIRS = {
  crypto: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT', 'XRP/USDT'],
  forex: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'GBP/JPY', 'AUD/USD'],
  stock: ['NVDA', 'AAPL', 'SPY', 'TSLA', 'QQQ', 'MSFT', 'AMZN']
};

const STRATEGY_PRESETS = [
  'Liquidity Sweep',
  'Fair Value Gap (FVG)',
  'London Breakout',
  'Break & Retest',
  'Order Block Tap',
  'Gap & Go'
];

export const TradeEntryPanel: React.FC<TradeEntryPanelProps> = ({
  isOpen,
  onClose,
  onSaveTrade,
  editingTrade,
  onClearEditing,
  currentBalance = 102750,
}) => {
  // Form State
  const [symbol, setSymbol] = useState('BTC/USDT');
  const [assetClass, setAssetClass] = useState<AssetClass>('crypto');
  const [direction, setDirection] = useState<TradeDirection>('LONG');
  const [entryPrice, setEntryPrice] = useState('68450');
  const [exitPrice, setExitPrice] = useState('71200');
  const [stopLoss, setStopLoss] = useState('67500');
  const [takeProfit, setTakeProfit] = useState('71200');
  const [lotSize, setLotSize] = useState('1.0');
  const [setup, setSetup] = useState('Liquidity Sweep');
  const [notes, setNotes] = useState('Swept Asian session low, confirmed bullish CHoCH on 5m, clean target at 4h supply.');
  const [timeframe, setTimeframe] = useState('15m');
  const [chartScreenshot, setChartScreenshot] = useState<string | undefined>(CHART_PRESETS[0].svgDataUri);
  const [screenshotName, setScreenshotName] = useState<string>('liquidity_sweep_setup.svg');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  
  // Custom Pairs & Live Price State
  const [customPairs, setCustomPairs] = useState<{ticker: string, assetClass: AssetClass}[]>([]);
  const [isAddingPair, setIsAddingPair] = useState(false);
  const [newPairTicker, setNewPairTicker] = useState('');
  const [newPairAssetClass, setNewPairAssetClass] = useState<AssetClass>('crypto');
  
  const [livePrice, setLivePrice] = useState(68450.0);
  const [isLiveRefreshing, setIsLiveRefreshing] = useState(false);
  const [priceTrend, setPriceTrend] = useState<'up' | 'down' | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync when editingTrade changes
  useEffect(() => {
    if (editingTrade) {
      setSymbol(editingTrade.symbol);
      setAssetClass(editingTrade.assetClass);
      setDirection(editingTrade.direction);
      setEntryPrice(editingTrade.entryPrice ? editingTrade.entryPrice.toString() : '');
      setExitPrice(editingTrade.exitPrice ? editingTrade.exitPrice.toString() : '');
      setStopLoss(editingTrade.stopLoss ? editingTrade.stopLoss.toString() : '');
      setTakeProfit(editingTrade.takeProfit ? editingTrade.takeProfit.toString() : '');
      setLotSize(editingTrade.lotSize ? editingTrade.lotSize.toString() : '1.0');
      setSetup(editingTrade.setup || '');
      setNotes(editingTrade.notes || '');
      setTimeframe(editingTrade.timeframe || '15m');
      setChartScreenshot(editingTrade.chartScreenshot);
      setScreenshotName(editingTrade.chartScreenshot ? 'attached_chart.svg' : '');
    } else {
      resetToDefault();
    }
  }, [editingTrade]);

  // Initial mock live price setup based on symbol
  useEffect(() => {
    let mockBase = 68450.0;
    const upper = symbol.toUpperCase();
    if (upper.includes('JPY')) mockBase = 150.25;
    else if (upper.includes('XAU')) mockBase = 2350.50;
    else if (assetClass === 'forex') mockBase = 1.0850;
    else if (assetClass === 'stock') mockBase = 250.00;
    else if (upper === 'ETH/USDT') mockBase = 3500.0;
    
    setLivePrice(mockBase);
    
    // Auto-fill entry price if it's a new trade and entry isn't heavily modified
    // Just a nice UX touch, but we'll leave it to user
  }, [symbol, assetClass]);

  // Live Price 30s pulse simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setIsLiveRefreshing(true);
      
      setTimeout(() => {
        setLivePrice(prev => {
          // Jitter by 0.1% max up or down
          const jitter = (Math.random() - 0.5) * 0.002 * prev;
          setPriceTrend(jitter > 0 ? 'up' : 'down');
          return prev + jitter;
        });
        setIsLiveRefreshing(false);
      }, 500);

      // Clear the color trend highlight after 1.5s
      setTimeout(() => {
         setPriceTrend(null);
      }, 1500);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const resetToDefault = () => {
    setSymbol('BTC/USDT');
    setAssetClass('crypto');
    setDirection('LONG');
    setEntryPrice('68450');
    setExitPrice('71200');
    setStopLoss('67500');
    setTakeProfit('71200');
    setLotSize('1.0');
    setSetup('Liquidity Sweep');
    setNotes('Swept Asian low, bullish reaction off 15m order block.');
    setTimeframe('15m');
    setChartScreenshot(CHART_PRESETS[0].svgDataUri);
    setScreenshotName('liquidity_sweep_setup.svg');
  };

  // Helper to determine asset class from ticker
  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
    const upper = newSymbol.toUpperCase();
    
    // Check custom pairs first
    const customMatch = customPairs.find(p => p.ticker === upper);
    if (customMatch) {
      setAssetClass(customMatch.assetClass);
      return;
    }

    if (upper.includes('USDT') || upper.includes('BTC') || upper.includes('ETH') || upper.includes('SOL')) {
      setAssetClass('crypto');
    } else if (upper.includes('/') || ['EUR', 'GBP', 'JPY', 'USD', 'AUD', 'CAD', 'CHF', 'NZD', 'XAU'].some(c => upper.includes(c))) {
      setAssetClass('forex');
    } else {
      setAssetClass('stock');
    }
  };

  const handleAddCustomPair = () => {
    if (!newPairTicker.trim()) return;
    const ticker = newPairTicker.toUpperCase().trim();
    if (!customPairs.some(p => p.ticker === ticker)) {
      setCustomPairs(prev => [...prev, { ticker, assetClass: newPairAssetClass }]);
    }
    setSymbol(ticker);
    setAssetClass(newPairAssetClass);
    setIsAddingPair(false);
    setNewPairTicker('');
  };

  // Parse numeric values for live calculations
  const numEntry = parseFloat(entryPrice) || 0;
  const numExit = parseFloat(exitPrice) || 0;
  const numSL = parseFloat(stopLoss) || 0;
  const numTP = parseFloat(takeProfit) || 0;
  const numLots = parseFloat(lotSize) || 1;

  // Real-time Calculations
  const isLong = direction === 'LONG';
  
  // Point change
  const priceDiff = isLong ? (numExit - numEntry) : (numEntry - numExit);
  const pnlPercent = numEntry > 0 ? parseFloat(((priceDiff / numEntry) * 100).toFixed(2)) : 0;

  // Calculated dollar PnL based on lot multiplier
  // Standard approximation: Forex 1 lot = $100k, Crypto = 1 coin, Stock = 1 share
  const calculatedPnL = React.useMemo(() => {
    if (!numEntry || !numExit) return 0;
    if (assetClass === 'forex') {
      // 1 lot standard pip calculation: (diff / 0.0001) * 10 * lots (or proportional for JPY/Gold)
      if (symbol.includes('JPY')) {
        return parseFloat(((priceDiff / 0.01) * 7.5 * numLots).toFixed(2));
      } else if (symbol.includes('XAU')) {
        return parseFloat((priceDiff * 100 * numLots).toFixed(2));
      }
      return parseFloat(((priceDiff / 0.0001) * 10 * numLots).toFixed(2));
    } else if (assetClass === 'crypto') {
      return parseFloat((priceDiff * numLots).toFixed(2));
    } else {
      // Stock
      return parseFloat((priceDiff * numLots).toFixed(2));
    }
  }, [priceDiff, numLots, assetClass, symbol, numEntry, numExit]);

  // Risk in $
  const riskDistance = isLong ? (numEntry - numSL) : (numSL - numEntry);
  const rewardDistance = isLong ? (numTP - numEntry) : (numEntry - numTP);
  
  // Risk:Reward Ratio
  const calculatedRR = React.useMemo(() => {
    if (riskDistance > 0 && rewardDistance > 0) {
      return parseFloat((rewardDistance / riskDistance).toFixed(2));
    }
    // Fallback based on exit price vs SL
    if (riskDistance > 0 && priceDiff !== 0) {
      const realizedR = parseFloat((priceDiff / riskDistance).toFixed(2));
      return realizedR;
    }
    return 2.5;
  }, [riskDistance, rewardDistance, priceDiff]);

  // Win / Loss / Breakeven outcome determination
  const calculatedOutcome: TradeOutcome = React.useMemo(() => {
    if (calculatedPnL > 15 || priceDiff > 0.0001) return 'WIN';
    if (calculatedPnL < -15 || priceDiff < -0.0001) return 'LOSS';
    return 'BREAKEVEN';
  }, [calculatedPnL, priceDiff]);

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setChartScreenshot(event.target?.result as string);
        setScreenshotName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setChartScreenshot(event.target?.result as string);
        setScreenshotName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalTrade: Trade = {
      id: editingTrade ? editingTrade.id : `TRD-${Math.floor(185 + Math.random() * 800)}`,
      date: editingTrade ? editingTrade.date : new Date().toISOString().slice(0, 16).replace('T', ' '),
      timestamp: editingTrade ? editingTrade.timestamp : Date.now(),
      symbol: symbol.toUpperCase().trim(),
      assetClass,
      direction,
      entryPrice: numEntry,
      exitPrice: numExit,
      stopLoss: numSL || undefined,
      takeProfit: numTP || undefined,
      lotSize: numLots,
      pnl: calculatedPnL,
      pnlPercent,
      outcome: calculatedOutcome,
      riskReward: calculatedRR,
      setup: setup.trim() || 'Institutional Edge',
      timeframe,
      notes: (notes || '').trim(),
      chartScreenshot,
      status: 'CLOSED',
      duration: editingTrade?.duration || '1h 30m',
    };

    onSaveTrade(finalTrade);
    if (onClearEditing) onClearEditing();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full bg-[#0c101d] border-l border-slate-800/90 shadow-2xl overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#0e1424]">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg border ${
            editingTrade 
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
          }`}>
            {editingTrade ? <Layers className="h-4 w-4" /> : <Calculator className="h-4 w-4" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              {editingTrade ? `Edit Trade ${editingTrade.id}` : 'Log New Trade Setup'}
              {editingTrade && (
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  Editing Mode
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-400">
              {editingTrade ? 'Update execution parameters and chart' : 'Meticulously record setup parameters & analytics'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {editingTrade && onClearEditing && (
            <button
              type="button"
              onClick={onClearEditing}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 transition-colors"
              title="Switch to New Trade"
            >
              + New
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Close Panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Panel Scrollable Form Body */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
        {/* Live Calculation Edge HUD Banner */}
        <div className="rounded-xl border border-slate-800/90 bg-gradient-to-r from-slate-900 via-[#0e1526] to-slate-900 p-3 shadow-inner">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>Real-Time Edge Calculation</span>
            </span>
            {/* Pill shaped outcome preview: Win (green) / Loss (red) */}
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase ${
              calculatedOutcome === 'WIN'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : calculatedOutcome === 'LOSS'
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                : 'bg-slate-700/30 text-slate-300 border border-slate-600/30'
            }`}>
              {calculatedOutcome}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-center">
            <div className="bg-slate-950/50 rounded-lg p-2 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 block uppercase">Net PnL</span>
              <span className={`text-xs sm:text-sm font-bold block ${
                calculatedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {calculatedPnL >= 0 ? '+' : ''}${calculatedPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[9px] text-slate-400">{pnlPercent >= 0 ? '+' : ''}{pnlPercent}%</span>
            </div>

            <div className="bg-slate-950/50 rounded-lg p-2 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 block uppercase">Realized R:R</span>
              <span className="text-xs sm:text-sm font-bold text-white block">
                {calculatedRR > 0 ? `1 : ${calculatedRR}R` : `${calculatedRR}R`}
              </span>
              <span className="text-[9px] text-slate-400">Risk vs Reward</span>
            </div>

            <div className="bg-slate-950/50 rounded-lg p-2 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 block uppercase">Position</span>
              <span className={`text-xs sm:text-sm font-bold block ${isLong ? 'text-blue-400' : 'text-orange-400'}`}>
                {numLots} {assetClass === 'stock' ? 'shares' : 'lots'}
              </span>
              <span className="text-[9px] text-slate-400 uppercase">{assetClass}</span>
            </div>
          </div>
        </div>

        {/* Section 1: Instrument & Direction */}
        <div className="space-y-3">
          {/* Pair/Asset Dropdown & Custom input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="trade-pair-select" className="font-semibold text-slate-200">
                Pair / Asset <span className="text-rose-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsAddingPair(!isAddingPair)}
                className="text-[10px] text-emerald-400 font-semibold hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full transition-colors"
              >
                + Add Pair
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {/* Dropdown for Pair/Asset */}
              <div className="relative w-full">
                <select
                  id="trade-pair-select"
                  value={symbol}
                  onChange={(e) => handleSymbolChange(e.target.value)}
                  className="w-full appearance-none bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500/60 transition-colors pr-8 cursor-pointer"
                >
                  <optgroup label="Crypto Assets">
                    {POPULAR_PAIRS.crypto.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Forex Major & Minor">
                    {POPULAR_PAIRS.forex.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Equities & ETFs">
                    {POPULAR_PAIRS.stock.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </optgroup>
                  {customPairs.length > 0 && (
                    <optgroup label="Custom Pairs">
                      {customPairs.map(p => (
                        <option key={p.ticker} value={p.ticker}>{p.ticker}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>

              {/* Add Custom Pair Inline Modal */}
              {isAddingPair && (
                 <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 mt-1 mb-1 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] uppercase font-bold text-slate-400">Add Custom Pair</span>
                       <button type="button" onClick={() => setIsAddingPair(false)}>
                         <X className="h-3 w-3 text-slate-500 hover:text-slate-300"/>
                       </button>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Ticker (e.g. NAS100)" 
                        value={newPairTicker}
                        onChange={(e) => setNewPairTicker(e.target.value.toUpperCase())}
                        className="flex-[2] bg-slate-900 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-white uppercase focus:outline-none focus:border-emerald-500 font-mono"
                      />
                      <select
                        value={newPairAssetClass}
                        onChange={(e) => setNewPairAssetClass(e.target.value as AssetClass)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-1.5 py-1.5 text-[11px] text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="crypto">Crypto</option>
                        <option value="forex">Forex</option>
                        <option value="stock">Stock</option>
                      </select>
                      <button 
                        type="button"
                        onClick={handleAddCustomPair}
                        disabled={!newPairTicker.trim()}
                        className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 px-3 py-1.5 rounded-md text-xs font-bold transition-colors cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                 </div>
              )}

              {/* Live Market Price Widget */}
              <div className="mt-1 bg-[#0a0f18] border border-slate-800 rounded-xl p-3 relative overflow-hidden flex items-center justify-between shadow-inner">
                {/* Glow effect when updating */}
                <div className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
                  priceTrend === 'up' ? 'bg-emerald-500/10' : priceTrend === 'down' ? 'bg-rose-500/10' : 'opacity-0'
                }`}></div>
                
                <div className="relative z-10 flex items-center gap-3">
                  <div className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLiveRefreshing ? 'bg-emerald-400' : 'bg-emerald-500'}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveRefreshing ? 'bg-emerald-400' : 'bg-emerald-500'}`}></span>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                      Live Market
                    </div>
                    <div className="text-[9px] text-slate-600 mt-0.5">
                      Auto-refreshes every 30s
                    </div>
                  </div>
                </div>

                <div className="relative z-10 text-right">
                  <div className={`font-mono text-lg font-black tracking-tight transition-colors duration-300 ${
                    priceTrend === 'up' ? 'text-emerald-400' : priceTrend === 'down' ? 'text-rose-400' : 'text-white'
                  }`}>
                    {symbol}: {assetClass === 'forex' && !symbol.includes('JPY') ? livePrice.toFixed(5) : livePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Direction Toggle Switch: Long vs Short */}
          <div>
            <label className="font-semibold text-slate-200 block mb-1.5">
              Direction <span className="text-rose-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
              {/* Long Button (Blue) */}
              <button
                type="button"
                id="toggle-long-btn"
                onClick={() => setDirection('LONG')}
                className={`py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 text-xs ${
                  isLong
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <TrendingUp className="h-3.5 w-3.5" />
                <span>LONG (Buy)</span>
              </button>

              {/* Short Button (Orange) */}
              <button
                type="button"
                id="toggle-short-btn"
                onClick={() => setDirection('SHORT')}
                className={`py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 text-xs ${
                  !isLong
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/25 border border-orange-400/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <TrendingDown className="h-3.5 w-3.5" />
                <span>SHORT (Sell)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Numeric Price Parameters */}
        <div className="space-y-3 pt-2 border-t border-slate-800/60">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200 tracking-wide uppercase text-[10px]">
              Execution Parameters
            </span>
            <button
              type="button"
              id="btn-toggle-size-calculator"
              onClick={() => setIsCalcOpen(!isCalcOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                isCalcOpen
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-xs'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700 hover:border-slate-600'
              }`}
              title="Calculate recommended lot size based on current balance and risk percentage"
            >
              <Calculator className="h-3 w-3 text-emerald-400" />
              <span>{isCalcOpen ? 'Hide Calculator' : 'Risk % Sizing Helper'}</span>
            </button>
          </div>

          {/* Position Size Calculator Helper Widget */}
          {isCalcOpen && (
            <div className="pt-0.5 pb-1 animate-in fade-in slide-in-from-top-1 duration-150">
              <PositionSizeCalculator
                currentBalance={currentBalance}
                entryPrice={parseFloat(entryPrice) || 0}
                stopLoss={parseFloat(stopLoss) || 0}
                assetClass={assetClass}
                symbol={symbol}
                isInline={true}
                onApplyLotSize={(recommended) => {
                  setLotSize(recommended.toString());
                  setIsCalcOpen(false);
                }}
                onClose={() => setIsCalcOpen(false)}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {/* Entry Price */}
            <div>
              <label htmlFor="input-entry-price" className="text-slate-300 font-medium block mb-1">
                Entry Price <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-entry-price"
                  type="number"
                  step="any"
                  
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 font-mono text-white text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Exit Price */}
            <div>
              <label htmlFor="input-exit-price" className="text-slate-300 font-medium block mb-1">
                Exit Price <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="input-exit-price"
                  type="number"
                  step="any"
                  
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 font-mono text-white text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {/* Stop Loss (SL) */}
            <div>
              <label htmlFor="input-stop-loss" className="text-slate-300 font-medium block mb-1">
                Stop Loss (SL)
              </label>
              <input
                id="input-stop-loss"
                type="number"
                step="any"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="SL price"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-rose-300 text-xs focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20"
              />
            </div>

            {/* Take Profit (TP) */}
            <div>
              <label htmlFor="input-take-profit" className="text-slate-300 font-medium block mb-1">
                Take Profit (TP)
              </label>
              <input
                id="input-take-profit"
                type="number"
                step="any"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                placeholder="TP price"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-emerald-300 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
              />
            </div>

            {/* Lot Size */}
            <div>
              <label htmlFor="input-lot-size" className="text-slate-300 font-medium block mb-1">
                Lot / Size
              </label>
              <input
                id="input-lot-size"
                type="number"
                step="any"
                value={lotSize}
                onChange={(e) => setLotSize(e.target.value)}
                placeholder="e.g. 1.0"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 font-mono text-white text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Setup & Strategy Category */}
        <div className="space-y-2 pt-2 border-t border-slate-800/60">
          <div className="flex items-center justify-between">
            <label htmlFor="input-strategy-setup" className="font-semibold text-slate-200">
              Strategy / Setup Tag
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded px-2 py-0.5 text-[11px] font-mono text-slate-300 focus:outline-none"
            >
              <option value="1m">1m</option>
              <option value="5m">5m</option>
              <option value="15m">15m</option>
              <option value="1h">1h</option>
              <option value="4h">4h</option>
              <option value="1D">1D</option>
            </select>
          </div>

          <input
            id="input-strategy-setup"
            type="text"
            value={setup}
            onChange={(e) => setSetup(e.target.value)}
            placeholder="e.g. Liquidity Sweep, Fair Value Gap, Break & Retest"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/60"
          />

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {STRATEGY_PRESETS.map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setSetup(p)}
                className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                  setup === p
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Trade Notes / Strategy Setup Text Area */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
          <div className="flex items-center justify-between">
            <label htmlFor="input-trade-notes" className="font-semibold text-slate-200">
              Trade Notes / Strategy Setup
            </label>
            <span className="text-[10px] text-slate-400">Context, execution psychology, rules</span>
          </div>

          <textarea
            id="input-trade-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe entry triggers, confluence factors, emotions during trade management, and key lessons..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 leading-relaxed resize-none"
          />
        </div>

        {/* Section 5: Upload Chart Screenshot */}
        <div className="space-y-2 pt-2 border-t border-slate-800/60">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-200">Chart Screenshot</span>
            {chartScreenshot && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <Check className="h-3 w-3" /> Image attached
              </span>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Dropzone or Preview */}
          {chartScreenshot ? (
            <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-2 group">
              <div className="relative w-full h-32 rounded-lg overflow-hidden bg-[#0a0e1a] flex items-center justify-center">
                <img
                  src={chartScreenshot}
                  alt="Trade Chart Screenshot"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPreviewOpen(true)}
                    className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                    title="View enlarged screenshot"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                    title="Replace screenshot"
                  >
                    <Upload className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChartScreenshot(undefined);
                      setScreenshotName('');
                    }}
                    className="p-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition-colors"
                    title="Remove screenshot"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono">
                <span className="truncate max-w-[200px]">{screenshotName || 'chart_setup.svg'}</span>
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" /> Zoom
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                isDragOver 
                  ? 'border-emerald-500 bg-emerald-500/10' 
                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-1.5">
                <div className="p-2.5 rounded-full bg-slate-800 text-slate-300">
                  <Upload className="h-4 w-4" />
                </div>
                <button
                  type="button"
                  id="upload-chart-btn"
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Upload Chart Screenshot
                </button>
                <p className="text-[11px] text-slate-400">
                  PNG, JPG, or SVG • Drag and drop or browse
                </p>
              </div>
            </div>
          )}

          {/* Quick preset charts selector for quick testing */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <span>Or test with verified setup charts:</span>
            <div className="flex items-center gap-1">
              {CHART_PRESETS.map(cp => (
                <button
                  type="button"
                  key={cp.id}
                  onClick={() => {
                    setChartScreenshot(cp.svgDataUri);
                    setScreenshotName(`${cp.id}.svg`);
                    setSetup(cp.setup);
                    setTimeframe(cp.timeframe);
                  }}
                  className="px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                >
                  {cp.timeframe}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 6: Save Trade Primary Button */}
        <div className="pt-4 border-t border-slate-800 sticky bottom-0 bg-[#0c101d] pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-trade-btn"
              className="flex-[2] py-2.5 px-5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.99] rounded-xl transition-all shadow-[0_0_20px_rgba(52,211,153,0.35)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="h-4 w-4 stroke-[2.5]" />
              <span>{editingTrade ? 'Update Trade in Journal' : 'Save Trade'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Enlarged Chart Screenshot Modal */}
      {isPreviewOpen && chartScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-4xl bg-[#0b0f19] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-emerald-400" />
                <span className="font-bold text-sm text-white font-mono">{symbol} • {setup} ({timeframe})</span>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="w-full h-[60vh] max-h-[600px] flex items-center justify-center bg-[#070a12] rounded-xl overflow-hidden">
              <img
                src={chartScreenshot}
                alt="Enlarged Chart"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
