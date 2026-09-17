import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { MetricCards } from './components/MetricCards';
import { EquityChart } from './components/EquityChart';
import { PairPerformanceChart } from './components/PairPerformanceChart';
import { WinLossDonut } from './components/WinLossDonut';
import { ProfitHeatmap } from './components/ProfitHeatmap';
import { CorrelationMatrix } from './components/CorrelationMatrix';
import { TradeLogView } from './components/TradeLogView';
import { BrokerSyncView } from './components/BrokerSyncView';
import { PositionCalculatorView } from './components/PositionCalculatorView';
import { LogTradeModal } from './components/LogTradeModal';
import { Auth } from './components/Auth';
import { LiveBrokerFeed } from './components/LiveBrokerFeed';
import { PriceAlertManager } from './components/PriceAlertManager';
import { ChartGalleryView } from './components/ChartGalleryView';
import { AICoachWidget } from './components/AICoachWidget';
import { 
  INITIAL_TRADES, 
  INITIAL_STARTING_BALANCE, 
  generateComprehensiveData, 
  calculateMetrics, 
  getPairStats 
} from './data/mockTrades';
import { ActiveTab, AssetClassFilter, TimeframeFilter, Trade } from './types';
import { 
  TrendingUp, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Clock, 
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trades, setTrades] = useState<Trade[]>(INITIAL_TRADES);
  const [activeTab, setActiveTab] = useState<ActiveTab>('trade_log');
  const [assetFilter, setAssetFilter] = useState<AssetClassFilter>('ALL');
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('ALL');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter trades by asset class if selected
  const filteredTrades = useMemo(() => {
    if (assetFilter === 'ALL') return trades;
    const match = assetFilter.toLowerCase();
    return trades.filter(t => t.assetClass === match);
  }, [trades, assetFilter]);

  // Derived metrics
  const metrics = useMemo(() => {
    return calculateMetrics(filteredTrades);
  }, [filteredTrades]);

  // Current balance
  const currentBalance = useMemo(() => {
    return INITIAL_STARTING_BALANCE + metrics.netProfit;
  }, [metrics.netProfit]);

  // Equity curve points
  const equityData = useMemo(() => {
    return generateComprehensiveData();
  }, [trades]);

  // Pair performance breakdown
  const pairStats = useMemo(() => {
    return getPairStats(trades);
  }, [trades]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSaveTrade = (savedTrade: Trade) => {
    setTrades(prev => {
      const existsIndex = prev.findIndex(t => t.id === savedTrade.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = savedTrade;
        return updated;
      }
      return [savedTrade, ...prev];
    });
    showToast(`Trade on ${savedTrade.symbol} saved successfully! Net PnL: ${savedTrade.pnl >= 0 ? '+' : ''}$${savedTrade.pnl.toLocaleString()}`);
  };

  const handleDeleteTrade = (id: string) => {
    setTrades(prev => prev.filter(t => t.id !== id));
    showToast('Trade entry removed from journal.');
  };

  // If not authenticated, show Auth flow
  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#080c15] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        assetFilter={assetFilter}
        setAssetFilter={setAssetFilter}
        onOpenLogModal={() => setIsLogModalOpen(true)}
        currentBalance={currentBalance}
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-2xl shadow-emerald-950/50 animate-in fade-in slide-in-from-bottom-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Dynamic Tab Views */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Live Broker Feed - Floating PnL & Positions */}
            <LiveBrokerFeed />

            {/* Primary Section (Top row): 4-5 large summary metric cards */}
            <MetricCards metrics={metrics} />

            {/* Secondary Section (Middle row): Large interactive line chart showing Equity/PnL curve */}
            <EquityChart
              data={equityData}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              startingBalance={INITIAL_STARTING_BALANCE}
            />

            {/* Tertiary Section (Bottom row): Split layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left side: Bar chart showing 'Performance by Pair' */}
              <div className="lg:col-span-6">
                <PairPerformanceChart 
                  pairs={pairStats} 
                  assetFilter={assetFilter} 
                />
              </div>

              {/* Middle: Circular donut chart showing 'Win/Loss Ratio' */}
              <div className="lg:col-span-3">
                <WinLossDonut metrics={metrics} />
              </div>

              {/* Right: Profit/Loss Heatmap */}
              <div className="lg:col-span-3">
                <ProfitHeatmap trades={filteredTrades} />
              </div>
            </div>

            {/* Quaternary Section (Bottom-most row): Exposure & Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <CorrelationMatrix />
              </div>
              <div className="lg:col-span-5">
                <PriceAlertManager />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trade_log' && (
          <TradeLogView
            trades={trades}
            onSaveTrade={handleSaveTrade}
            onDeleteTrade={handleDeleteTrade}
            onOpenLogModal={() => setIsLogModalOpen(true)}
            currentBalance={currentBalance}
          />
        )}

        {activeTab === 'chart_gallery' && (
          <ChartGalleryView trades={trades} />
        )}

        {activeTab === 'broker_sync' && (
          <BrokerSyncView />
        )}

        {activeTab === 'calculator' && (
          <PositionCalculatorView currentBalance={currentBalance} />
        )}

        {activeTab === 'settings' && (
          <div className="w-full max-w-4xl mx-auto">
            <div className="mb-6 flex flex-col gap-1">
              <h1 className="text-2xl font-black tracking-tight text-white">Account Settings</h1>
              <p className="text-sm font-medium text-slate-400">Manage your profile, preferences, and billing</p>
            </div>
            
            <div className="bg-[#0e1422] rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-6 md:p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="h-20 w-20 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-2xl font-bold text-white mb-4">
                AT
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Alex Trader</h2>
              <p className="text-slate-400 text-sm mb-6">alex@trader.com</p>
              
              <div className="w-full max-w-md bg-[#161f33] rounded-xl p-4 border border-slate-800/80 text-left space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                  <span className="text-sm font-semibold text-slate-300">Subscription Plan</span>
                  <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">PRO</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                  <span className="text-sm font-semibold text-slate-300">Base Currency</span>
                  <span className="text-sm font-mono text-white">USD ($)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-slate-300">Security</span>
                  <span className="text-sm font-medium text-cyan-400 cursor-pointer hover:text-cyan-300 transition-colors">Update Password</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer info bar */}
      <footer className="w-full border-t border-slate-900 bg-[#070a12] py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span>TradeEdge Terminal Engine v2.4</span>
            <span className="text-slate-400">•</span>
            <span>Institutional Quantitative Analytics</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
            <span>Latency: 12ms</span>
            <span>All Data Encrypted</span>
            <span>Auto-Calculated Edge</span>
          </div>
        </div>
      </footer>

      {/* Log Trade Modal */}
      <LogTradeModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onAddTrade={handleSaveTrade}
        currentBalance={currentBalance}
      />

      {/* Floating AI Coach Widget */}
      <AICoachWidget />
    </div>
  );
}
