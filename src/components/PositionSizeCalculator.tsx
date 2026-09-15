import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  ShieldAlert, 
  ShieldCheck, 
  Percent, 
  DollarSign, 
  ArrowRight, 
  Check, 
  Sparkles, 
  ChevronDown, 
  HelpCircle,
  X,
  Layers,
  Info
} from 'lucide-react';
import { AssetClass } from '../types';

interface PositionSizeCalculatorProps {
  currentBalance?: number;
  entryPrice?: number;
  stopLoss?: number;
  assetClass?: AssetClass;
  symbol?: string;
  onApplyLotSize?: (recommendedLots: number) => void;
  onClose?: () => void;
  isInline?: boolean;
}

const RISK_PRESETS = [0.25, 0.5, 1.0, 1.5, 2.0];
const PRESET_PAIRS = ['EUR/USD', 'GBP/USD', 'XAU/USD', 'NAS100', 'US30', 'BTC/USD', 'ETH/USD'];

export const PositionSizeCalculator: React.FC<PositionSizeCalculatorProps> = ({
  currentBalance = 100000,
  entryPrice = 68450,
  stopLoss = 67500,
  assetClass = 'crypto',
  symbol = 'BTC/USDT',
  onApplyLotSize,
  onClose,
  isInline = false,
}) => {
  // Inputs
  const [balance, setBalance] = useState<string>(currentBalance.toString());
  const [riskPercent, setRiskPercent] = useState<string>('1.0');
  const [entry, setEntry] = useState<string>(entryPrice ? entryPrice.toString() : '68450');
  const [sl, setSl] = useState<string>(stopLoss ? stopLoss.toString() : '67500');
  
  // Local state for trading pair
  const [localSymbol, setLocalSymbol] = useState<string>(PRESET_PAIRS.includes(symbol || '') ? symbol! : (symbol === 'BTC/USDT' ? 'BTC/USD' : 'EUR/USD'));
  const [copied, setCopied] = useState(false);

  // Sync if props change
  useEffect(() => {
    if (entryPrice) setEntry(entryPrice.toString());
  }, [entryPrice]);

  useEffect(() => {
    if (stopLoss) setSl(stopLoss.toString());
  }, [stopLoss]);

  useEffect(() => {
    if (currentBalance) setBalance(currentBalance.toString());
  }, [currentBalance]);

  useEffect(() => {
    if (symbol) {
      if (PRESET_PAIRS.includes(symbol)) {
        setLocalSymbol(symbol);
      } else if (symbol === 'BTC/USDT') {
        setLocalSymbol('BTC/USD');
      }
    }
  }, [symbol]);

  // Numeric parsing
  const numBalance = parseFloat(balance) || 100000;
  const numRiskPercent = parseFloat(riskPercent) || 1.0;
  const numEntry = parseFloat(entry) || 1;
  const numSl = parseFloat(sl) || 0.9 * numEntry;

  // Calculation Logic
  const calculations = useMemo(() => {
    // 1. Cash Risk ($) = Current Balance * (Risk % / 100)
    const riskAmount = (numBalance * (numRiskPercent / 100));

    // 2. Stop Loss Distance
    const priceDistance = Math.abs(numEntry - numSl);
    const distancePercent = numEntry > 0 ? (priceDistance / numEntry) * 100 : 0;

    const isGold = localSymbol === 'XAU/USD';
    const isIndex = localSymbol === 'NAS100' || localSymbol === 'US30';
    const isCrypto = localSymbol === 'BTC/USD' || localSymbol === 'ETH/USD';
    const isForex = !isGold && !isIndex && !isCrypto;

    let rawLotSize = 0;
    let pipCount = 0;
    let cryptoExactUnits = 0;

    if (priceDistance > 0) {
      if (isForex) {
        rawLotSize = riskAmount / (priceDistance * 100000);
        pipCount = priceDistance * 10000;
      } else if (isGold) {
        rawLotSize = riskAmount / (priceDistance * 100);
        pipCount = priceDistance * 10;
      } else if (isIndex) {
        rawLotSize = riskAmount / priceDistance;
        pipCount = priceDistance;
      } else if (isCrypto) {
        rawLotSize = riskAmount / priceDistance;
        cryptoExactUnits = rawLotSize;
        pipCount = priceDistance;
      }
    }

    // Minimum size 0.01 lot
    const recommendedLotSize = Math.max(0.01, parseFloat(rawLotSize.toFixed(2)));

    // Risk category assessment
    let riskLevel: 'conservative' | 'standard' | 'high' = 'standard';
    if (numRiskPercent <= 0.75) riskLevel = 'conservative';
    else if (numRiskPercent > 1.75) riskLevel = 'high';

    return {
      riskAmount,
      priceDistance,
      distancePercent,
      pipCount,
      recommendedLotSize,
      isCrypto,
      cryptoExactUnits,
      cryptoCoin: isCrypto ? localSymbol.split('/')[0] : '',
      notionalValue: isForex ? recommendedLotSize * 100000 : recommendedLotSize * numEntry,
      riskLevel,
      isForex,
      isIndex
    };
  }, [numBalance, numRiskPercent, numEntry, numSl, localSymbol]);

  const handleApply = () => {
    if (onApplyLotSize) {
      onApplyLotSize(calculations.recommendedLotSize);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = (
    <div className="space-y-3.5">
      {/* Widget Header if standalone/modal */}
      {!isInline && (
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Calculator className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Position Size Calculator</h4>
              <p className="text-[11px] text-slate-400">Institutional risk-calibrated lot sizing</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Select Trading Pair */}
      <div className={!isInline ? "pt-1" : ""}>
        <label className="text-[11px] font-semibold text-slate-300 block mb-1">
          Select Trading Pair
        </label>
        <div className="relative">
          <select
            value={localSymbol}
            onChange={(e) => setLocalSymbol(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-3 pr-8 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500/60 appearance-none"
          >
            {PRESET_PAIRS.map(p => (
              <option key={p} value={p}>{p}{p === 'XAU/USD' ? ' (Gold)' : ''}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Primary Result Display Card */}
      <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#0c1220] via-slate-900 to-[#0e1628] border border-emerald-500/30 shadow-lg relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Recommended Position Size
            </span>
            <div className="flex flex-col mt-1">
              <div className="flex items-baseline gap-2">
                <span className="font-mono text-2xl font-black text-white tracking-tight">
                  {calculations.recommendedLotSize.toLocaleString()}
                </span>
                <span className="font-mono text-xs font-semibold text-emerald-400 uppercase">
                  Lots
                </span>
              </div>
              {calculations.isCrypto && (
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                  (~{calculations.cryptoExactUnits.toFixed(3)} {calculations.cryptoCoin})
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Max Dollar Risk</span>
            <span className="font-mono text-sm font-bold text-rose-400">
              -${calculations.riskAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-[10px] block font-semibold ${
              calculations.riskLevel === 'conservative' ? 'text-blue-400' :
              calculations.riskLevel === 'standard' ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {numRiskPercent}% of Account
            </span>
          </div>
        </div>

        {/* Breakdown bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-400">
          <div>
            <span className="text-slate-400 block">SL Distance</span>
            <span className="text-white font-semibold block">
              {calculations.distancePercent.toFixed(2)}%
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">
              {calculations.isForex ? 'Pips to SL' : 'Delta'}
            </span>
            <span className="text-white font-semibold block">
              {calculations.isForex ? `${calculations.pipCount.toFixed(1)} pips` : `$${calculations.priceDistance.toFixed(2)}`}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block">Notional Value</span>
            <span className="text-white font-semibold block truncate">
              ${calculations.notionalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {/* Input 1: Current Balance */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-emerald-400" />
            Current Account Balance
          </label>
          <span className="text-[10px] text-slate-400 font-mono">Live Equity</span>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">$</span>
          <input
            type="number"
            step="100"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="100000"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-7 pr-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-emerald-500/60"
          />
        </div>
      </div>

      {/* Input 2: Risk Percentage (%) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
            <Percent className="h-3 w-3 text-emerald-400" />
            Risk Percentage per Trade
          </label>
          <span className={`text-[10px] font-semibold uppercase ${
            calculations.riskLevel === 'conservative' ? 'text-blue-400' :
            calculations.riskLevel === 'standard' ? 'text-emerald-400' : 'text-amber-400'
          }`}>
            {calculations.riskLevel === 'conservative' ? 'Conservative' :
             calculations.riskLevel === 'standard' ? 'Optimal Risk' : 'High Risk'}
          </span>
        </div>

        {/* Quick percentage buttons */}
        <div className="grid grid-cols-5 gap-1 mb-1.5">
          {RISK_PRESETS.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => setRiskPercent(p.toString())}
              className={`py-1 text-[11px] font-mono rounded font-semibold transition-all ${
                parseFloat(riskPercent) === p
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-xs'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {p}%
            </button>
          ))}
        </div>

        <div className="relative">
          <input
            type="number"
            step="0.1"
            min="0.05"
            max="10"
            value={riskPercent}
            onChange={(e) => setRiskPercent(e.target.value)}
            placeholder="1.0"
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-emerald-500/60"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">%</span>
        </div>
      </div>

      {/* Input 3 & 4: Entry Price and Stop Loss */}
      <div className="grid grid-cols-2 gap-2 font-mono text-xs">
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Entry Price</label>
          <input
            type="number"
            step="any"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-emerald-500/60"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Stop Loss (SL)</label>
          <input
            type="number"
            step="any"
            value={sl}
            onChange={(e) => setSl(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-rose-300 focus:outline-none focus:border-rose-500/60"
          />
        </div>
      </div>

      {/* Apply to trade button */}
      {onApplyLotSize && (
        <button
          type="button"
          onClick={handleApply}
          className="w-full py-2 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.99] cursor-pointer"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
          <span>{copied ? 'Applied to Trade!' : `Apply ${calculations.recommendedLotSize} Lots to Form`}</span>
        </button>
      )}
    </div>
  );

  if (isInline) {
    return (
      <div className="rounded-xl border border-slate-800 bg-[#090d18] p-3.5 shadow-inner">
        {content}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-[#0e1422] p-4 shadow-2xl">
      {content}
    </div>
  );
};
