import React, { useState, useMemo, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { fetchTrades, addTrade, removeTrade } from './lib/api';
import { User } from '@supabase/supabase-js';
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
import { SettingsView } from './components/SettingsView';
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
  const [user, setUser] = useState<User | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('trade_log');
  const [assetFilter, setAssetFilter] = useState<AssetClassFilter>('ALL');
  const [timeframe, setTimeframe] = useState<TimeframeFilter>('ALL');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);

  const [theme, setTheme] = useState({ bgColor: '#080c15', accentColor: '#10b981' });

  // Check active session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user?.user_metadata?.preferences) {
        const prefs = session.user.user_metadata.preferences;
        if (prefs.bgColor) setTheme(prev => ({ ...prev, bgColor: prefs.bgColor }));
        if (prefs.accentColor) setTheme(prev => ({ ...prev, accentColor: prefs.accentColor }));
      }

      if (!session?.user) {
        setTrades(INITIAL_TRADES); // Use mock data if not logged in (demo mode)
        setIsAppLoading(false);
      } else {
        loadUserTrades();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        if (session.user.user_metadata?.preferences) {
          const prefs = session.user.user_metadata.preferences;
          if (prefs.bgColor) setTheme(prev => ({ ...prev, bgColor: prefs.bgColor }));
          if (prefs.accentColor) setTheme(prev => ({ ...prev, accentColor: prefs.accentColor }));
        }
        loadUserTrades();
      } else {
        setTrades(INITIAL_TRADES);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handlePreferencesChange = (prefs: any) => {
    if (prefs.bgColor) setTheme(prev => ({ ...prev, bgColor: prefs.bgColor }));
    if (prefs.accentColor) setTheme(prev => ({ ...prev, accentColor: prefs.accentColor }));
  };

  const loadUserTrades = async () => {
    setIsAppLoading(true);
    const userTrades = await fetchTrades();
    setTrades(userTrades);
    setIsAppLoading(false);
  };

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

  const handleSaveTrade = async (savedTrade: Trade) => {
    // Optimistic UI Update
    setTrades(prev => {
      const existsIndex = prev.findIndex(t => t.id === savedTrade.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = savedTrade;
        return updated;
      }
      return [savedTrade, ...prev];
    });
    
    // Save to Supabase (if logged in)
    if (user) {
      try {
        await addTrade(savedTrade);
      } catch (err: any) {
        showToast('Error saving to database: ' + err.message);
        // We could revert the optimistic update here if needed
      }
    }
    
    showToast(`Trade on ${savedTrade.symbol} saved successfully! Net PnL: ${savedTrade.pnl >= 0 ? '+' : ''}$${savedTrade.pnl.toLocaleString()}`);
  };

  const handleDeleteTrade = async (id: string) => {
    // Optimistic UI Update
    setTrades(prev => prev.filter(t => t.id !== id));
    
    if (user) {
      try {
        await removeTrade(id);
      } catch (err: any) {
        showToast('Error deleting from database: ' + err.message);
      }
    }
    showToast('Trade entry removed from journal.');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isAppLoading) {
    return <div className="min-h-screen bg-[#080c15] flex items-center justify-center text-slate-400">Loading...</div>;
  }

  // If not authenticated, show Auth flow
  if (!user) {
    return <Auth onLogin={() => {}} />;
  }

  // Theme Helper
  const adjustColor = (hex: string, amount: number) => {
    let color = hex.replace(/^#/, '');
    if (color.length === 3) color = color.split('').map(c => c + c).join('');
    
    let r = parseInt(color.substring(0, 2), 16) || 0;
    let g = parseInt(color.substring(2, 4), 16) || 0;
    let b = parseInt(color.substring(4, 6), 16) || 0;
    
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    
    return `#${(r).toString(16).padStart(2, '0')}${(g).toString(16).padStart(2, '0')}${(b).toString(16).padStart(2, '0')}`;
  };

  const themeNav = adjustColor(theme.bgColor, 3);
  const themePanel = adjustColor(theme.bgColor, 6);
  const themeInner = adjustColor(theme.bgColor, 12);
  const themeHover = adjustColor(theme.bgColor, 16);
  const themeFooter = adjustColor(theme.bgColor, -2);

  return (
    <div 
      className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300 transition-colors duration-500"
      style={{ backgroundColor: theme.bgColor }}
    >
      <style>{`
        :root {
          --color-emerald-300: ${adjustColor(theme.accentColor, 40)};
          --color-emerald-400: ${theme.accentColor};
          --color-emerald-500: ${adjustColor(theme.accentColor, -20)};
          --color-emerald-600: ${adjustColor(theme.accentColor, -40)};
        }
        
        /* Override hardcoded Tailwind background classes across the app */
        .bg-\\[\\#080c15\\] { background-color: ${theme.bgColor} !important; }
        .bg-\\[\\#0b0f19\\] { background-color: ${themeNav} !important; }
        .bg-\\[\\#0e1422\\] { background-color: ${themePanel} !important; }
        .bg-\\[\\#161f33\\] { background-color: ${themeInner} !important; }
        .bg-\\[\\#1a253c\\] { background-color: ${themeHover} !important; }
        .bg-\\[\\#070a12\\] { background-color: ${themeFooter} !important; }
        
        .hover\\:bg-\\[\\#1a253c\\]:hover { background-color: ${themeHover} !important; }
      `}</style>
      
      {/* Top Navigation */}
      <Navbar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        assetFilter={assetFilter}
        setAssetFilter={setAssetFilter}
        onOpenLogModal={() => setIsLogModalOpen(true)}
        currentBalance={currentBalance}
        onLogout={handleLogout}
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
          <SettingsView user={user} onPreferencesChange={handlePreferencesChange} />
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
