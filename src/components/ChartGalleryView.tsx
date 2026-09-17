import React, { useState, useMemo } from 'react';
import { Trade } from '../types';
import { 
  Image as ImageIcon, ZoomIn, Search, Filter, 
  Calendar, LayoutGrid, LayoutList, X,
  TrendingUp, TrendingDown, Clock, MoveHorizontal, Check
} from 'lucide-react';

interface ChartGalleryViewProps {
  trades: Trade[];
}

export const ChartGalleryView: React.FC<ChartGalleryViewProps> = ({ trades }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [pairFilter, setPairFilter] = useState('ALL');
  const [setupFilter, setSetupFilter] = useState('ALL');
  const [outcomeFilter, setOutcomeFilter] = useState<'ALL' | 'WIN' | 'LOSS' | 'BE'>('ALL');
  const [dateFilter, setDateFilter] = useState('ALL_TIME');
  const [viewMode, setViewMode] = useState<'GRID' | 'MASONRY'>('GRID');
  
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const PAIRS = ['ALL', ...Array.from(new Set(trades.map(t => t.symbol)))].sort();
  // Standardize setups from existing trades + common ones
  const COMMON_SETUPS = ["Fair Value Gap (FVG)", "Order Block (OB)", "Liquidity Sweep", "Break & Retest", "Breaker Block", "Trend Continuation"];
  const ALL_SETUPS = ['ALL', ...Array.from(new Set([...trades.map(t => t.setup), ...COMMON_SETUPS]))].sort();

  const filteredTrades = useMemo(() => {
    return trades.filter((t) => {
      // Must have a screenshot to be in the gallery
      if (!t.chartScreenshot) return false;

      const matchesSearch = 
        t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.setup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesPair = pairFilter === 'ALL' || t.symbol === pairFilter;
      const matchesSetup = setupFilter === 'ALL' || t.setup === setupFilter;
      const matchesOutcome = outcomeFilter === 'ALL' || t.outcome === outcomeFilter;
      
      // Date filter simplified for demo (normally would parse dates)
      // Since it's a prototype, we just allow them through for now
      const matchesDate = true;

      return matchesSearch && matchesPair && matchesSetup && matchesOutcome && matchesDate;
    });
  }, [trades, searchTerm, pairFilter, setupFilter, outcomeFilter, dateFilter]);

  return (
    <div className="flex flex-col h-full bg-[#0a0e17] rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl">
      {/* Page Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-800/80 bg-slate-900/50 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-emerald-400" />
            Trade Chart Gallery
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Visual database of past setups, confluences, and trade execution charts.
          </p>
        </div>
        
        {/* Result Pills Filter */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <FilterPill 
            active={outcomeFilter === 'ALL'} 
            label="All Trades" 
            onClick={() => setOutcomeFilter('ALL')} 
          />
          <FilterPill 
            active={outcomeFilter === 'WIN'} 
            label="Winning Trades Only" 
            colorClass="text-emerald-400 bg-emerald-500/20 border-emerald-500/30"
            onClick={() => setOutcomeFilter('WIN')} 
          />
          <FilterPill 
            active={outcomeFilter === 'LOSS'} 
            label="Losing Trades Only" 
            colorClass="text-rose-400 bg-rose-500/20 border-rose-500/30"
            onClick={() => setOutcomeFilter('LOSS')} 
          />
          <FilterPill 
            active={outcomeFilter === 'BE'} 
            label="Breakeven" 
            colorClass="text-slate-300 bg-slate-700/50 border-slate-600"
            onClick={() => setOutcomeFilter('BE')} 
          />
        </div>
      </div>

      {/* Toolbar / Filters (Sticky) */}
      <div className="px-6 py-4 border-b border-slate-800/80 bg-[#0e1422] flex flex-wrap gap-3 items-center sticky top-0 z-10">
        
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by notes or tags..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <select 
          value={pairFilter}
          onChange={e => setPairFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500/50 font-medium"
        >
          {PAIRS.map(p => (
            <option key={p} value={p}>{p === 'ALL' ? 'All Pairs' : p}</option>
          ))}
        </select>

        <select 
          value={setupFilter}
          onChange={e => setSetupFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500/50 font-medium max-w-[200px]"
        >
          {ALL_SETUPS.map(s => (
            <option key={s} value={s}>{s === 'ALL' ? 'All Setups' : s}</option>
          ))}
        </select>

        <select 
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500/50 font-medium"
        >
          <option value="ALL_TIME">All Time</option>
          <option value="THIS_WEEK">This Week</option>
          <option value="THIS_MONTH">This Month</option>
        </select>

        <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 p-1 rounded-lg">
          <button 
            onClick={() => setViewMode('GRID')}
            className={`p-1.5 rounded ${viewMode === 'GRID' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setViewMode('MASONRY')}
            className={`p-1.5 rounded ${viewMode === 'MASONRY' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <LayoutList className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Gallery Main Area */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#0a0e17]">
        {filteredTrades.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <ImageIcon className="h-12 w-12 opacity-20 mb-3" />
            <p className="font-medium text-slate-400">No chart screenshots found matching your filters.</p>
          </div>
        ) : (
          <div className={
            viewMode === 'GRID' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
              : "columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
          }>
            {filteredTrades.map(trade => (
              <ChartCard 
                key={trade.id} 
                trade={trade} 
                viewMode={viewMode}
                onClick={() => setSelectedTrade(trade)} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedTrade && (
        <LightboxModal trade={selectedTrade} onClose={() => setSelectedTrade(null)} />
      )}
    </div>
  );
};

// --- Subcomponents ---

const FilterPill = ({ active, label, colorClass, onClick }: { active: boolean, label: string, colorClass?: string, onClick: () => void }) => {
  const defaultClass = active 
    ? 'bg-slate-800 text-white border-slate-600' 
    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/50';
  
  return (
    <button 
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-all ${active && colorClass ? colorClass : defaultClass}`}
    >
      {label}
    </button>
  );
}

const ChartCard: React.FC<{ trade: Trade, viewMode: 'GRID'|'MASONRY', onClick: () => void }> = ({ trade, viewMode, onClick }) => {
  const isWin = trade.outcome === 'WIN';
  const isLoss = trade.outcome === 'LOSS';
  const isBE = trade.outcome === 'BREAKEVEN';
  const isLong = trade.direction === 'LONG';

  // Base styling for outcome
  let borderColor = 'border-slate-800';
  let accentColor = 'bg-slate-600';
  let glowColor = 'group-hover:shadow-slate-800/50';
  let pnlColor = 'text-slate-300';
  let bgClass = 'bg-[#121929]';

  if (isWin) {
    borderColor = 'border-emerald-500/30';
    accentColor = 'bg-emerald-500';
    glowColor = 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] group-hover:border-emerald-500/50';
    pnlColor = 'text-emerald-400';
    bgClass = 'bg-[#0f1f1d]'; // Slight green tint
  } else if (isLoss) {
    borderColor = 'border-rose-500/30';
    accentColor = 'bg-rose-500';
    glowColor = 'group-hover:shadow-[0_0_20px_rgba(244,63,94,0.15)] group-hover:border-rose-500/50';
    pnlColor = 'text-rose-400';
    bgClass = 'bg-[#231215]'; // Slight red tint
  }

  const wrapperClass = viewMode === 'MASONRY' ? 'break-inside-avoid mb-6' : '';

  return (
    <div 
      onClick={onClick}
      className={`group cursor-pointer rounded-xl border ${borderColor} ${glowColor} transition-all duration-300 overflow-hidden relative flex flex-col ${bgClass} ${wrapperClass}`}
    >
      {/* Left Accent Line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor} z-10`}></div>

      {/* Image Container with Hover Zoom Overlay */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900 border-b border-slate-800/50">
        <img 
          src={trade.chartScreenshot} 
          alt={`${trade.symbol} chart`}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm border border-white/10">
            <ZoomIn className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2 left-3 right-2 flex justify-between items-start pointer-events-none">
          <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800/80 rounded px-2 py-1 flex items-center gap-1.5 shadow-lg">
            <span className="text-xs font-black text-white">{trade.symbol}</span>
            <span className="text-[10px] text-slate-400 font-bold bg-slate-800 px-1 rounded">{trade.timeframe}</span>
          </div>
          
          <div className={`bg-slate-950/90 backdrop-blur-md border ${borderColor} rounded px-2 py-1 shadow-lg`}>
            <span className={`text-xs font-black ${pnlColor}`}>
              {isWin ? '+' : ''}{trade.riskReward ? `${trade.riskReward.toFixed(2)} R` : '---'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content Footer */}
      <div className="p-4 flex flex-col gap-3 pl-5">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-800/50 text-slate-300 border border-slate-700/50">
            {trade.setup}
          </span>
        </div>

        {/* Meta Bar */}
        <div className="flex items-center justify-between text-xs font-medium border-t border-slate-800/50 pt-3 mt-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="h-3 w-3" />
            {trade.date.split(' ')[0]}
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${isLong ? 'text-blue-400 bg-blue-500/10' : 'text-orange-400 bg-orange-500/10'}`}>
              {trade.direction}
            </span>
            <span className={`font-mono font-bold ${pnlColor}`}>
              {isWin ? '+' : ''}{isBE ? '' : '$'}{Math.abs(trade.pnl).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LightboxModal = ({ trade, onClose }: { trade: Trade, onClose: () => void }) => {
  const isWin = trade.outcome === 'WIN';
  const isLoss = trade.outcome === 'LOSS';
  const isBE = trade.outcome === 'BREAKEVEN';
  const isLong = trade.direction === 'LONG';

  let pnlColor = 'text-slate-300';
  let badgeClass = 'bg-slate-800 text-slate-300 border-slate-700';
  
  if (isWin) {
    pnlColor = 'text-emerald-400';
    badgeClass = 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  } else if (isLoss) {
    pnlColor = 'text-rose-400';
    badgeClass = 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  }

  // Extract a fake list of confluences from notes if any, or provide defaults
  const confluences = trade.notes 
    ? trade.notes.replace(/<[^>]*>?/gm, '').split('.').filter(s => s.trim().length > 5) 
    : ["Price swept Asian High liquidity", "1H FVG created strong displacement", "Entered on 5m Break of Structure"];

  if (confluences.length === 0) confluences.push("Executed according to plan");

  return (
    <div className="fixed inset-0 z-50 flex bg-[#030712]/95 backdrop-blur-sm animate-fade-in">
      {/* Close button - Top Right absolute */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full backdrop-blur-md border border-slate-700 transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Main Image Viewer Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative group">
        <div className="absolute top-6 left-6 z-40 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 shadow-2xl flex flex-col gap-1">
           <div className="flex items-center gap-2">
             <span className="text-lg font-black text-white">{trade.symbol}</span>
             <span className="text-xs font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">{trade.timeframe}</span>
           </div>
           <span className="text-xs font-semibold text-slate-400">{trade.date}</span>
        </div>

        <img 
          src={trade.chartScreenshot} 
          alt="Full screen chart" 
          className="max-w-full max-h-full object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        />
        
        {/* Optional before/after toggle mock */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700 p-1 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="px-4 py-1.5 rounded-full bg-slate-700 text-white text-xs font-bold shadow-sm">Setup (Before)</button>
          <button className="px-4 py-1.5 rounded-full text-slate-400 hover:text-white text-xs font-bold transition-colors">Outcome (After)</button>
        </div>
      </div>

      {/* Side Details Panel */}
      <div className="w-96 bg-[#0a0e17] border-l border-slate-800 flex flex-col shadow-2xl h-full overflow-y-auto custom-scrollbar relative z-40 animate-slide-in-right">
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-black text-white">Trade Details</h2>
            <div className={`px-2.5 py-1 rounded-md text-xs font-black uppercase border shadow-lg ${badgeClass}`}>
              {trade.outcome}
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-[#121929] rounded-lg p-3 border border-slate-800/80">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Direction</p>
              <p className={`font-black text-sm uppercase flex items-center gap-1 ${isLong ? 'text-blue-400' : 'text-orange-400'}`}>
                {isLong ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {trade.direction}
              </p>
            </div>
            <div className="bg-[#121929] rounded-lg p-3 border border-slate-800/80">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Net PnL</p>
              <p className={`font-mono font-black text-sm ${pnlColor}`}>
                {isWin ? '+' : ''}{isBE ? '' : '$'}{Math.abs(trade.pnl).toFixed(2)}
              </p>
            </div>
            <div className="bg-[#121929] rounded-lg p-3 border border-slate-800/80">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Risk / Reward</p>
              <p className="font-mono font-black text-sm text-white">
                {trade.riskReward ? `1 : ${trade.riskReward.toFixed(2)}` : 'N/A'}
              </p>
            </div>
            <div className="bg-[#121929] rounded-lg p-3 border border-slate-800/80">
              <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Lot Size</p>
              <p className="font-mono font-black text-sm text-white">{trade.lotSize} Lots</p>
            </div>
          </div>

          {/* Technical Execution Box */}
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 font-mono text-xs">
            <div className="flex justify-between mb-2">
              <span className="text-slate-500 font-bold font-sans uppercase text-[10px]">Entry</span>
              <span className="text-white font-semibold">{trade.entryPrice}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-rose-500/80 font-bold font-sans uppercase text-[10px]">Stop Loss</span>
              <span className="text-rose-300 font-semibold">{trade.stopLoss || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-500/80 font-bold font-sans uppercase text-[10px]">Take Profit</span>
              <span className="text-emerald-300 font-semibold">{trade.takeProfit || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 flex flex-col gap-6">
          {/* Setup Category */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Setup Categorization</h3>
            <span className="inline-block px-3 py-1.5 bg-slate-800 text-slate-200 text-xs font-bold rounded-md border border-slate-700 shadow-sm">
              {trade.setup}
            </span>
          </div>

          {/* Confluences List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Trade Confluences</h3>
            <ul className="space-y-2">
              {confluences.map((conf, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <div className="mt-0.5 rounded-sm bg-emerald-500/20 text-emerald-400 p-0.5 border border-emerald-500/30">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </div>
                  <span className="font-medium leading-tight">{conf.trim()}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Notes */}
          {trade.notes && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Execution Notes</h3>
              <div 
                className="prose prose-invert prose-sm max-w-none text-slate-400 bg-slate-900/30 p-4 rounded-xl border border-slate-800/50 leading-relaxed text-xs"
                dangerouslySetInnerHTML={{ __html: trade.notes }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
