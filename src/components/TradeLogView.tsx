import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Tag, 
  FileText, 
  Trash2, 
  Download, 
  Edit3, 
  Plus, 
  Image as ImageIcon, 
  Eye, 
  SlidersHorizontal,
  ChevronRight,
  PanelRightClose,
  PanelRightOpen,
  ArrowUpDown,
  Sparkles,
  Layers,
  Calculator
} from 'lucide-react';
import { Trade, TradeOutcome, AssetClassFilter } from '../types';
import { TradeEntryPanel } from './TradeEntryPanel';
import { PositionSizeCalculator } from './PositionSizeCalculator';

interface TradeLogViewProps {
  trades: Trade[];
  onSaveTrade: (trade: Trade) => void;
  onDeleteTrade: (id: string) => void;
  onOpenLogModal?: () => void;
  currentBalance?: number;
}

export const TradeLogView: React.FC<TradeLogViewProps> = ({
  trades,
  onSaveTrade,
  onDeleteTrade,
  onOpenLogModal,
  currentBalance = 102750,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState<'ALL' | TradeOutcome>('ALL');
  const [assetFilter, setAssetFilter] = useState<AssetClassFilter>('ALL');
  const [sortBy, setSortBy] = useState<'date' | 'pnl' | 'rr'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  
  // Side Panel State: default open so traders immediately have the right side panel visible!
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [panelMode, setPanelMode] = useState<'docked' | 'overlay'>('docked');
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [isStandaloneCalcOpen, setIsStandaloneCalcOpen] = useState(false);

  // Screenshot modal preview
  const [previewScreenshot, setPreviewScreenshot] = useState<{ url: string; title: string } | null>(null);

  // Filtering & Sorting
  const filteredAndSortedTrades = useMemo(() => {
    return trades
      .filter((t) => {
        const matchesSearch = 
          t.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.setup.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesOutcome = outcomeFilter === 'ALL' || t.outcome === outcomeFilter;
        const matchesAsset = assetFilter === 'ALL' || t.assetClass === assetFilter.toLowerCase();

        return matchesSearch && matchesOutcome && matchesAsset;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'date') comp = b.timestamp - a.timestamp;
        else if (sortBy === 'pnl') comp = b.pnl - a.pnl;
        else if (sortBy === 'rr') comp = b.riskReward - a.riskReward;
        return sortOrder === 'desc' ? comp : -comp;
      });
  }, [trades, searchTerm, outcomeFilter, assetFilter, sortBy, sortOrder]);

  // Aggregate stats for filtered trades
  const stats = useMemo(() => {
    const total = filteredAndSortedTrades.length;
    const wins = filteredAndSortedTrades.filter(t => t.outcome === 'WIN').length;
    const losses = filteredAndSortedTrades.filter(t => t.outcome === 'LOSS').length;
    const netPnl = filteredAndSortedTrades.reduce((acc, t) => acc + t.pnl, 0);
    const winRate = total > 0 ? (wins / total) * 100 : 0;
    return { total, wins, losses, netPnl, winRate };
  }, [filteredAndSortedTrades]);

  // Export CSV
  const exportCsv = () => {
    const headers = ['ID', 'Date', 'Symbol', 'Asset', 'Direction', 'Entry', 'Exit', 'SL', 'TP', 'Lots', 'Net PnL', 'PnL %', 'R:R', 'Outcome', 'Setup', 'Notes'];
    const rows = filteredAndSortedTrades.map(t => [
      t.id,
      t.date,
      t.symbol,
      t.assetClass,
      t.direction,
      t.entryPrice,
      t.exitPrice,
      t.stopLoss || '',
      t.takeProfit || '',
      t.lotSize || 1,
      t.pnl,
      t.pnlPercent,
      t.riskReward,
      t.outcome,
      `"${t.setup}"`,
      `"${t.notes || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `trade_journal_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenAddTrade = () => {
    setEditingTrade(null);
    setIsSidePanelOpen(true);
    
    setTimeout(() => {
      const panel = document.getElementById('trade-entry-panel');
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        panel.classList.add('ring-2', 'ring-emerald-500', 'ring-offset-4', 'ring-offset-[#030712]');
        setTimeout(() => {
          panel.classList.remove('ring-2', 'ring-emerald-500', 'ring-offset-4', 'ring-offset-[#030712]');
        }, 800);
      }
      // Focus an input field to bring it into view and state
      document.getElementById('input-entry-price')?.focus();
    }, 50);
  };

  const handleSelectTradeForEdit = (trade: Trade) => {
    setEditingTrade(trade);
    setIsSidePanelOpen(true);
    
    setTimeout(() => {
      const panel = document.getElementById('trade-entry-panel');
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        panel.classList.add('ring-2', 'ring-blue-500', 'ring-offset-4', 'ring-offset-[#030712]');
        setTimeout(() => {
          panel.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-4', 'ring-offset-[#030712]');
        }, 800);
      }
      document.getElementById('input-entry-price')?.focus();
    }, 50);
  };

  return (
    <div className="space-y-4">
      {/* Top Controls & Filter Bar */}
      <div className="bg-[#0e1422] p-4 rounded-xl border border-slate-800 shadow-lg space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              id="trade-search-input"
              type="text"
              placeholder="Search by pair (BTC/USDT), setup, notes, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          {/* Quick Filter Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Win/Loss Outcome Filter (Subtle Pill Shapes) */}
            <div className="flex items-center rounded-lg bg-slate-900/90 p-1 border border-slate-800 text-xs">
              {(['ALL', 'WIN', 'LOSS', 'BREAKEVEN'] as const).map((oc) => (
                <button
                  key={oc}
                  onClick={() => setOutcomeFilter(oc)}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    outcomeFilter === oc
                      ? oc === 'WIN' 
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30' 
                        : oc === 'LOSS'
                        ? 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30'
                        : 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {oc === 'ALL' ? 'All Results' : oc === 'WIN' ? 'Wins' : oc === 'LOSS' ? 'Losses' : 'BE'}
                </button>
              ))}
            </div>

            {/* Asset Class Filter */}
            <div className="hidden sm:flex items-center rounded-lg bg-slate-900/90 p-1 border border-slate-800 text-xs">
              {(['ALL', 'FOREX', 'CRYPTO', 'STOCKS'] as AssetClassFilter[]).map((ac) => (
                <button
                  key={ac}
                  onClick={() => setAssetFilter(ac)}
                  className={`px-2 py-1 rounded font-medium transition-all ${
                    assetFilter === ac
                      ? 'bg-slate-800 text-emerald-400 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ac === 'ALL' ? 'All' : ac === 'FOREX' ? 'Forex' : ac === 'CRYPTO' ? 'Crypto' : 'Stocks'}
                </button>
              ))}
            </div>

            {/* Position Size Calculator Trigger */}
            <button
              id="open-size-calc-btn"
              onClick={() => setIsStandaloneCalcOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-300 bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 rounded-lg transition-all"
              title="Position Size Calculator (Balance & Risk %)"
            >
              <Calculator className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Size Calc</span>
            </button>

            {/* CSV Export */}
            <button
              onClick={exportCsv}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all"
              title="Export filtered trades as CSV"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            {/* Toggle Side Panel Visibility */}
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                isSidePanelOpen
                  ? 'bg-slate-800 text-emerald-400 border-slate-700'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
              title={isSidePanelOpen ? 'Collapse Entry Side Panel' : 'Show Entry Side Panel'}
            >
              {isSidePanelOpen ? <PanelRightClose className="h-3.5 w-3.5" /> : <PanelRightOpen className="h-3.5 w-3.5" />}
              <span className="hidden md:inline">{isSidePanelOpen ? 'Hide Panel' : 'Side Panel'}</span>
            </button>

            {/* Prominent "+ Add Trade" CTA */}
            <button
              id="open-add-trade-btn"
              onClick={handleOpenAddTrade}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] rounded-lg transition-all shadow-[0_0_12px_rgba(52,211,153,0.3)] cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Add Trade</span>
            </button>
          </div>
        </div>

        {/* Live Filter Metric Summary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4 font-mono">
            <span>
              Showing <strong className="text-white">{stats.total}</strong> trades
            </span>
            <span className="text-slate-600">•</span>
            <span>
              Win Rate: <strong className="text-emerald-400">{stats.winRate.toFixed(1)}%</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span>
              Filtered Net PnL:{' '}
              <strong className={stats.netPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {stats.netPnl >= 0 ? '+' : ''}${stats.netPnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-slate-300 font-mono focus:outline-none"
            >
              <option value="date">Date / Time</option>
              <option value="pnl">Net PnL</option>
              <option value="rr">Risk:Reward (R:R)</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              title={`Switch to ${sortOrder === 'desc' ? 'ascending' : 'descending'} order`}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Area: Split Layout (Data Table + Right Side Panel) */}
      <div className="flex flex-col lg:flex-row items-start gap-4">
        {/* Main Area: Detailed Data Table */}
        <div className={`w-full transition-all duration-300 ${
          isSidePanelOpen ? 'lg:flex-1 min-w-0' : 'w-full'
        }`}>
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0e1422] shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-3.5 whitespace-nowrap">Date / Time</th>
                  <th className="py-3.5 px-3 whitespace-nowrap">Pair / Ticker</th>
                  <th className="py-3.5 px-3 whitespace-nowrap">Direction</th>
                  <th className="py-3.5 px-3.5 whitespace-nowrap">Entry Price</th>
                  <th className="py-3.5 px-3.5 whitespace-nowrap">Exit Price</th>
                  <th className="py-3.5 px-3 whitespace-nowrap">Result</th>
                  <th className="py-3.5 px-3.5 text-right whitespace-nowrap">Net PnL</th>
                  <th className="py-3.5 px-3 text-center whitespace-nowrap">Parameters</th>
                  <th className="py-3.5 px-3 text-center whitespace-nowrap">Chart</th>
                  <th className="py-3.5 px-3 text-center whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredAndSortedTrades.map((t) => {
                  const isWin = t.outcome === 'WIN';
                  const isLoss = t.outcome === 'LOSS';
                  const isLong = t.direction === 'LONG';
                  const isSelected = editingTrade?.id === t.id;

                  return (
                    <tr
                      key={t.id}
                      onClick={() => handleSelectTradeForEdit(t)}
                      className={`transition-colors cursor-pointer group ${
                        isSelected 
                          ? 'bg-slate-800/80 border-l-4 border-l-emerald-400' 
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      {/* 1. Date/Time */}
                      <td className="py-3 px-3.5 font-mono whitespace-nowrap">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <span>{t.date}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span className="font-bold text-slate-400">{t.id}</span>
                          <span>•</span>
                          <span>{t.duration || '2h'}</span>
                        </div>
                      </td>

                      {/* 2. Pair/Ticker */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold font-mono text-white text-sm tracking-tight">{t.symbol}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${
                            t.assetClass === 'crypto'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : t.assetClass === 'forex'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          }`}>
                            {t.assetClass}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px] mt-0.5">
                          {t.setup}
                        </div>
                      </td>

                      {/* 3. Long/Short Tag (Pill-shaped: Long is blue, Short is orange) */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold font-mono ${
                          isLong
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                            : 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                        }`}>
                          {isLong ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {t.direction}
                        </span>
                      </td>

                      {/* 4. Entry Price */}
                      <td className="py-3 px-3.5 font-mono text-slate-200 whitespace-nowrap">
                        <span className="font-semibold text-white">
                          ${t.entryPrice.toLocaleString('en-US', { minimumFractionDigits: t.entryPrice < 10 ? 4 : 2 })}
                        </span>
                        {t.stopLoss && (
                          <div className="text-[10px] text-rose-400/80">
                            SL: ${t.stopLoss.toLocaleString('en-US', { minimumFractionDigits: t.stopLoss < 10 ? 4 : 2 })}
                          </div>
                        )}
                      </td>

                      {/* 5. Exit Price */}
                      <td className="py-3 px-3.5 font-mono text-slate-200 whitespace-nowrap">
                        <span className="font-semibold text-white">
                          ${t.exitPrice.toLocaleString('en-US', { minimumFractionDigits: t.exitPrice < 10 ? 4 : 2 })}
                        </span>
                        {t.takeProfit && (
                          <div className="text-[10px] text-emerald-400/80">
                            TP: ${t.takeProfit.toLocaleString('en-US', { minimumFractionDigits: t.takeProfit < 10 ? 4 : 2 })}
                          </div>
                        )}
                      </td>

                      {/* 6. Result (Win/Loss tag: Pill-shaped: Win is green, Loss is red) */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase font-mono ${
                          isWin
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : isLoss
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-slate-700/30 text-slate-300 border border-slate-600/30'
                        }`}>
                          {t.outcome}
                        </span>
                      </td>

                      {/* 7. Net PnL */}
                      <td className="py-3 px-3.5 text-right font-mono whitespace-nowrap">
                        <span className={`font-bold text-sm block ${
                          isWin ? 'text-emerald-400' : isLoss ? 'text-rose-400' : 'text-amber-400'
                        }`}>
                          {t.pnl >= 0 ? '+' : ''}${t.pnl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {t.pnlPercent >= 0 ? '+' : ''}{t.pnlPercent}%
                        </span>
                      </td>

                      {/* Extra: Parameters (Lot Size & Realized R:R) */}
                      <td className="py-3 px-3 text-center font-mono whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-200">
                            {t.riskReward > 0 ? `+${t.riskReward}R` : `${t.riskReward}R`}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {t.lotSize ? `${t.lotSize}L` : '1L'}
                          </span>
                        </div>
                      </td>

                      {/* Chart Screenshot Badge */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {t.chartScreenshot ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewScreenshot({
                                url: t.chartScreenshot!,
                                title: `${t.symbol} • ${t.setup} (${t.timeframe})`
                              });
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 hover:text-emerald-300 text-[11px] font-mono transition-colors"
                            title="Click to view chart screenshot"
                          >
                            <ImageIcon className="h-3 w-3" />
                            <span>View</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-mono">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectTradeForEdit(t);
                            }}
                            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                            title="Edit trade in side panel"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteTrade(t.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors"
                            title="Delete trade"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredAndSortedTrades.length === 0 && (
              <div className="py-16 text-center text-slate-400">
                <FileText className="h-10 w-10 mx-auto text-slate-400 mb-3 opacity-40" />
                <p className="text-sm font-semibold text-white">No trades match your filters</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Try adjusting the search query, clearing the filters, or click "+ Add Trade" to log a new entry.
                </p>
                <button
                  onClick={handleOpenAddTrade}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-400 text-slate-950 rounded-lg text-xs font-bold hover:bg-emerald-300 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Log New Trade</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Panel (or Overlay): Comprehensive "Add/Edit Trade" Form */}
        {isSidePanelOpen && (
          <aside id="trade-entry-panel" className="w-full lg:w-[440px] xl:w-[480px] shrink-0 rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-[#0c101d] sticky top-20 transition-all duration-300">
            <TradeEntryPanel
              isOpen={isSidePanelOpen}
              onClose={() => {
                setIsSidePanelOpen(false);
                setEditingTrade(null);
              }}
              onSaveTrade={(saved) => {
                onSaveTrade(saved);
                setEditingTrade(null);
              }}
              editingTrade={editingTrade}
              onClearEditing={() => setEditingTrade(null)}
              currentBalance={currentBalance}
            />
          </aside>
        )}
      </div>

      {/* Standalone Position Size Calculator Helper Modal */}
      {isStandaloneCalcOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md">
            <PositionSizeCalculator
              currentBalance={currentBalance}
              isInline={false}
              onClose={() => setIsStandaloneCalcOpen(false)}
              onApplyLotSize={(size) => {
                setIsStandaloneCalcOpen(false);
                setIsSidePanelOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Screenshot Zoom Modal */}
      {previewScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-4xl bg-[#0e1424] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-emerald-400" />
                <span className="font-bold text-sm text-white font-mono">{previewScreenshot.title}</span>
              </div>
              <button
                onClick={() => setPreviewScreenshot(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="w-full h-[60vh] max-h-[600px] flex items-center justify-center bg-[#070a12] rounded-xl overflow-hidden">
              <img
                src={previewScreenshot.url}
                alt="Enlarged Chart Preview"
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
