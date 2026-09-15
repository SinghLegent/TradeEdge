import React, { useState, useRef } from 'react';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Check, 
  Tag, 
  Clock,
  Layers,
  Upload,
  Image as ImageIcon,
  ChevronDown,
  Sparkles,
  Eye,
  Trash2,
  Calculator,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered
} from 'lucide-react';
import { Trade, AssetClass, TradeDirection, TradeOutcome } from '../types';
import { CHART_PRESETS } from '../data/sampleCharts';
import { PositionSizeCalculator } from './PositionSizeCalculator';

interface LogTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTrade: (trade: Trade) => void;
  currentBalance?: number;
}

const POPULAR_PAIRS = {
  crypto: ['BTC/USDT', 'ETH/USDT', 'SOL/USDT', 'BNB/USDT'],
  forex: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'GBP/JPY'],
  stock: ['NVDA', 'AAPL', 'SPY', 'TSLA', 'QQQ']
};

export const LogTradeModal: React.FC<LogTradeModalProps> = ({
  isOpen,
  onClose,
  onAddTrade,
  currentBalance = 102750,
}) => {
  const [symbol, setSymbol] = useState('BTC/USDT');
  const [assetClass, setAssetClass] = useState<AssetClass>('crypto');
  const [direction, setDirection] = useState<TradeDirection>('LONG');
  const [entryPrice, setEntryPrice] = useState('68450');
  const [exitPrice, setExitPrice] = useState('71200');
  const [stopLoss, setStopLoss] = useState('67500');
  const [takeProfit, setTakeProfit] = useState('71200');
  const [lotSize, setLotSize] = useState('1.0');
  const [setup, setSetup] = useState('Liquidity Sweep');
  const [timeframe, setTimeframe] = useState('15m');
  const [notes, setNotes] = useState('Clean reaction off 15m bullish demand, clean runner to 4h high.');
  const [chartScreenshot, setChartScreenshot] = useState<string | undefined>(CHART_PRESETS[0].svgDataUri);
  const [screenshotName, setScreenshotName] = useState<string>('chart_setup.svg');
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom Pairs & Live Price State
  const [customPairs, setCustomPairs] = useState<{ticker: string, assetClass: AssetClass}[]>([]);
  const [isAddingPair, setIsAddingPair] = useState(false);
  const [newPairTicker, setNewPairTicker] = useState('');
  const [newPairAssetClass, setNewPairAssetClass] = useState<AssetClass>('crypto');
  
  const [livePrice, setLivePrice] = useState(68450.0);
  const [isLiveRefreshing, setIsLiveRefreshing] = useState(false);
  const [priceTrend, setPriceTrend] = useState<'up' | 'down' | null>(null);

  // Initial mock live price setup based on symbol
  React.useEffect(() => {
    let mockBase = 68450.0;
    const upper = symbol.toUpperCase();
    if (upper.includes('JPY')) mockBase = 150.25;
    else if (upper.includes('XAU')) mockBase = 2350.50;
    else if (assetClass === 'forex') mockBase = 1.0850;
    else if (assetClass === 'stock') mockBase = 250.00;
    else if (upper === 'ETH/USDT') mockBase = 3500.0;
    
    setLivePrice(mockBase);
  }, [symbol, assetClass]);

  // Live Price 30s pulse simulator
  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsLiveRefreshing(true);
      
      setTimeout(() => {
        setLivePrice(prev => {
          const jitter = (Math.random() - 0.5) * 0.002 * prev;
          setPriceTrend(jitter > 0 ? 'up' : 'down');
          return prev + jitter;
        });
        setIsLiveRefreshing(false);
      }, 500);

      setTimeout(() => {
         setPriceTrend(null);
      }, 1500);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const handleSymbolChange = (newSymbol: string) => {
    setSymbol(newSymbol);
    const upper = newSymbol.toUpperCase();
    
    // Check custom pairs first
    const customMatch = customPairs.find(p => p.ticker === upper);
    if (customMatch) {
      setAssetClass(customMatch.assetClass);
      return;
    }

    if (upper.includes('USDT') || upper.includes('BTC') || upper.includes('ETH')) {
      setAssetClass('crypto');
    } else if (upper.includes('/') || ['EUR', 'GBP', 'JPY', 'USD', 'XAU'].some(c => upper.includes(c))) {
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

  const numEntry = parseFloat(entryPrice) || 0;
  const numExit = parseFloat(exitPrice) || 0;
  const numSL = parseFloat(stopLoss) || 0;
  const numTP = parseFloat(takeProfit) || 0;
  const numLots = parseFloat(lotSize) || 1;

  const isLong = direction === 'LONG';
  const priceDiff = isLong ? (numExit - numEntry) : (numEntry - numExit);
  const pnlPercent = numEntry > 0 ? parseFloat(((priceDiff / numEntry) * 100).toFixed(2)) : 0;

  // Realized Net PnL estimate
  const calculatedPnL = (() => {
    if (!numEntry || !numExit) return 0;
    if (assetClass === 'forex') {
      if (symbol.includes('JPY')) return parseFloat(((priceDiff / 0.01) * 7.5 * numLots).toFixed(2));
      if (symbol.includes('XAU')) return parseFloat((priceDiff * 100 * numLots).toFixed(2));
      return parseFloat(((priceDiff / 0.0001) * 10 * numLots).toFixed(2));
    }
    return parseFloat((priceDiff * numLots).toFixed(2));
  })();

  const calculatedOutcome: TradeOutcome = calculatedPnL > 10 ? 'WIN' : calculatedPnL < -10 ? 'LOSS' : 'BREAKEVEN';

  const riskDist = isLong ? (numEntry - numSL) : (numSL - numEntry);
  const rewardDist = isLong ? (numTP - numEntry) : (numEntry - numTP);
  const calculatedRR = riskDist > 0 && rewardDist > 0 ? parseFloat((rewardDist / riskDist).toFixed(2)) : 2.5;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newTrade: Trade = {
        id: `TRD-${Math.floor(185 + Math.random() * 800)}`,
        date: new Date().toISOString().slice(0, 16).replace('T', ' '),
        timestamp: Date.now(),
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
        setup: setup.trim() || 'Institutional Setup',
        timeframe,
        notes: (notes || '').trim(),
        chartScreenshot,
        status: 'CLOSED',
        duration: '2h 15m',
      };

      onAddTrade(newTrade);
      onClose();
    } catch (err) {
      console.error("Error saving trade:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl border border-slate-700 bg-[#0e1422] p-6 shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Log Trade Setup</h2>
              <p className="text-xs text-slate-400">Meticulously enter setup parameters &amp; chart</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Live Calculation Edge Banner */}
        <div className="mt-4 rounded-xl border border-slate-800/90 bg-[#090d18] p-3 flex items-center justify-between font-mono text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Net PnL</span>
            <span className={`text-sm font-bold ${calculatedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {calculatedPnL >= 0 ? '+' : ''}${calculatedPnL.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Risk : Reward</span>
            <span className="text-sm font-bold text-white">1 : {calculatedRR}R</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block uppercase">Result Tag</span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
              calculatedOutcome === 'WIN'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : calculatedOutcome === 'LOSS'
                ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                : 'bg-slate-700/30 text-slate-300 border border-slate-600/30'
            }`}>
              {calculatedOutcome}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* Pair/Asset Dropdown & Direction Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Dropdown for Pair/Asset */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="modal-pair-select" className="text-xs font-semibold text-slate-300 block">
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

              <div className="relative w-full">
                <select
                  id="modal-pair-select"
                  value={symbol}
                  onChange={(e) => handleSymbolChange(e.target.value)}
                  className="w-full appearance-none bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500/60 pr-8 cursor-pointer"
                >
                  <optgroup label="Crypto">
                    {POPULAR_PAIRS.crypto.map(p => <option key={p} value={p}>{p}</option>)}
                  </optgroup>
                  <optgroup label="Forex">
                    {POPULAR_PAIRS.forex.map(p => <option key={p} value={p}>{p}</option>)}
                  </optgroup>
                  <optgroup label="Stocks">
                    {POPULAR_PAIRS.stock.map(p => <option key={p} value={p}>{p}</option>)}
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
                 <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-2 mt-1.5 mb-1 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] uppercase font-bold text-slate-400">Add Custom Pair</span>
                       <button type="button" onClick={() => setIsAddingPair(false)}>
                         <X className="h-3 w-3 text-slate-500 hover:text-slate-300"/>
                       </button>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="e.g. NAS100" 
                        value={newPairTicker}
                        onChange={(e) => setNewPairTicker(e.target.value.toUpperCase())}
                        className="flex-[2] bg-slate-900 border border-slate-700 rounded-md px-2 py-1.5 text-xs text-white uppercase focus:outline-none focus:border-emerald-500 font-mono"
                      />
                      <select
                        value={newPairAssetClass}
                        onChange={(e) => setNewPairAssetClass(e.target.value as AssetClass)}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-md px-1 py-1.5 text-[10px] text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="crypto">Crypto</option>
                        <option value="forex">Forex</option>
                        <option value="stock">Stock</option>
                      </select>
                      <button 
                        type="button"
                        onClick={handleAddCustomPair}
                        disabled={!newPairTicker.trim()}
                        className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                 </div>
              )}

              {/* Live Market Price Widget */}
              <div className="mt-2 bg-[#0a0f18] border border-slate-800 rounded-xl p-2.5 relative overflow-hidden flex items-center justify-between shadow-inner">
                {/* Glow effect when updating */}
                <div className={`absolute inset-0 transition-opacity duration-300 pointer-events-none ${
                  priceTrend === 'up' ? 'bg-emerald-500/10' : priceTrend === 'down' ? 'bg-rose-500/10' : 'opacity-0'
                }`}></div>
                
                <div className="relative z-10 flex items-center gap-2.5">
                  <div className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isLiveRefreshing ? 'bg-emerald-400' : 'bg-emerald-500'}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveRefreshing ? 'bg-emerald-400' : 'bg-emerald-500'}`}></span>
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-semibold text-slate-400 tracking-wider">
                      Live Market
                    </div>
                    <div className="text-[8px] text-slate-600 mt-0.5">
                      Auto-refreshes 30s
                    </div>
                  </div>
                </div>

                <div className="relative z-10 text-right">
                  <div className={`font-mono text-sm font-black tracking-tight transition-colors duration-300 ${
                    priceTrend === 'up' ? 'text-emerald-400' : priceTrend === 'down' ? 'text-rose-400' : 'text-white'
                  }`}>
                    {symbol}: {assetClass === 'forex' && !symbol.includes('JPY') ? livePrice.toFixed(5) : livePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

            </div>

            {/* Toggle switch for Long vs Short */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Direction <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
                <button
                  type="button"
                  id="modal-toggle-long"
                  onClick={() => setDirection('LONG')}
                  className={`py-1.5 rounded-md font-bold transition-all flex items-center justify-center gap-1 ${
                    isLong
                      ? 'bg-blue-600 text-white shadow-sm border border-blue-400/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TrendingUp className="h-3 w-3" />
                  LONG
                </button>
                <button
                  type="button"
                  id="modal-toggle-short"
                  onClick={() => setDirection('SHORT')}
                  className={`py-1.5 rounded-md font-bold transition-all flex items-center justify-center gap-1 ${
                    !isLong
                      ? 'bg-orange-600 text-white shadow-sm border border-orange-400/50'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <TrendingDown className="h-3 w-3" />
                  SHORT
                </button>
              </div>
            </div>
          </div>

          {/* Numeric Input Fields: Entry Price, Exit Price */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Price &amp; Size Parameters
              </span>
              <button
                type="button"
                onClick={() => setIsCalcOpen(!isCalcOpen)}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold border transition-all ${
                  isCalcOpen
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-900 text-slate-300 hover:text-white border-slate-800'
                }`}
              >
                <Calculator className="h-3 w-3 text-emerald-400" />
                <span>{isCalcOpen ? 'Hide Calculator' : 'Risk % Sizing Helper'}</span>
              </button>
            </div>

            {/* Inline Position Size Calculator */}
            {isCalcOpen && (
              <div className="mb-3 animate-in fade-in slide-in-from-top-1 duration-150">
                <PositionSizeCalculator
                  currentBalance={currentBalance}
                  entryPrice={numEntry}
                  stopLoss={numSL}
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

            <div className="grid grid-cols-2 gap-3 font-mono">
              <div>
                <label htmlFor="modal-entry-price" className="text-[11px] font-medium text-slate-400 block mb-1">
                  Entry Price <span className="text-rose-400">*</span>
                </label>
                <input
                  id="modal-entry-price"
                  type="number"
                  step="any"
                  
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="modal-exit-price" className="text-[11px] font-medium text-slate-400 block mb-1">
                  Exit Price <span className="text-rose-400">*</span>
                </label>
                <input
                  id="modal-exit-price"
                  type="number"
                  step="any"
                  
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Numeric Input Fields: Stop Loss (SL), Take Profit (TP), and Lot Size */}
          <div className="grid grid-cols-3 gap-2.5 font-mono">
            <div>
              <label htmlFor="modal-stop-loss" className="text-[11px] font-medium text-slate-400 block mb-1">
                Stop Loss (SL)
              </label>
              <input
                id="modal-stop-loss"
                type="number"
                step="any"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="SL Price"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-rose-300 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label htmlFor="modal-take-profit" className="text-[11px] font-medium text-slate-400 block mb-1">
                Take Profit (TP)
              </label>
              <input
                id="modal-take-profit"
                type="number"
                step="any"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                placeholder="TP Price"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-emerald-300 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label htmlFor="modal-lot-size" className="text-[11px] font-medium text-slate-400 block mb-1">
                Lot Size
              </label>
              <input
                id="modal-lot-size"
                type="number"
                step="any"
                value={lotSize}
                onChange={(e) => setLotSize(e.target.value)}
                placeholder="1.0"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Interactive Risk/Reward Visualizer */}
          {(numEntry > 0 && numSL > 0 && numTP > 0) && (
            <div className="mt-1 bg-slate-900/50 border border-slate-800/80 rounded-xl p-3.5 relative overflow-hidden">
              {/* Background gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 via-transparent to-emerald-500/5"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                    Projected R:R Path
                  </span>
                  {(() => {
                    const rRisk = isLong ? (numEntry - numSL) : (numSL - numEntry);
                    const rReward = isLong ? (numTP - numEntry) : (numEntry - numTP);
                    if (rRisk <= 0 || rReward <= 0) {
                      return <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Invalid Setup</span>;
                    }
                    const ratio = (rReward / rRisk).toFixed(2);
                    return (
                      <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        1 : <span className="text-emerald-400">{ratio}</span>
                      </span>
                    );
                  })()}
                </div>

                {(() => {
                  const rRisk = isLong ? (numEntry - numSL) : (numSL - numEntry);
                  const rReward = isLong ? (numTP - numEntry) : (numEntry - numTP);
                  
                  if (rRisk > 0 && rReward > 0) {
                    const total = rRisk + rReward;
                    const riskPct = (rRisk / total) * 100;
                    const rewardPct = (rReward / total) * 100;

                    return (
                      <div className="space-y-2">
                        {/* The Visual Bar */}
                        <div className="relative h-2 w-full flex rounded-full overflow-hidden bg-slate-800 shadow-inner">
                          <div 
                            className="bg-rose-500 transition-all duration-500 ease-out" 
                            style={{ width: `${riskPct}%` }}
                          ></div>
                          <div 
                            className="bg-emerald-500 transition-all duration-500 ease-out" 
                            style={{ width: `${rewardPct}%` }}
                          ></div>
                          
                          {/* Entry Node */}
                          <div 
                            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-3.5 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.5)] z-10 transition-all duration-500 ease-out" 
                            style={{ left: `${riskPct}%`, transform: 'translate(-50%, -50%)' }}
                          ></div>
                        </div>

                        {/* Labels */}
                        <div className="flex justify-between items-center text-[10px] font-mono">
                          <div className="text-rose-400 flex flex-col items-start w-1/3">
                            <span className="opacity-70 font-sans font-bold text-[9px] uppercase">Stop Loss</span>
                            <span className="font-semibold">{numSL}</span>
                          </div>
                          <div className="text-white flex flex-col items-center w-1/3">
                            <span className="opacity-70 font-sans font-bold text-[9px] uppercase">Entry</span>
                            <span className="font-semibold">{numEntry}</span>
                          </div>
                          <div className="text-emerald-400 flex flex-col items-end w-1/3">
                            <span className="opacity-70 font-sans font-bold text-[9px] uppercase">Take Profit</span>
                            <span className="font-semibold">{numTP}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          )}

          {/* Text Area for Trade Notes / Strategy Setup */}
          <div>
            <label htmlFor="modal-trade-notes" className="text-xs font-semibold text-slate-300 block mb-1">
              Strategy Notes
            </label>
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden focus-within:border-emerald-500/60 transition-colors">
              <div className="bg-slate-800/50 px-2 py-1.5 flex items-center gap-1 border-b border-slate-800">
                <button 
                  type="button" 
                  onClick={() => document.execCommand('bold', false)} 
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                  title="Bold"
                >
                  <Bold className="h-3.5 w-3.5" />
                </button>
                <button 
                  type="button" 
                  onClick={() => document.execCommand('italic', false)} 
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                  title="Italic"
                >
                  <Italic className="h-3.5 w-3.5" />
                </button>
                <button 
                  type="button" 
                  onClick={() => document.execCommand('underline', false)} 
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                  title="Underline"
                >
                  <Underline className="h-3.5 w-3.5" />
                </button>
                <div className="w-px h-4 bg-slate-700 mx-1"></div>
                <button 
                  type="button" 
                  onClick={() => document.execCommand('insertUnorderedList', false)} 
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                  title="Bullet List"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button 
                  type="button" 
                  onClick={() => document.execCommand('insertOrderedList', false)} 
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                  title="Numbered List"
                >
                  <ListOrdered className="h-3.5 w-3.5" />
                </button>
              </div>
              <div
                id="modal-trade-notes"
                contentEditable
                className="w-full min-h-[80px] p-3 text-xs text-slate-200 focus:outline-none leading-relaxed prose prose-invert prose-sm max-w-none"
                onInput={(e) => setNotes(e.currentTarget.innerHTML)}
                dangerouslySetInnerHTML={{ __html: 'Clean reaction off 15m bullish demand, clean runner to 4h high.' }}
              />
            </div>
          </div>

          {/* Button to Upload Chart Screenshot */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Chart Screenshot</label>
              {chartScreenshot && (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <Check className="h-3 w-3" /> Attached ({screenshotName})
                </span>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Chart Screenshot</span>
              </button>

              {chartScreenshot && (
                <button
                  type="button"
                  onClick={() => {
                    setChartScreenshot(undefined);
                    setScreenshotName('');
                  }}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
                  title="Remove screenshot"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Actions with prominent Save Trade primary button */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="modal-save-trade-btn"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] rounded-lg transition-all shadow-[0_0_15px_rgba(52,211,153,0.3)] cursor-pointer"
            >
              Save Trade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
