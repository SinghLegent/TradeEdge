import React, { useState, useRef, useEffect } from 'react';
import { 
  TrendingUp, 
  LayoutDashboard, 
  BookOpen, 
  RefreshCw, 
  Plus, 
  ChevronDown, 
  ShieldCheck,
  Zap,
  Settings,
  Link,
  Sliders,
  LogOut,
  Image
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { ActiveTab, AssetClassFilter } from '../types';

interface NavbarProps {
  user: User;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  assetFilter: AssetClassFilter;
  setAssetFilter: (filter: AssetClassFilter) => void;
  onOpenLogModal: () => void;
  currentBalance: number;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  assetFilter,
  setAssetFilter,
  onOpenLogModal,
  currentBalance,
  onLogout,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand + Navigation tabs */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setActiveTab('dashboard')}>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <TrendingUp className="h-5 w-5 stroke-[2.5]" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-white">Trade<span className="text-emerald-400">Edge</span></span>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">PRO</span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 tracking-wide">Trader Journal & Analytics</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-dashboard-btn"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800/90 text-emerald-400 border border-slate-700/80 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </button>

            <button
              id="nav-tradelog-btn"
              onClick={() => setActiveTab('trade_log')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'trade_log'
                  ? 'bg-slate-800/90 text-emerald-400 border border-slate-700/80 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Trade Log</span>
            </button>

            <button
              id="nav-gallery-btn"
              onClick={() => setActiveTab('chart_gallery')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === 'chart_gallery'
                  ? 'bg-slate-800/90 text-emerald-400 border border-slate-700/80 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Image className="h-4 w-4" />
              <span>Chart Gallery</span>
            </button>

            <button
              id="nav-brokersync-btn"
              onClick={() => setActiveTab('broker_sync')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all relative ${
                activeTab === 'broker_sync'
                  ? 'bg-slate-800/90 text-emerald-400 border border-slate-700/80 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <RefreshCw className="h-4 w-4" />
              <span>Broker Sync</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 ml-0.5"></span>
            </button>

            <button
              id="nav-calculator-btn"
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-all relative ${
                activeTab === 'calculator'
                  ? 'bg-slate-800/90 text-emerald-400 border border-slate-700/80 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Zap className="h-4 w-4" />
              <span>Calculator</span>
            </button>
          </nav>
        </div>

        {/* Center: Market Session badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-200">NY / London Overlap Live</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">High Liquidity</span>
        </div>

        {/* Right: Asset filter pill, Log Trade CTA & Profile */}
        <div className="flex items-center gap-3">
          {/* MT5 Broker Status Badge */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider leading-none">Not Connected</span>
              <span className="text-[9px] text-slate-500 font-medium leading-tight">Link a broker in sync tab</span>
            </div>
          </div>

          {/* Quick Asset Filter */}
          <div className="hidden sm:flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-800">
            {(['ALL', 'FOREX', 'CRYPTO', 'STOCKS'] as AssetClassFilter[]).map((filter) => (
              <button
                key={filter}
                id={`filter-${filter.toLowerCase()}-btn`}
                onClick={() => setAssetFilter(filter)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  assetFilter === filter
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter === 'ALL' ? 'All' : filter === 'FOREX' ? 'Forex' : filter === 'CRYPTO' ? 'Crypto' : 'Stocks'}
              </button>
            ))}
          </div>

          {/* Log Trade CTA */}
          <button
            id="log-trade-btn"
            onClick={onOpenLogModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] rounded-lg transition-all shadow-[0_0_15px_rgba(52,211,153,0.3)] cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Log Trade</span>
          </button>

          {/* Profile & Account avatar */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-xs font-bold text-white font-mono">
                  ${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <p className="text-[10px] font-medium text-slate-400">Live $100k Funded</p>
            </div>
            
            <div className="relative" ref={dropdownRef}>
              <div 
                className="relative cursor-pointer transition-transform hover:scale-105 active:scale-95"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                  {initials}
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0b0f19]"></span>
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#161f33] border border-slate-700/80 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95">
                  {/* Header Section */}
                  <div className="px-4 py-3 bg-[#0e1422]">
                    <p className="text-sm font-bold text-white">{fullName}</p>
                    <p className="text-xs font-medium text-slate-400 truncate">{user.email}</p>
                  </div>
                  
                  <div className="border-t border-slate-800"></div>
                  
                  {/* Menu Items */}
                  <div className="p-1.5 flex flex-col gap-0.5">
                    <button 
                      onClick={() => {
                        setActiveTab('settings');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-[#1a253c] rounded-lg transition-colors flex items-center gap-2 font-medium"
                    >
                      <Settings className="h-4 w-4 text-slate-400" />
                      Account Settings
                    </button>
                    
                    <button 
                      onClick={() => {
                        setActiveTab('broker_sync');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-[#1a253c] rounded-lg transition-colors flex items-center gap-2 font-medium"
                    >
                      <Link className="h-4 w-4 text-slate-400" />
                      Broker Connections
                    </button>
                    
                    <button 
                      onClick={() => {
                        // Preferences could just stay on current tab or map to settings
                        setActiveTab('settings');
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-[#1a253c] rounded-lg transition-colors flex items-center gap-2 font-medium"
                    >
                      <Sliders className="h-4 w-4 text-slate-400" />
                      Preferences
                    </button>
                    
                    <div className="my-1 border-t border-slate-800"></div>
                    
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-2 font-bold"
                    >
                      <LogOut className="h-4 w-4" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav row */}
      <div className="flex md:hidden border-t border-slate-800/80 px-4 py-2 bg-slate-900/60 justify-around">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-1.5 text-xs font-medium py-1 px-2.5 rounded ${
            activeTab === 'dashboard' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('trade_log')}
          className={`flex items-center gap-1.5 text-xs font-medium py-1 px-2.5 rounded ${
            activeTab === 'trade_log' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Trade Log
        </button>
        <button
          onClick={() => setActiveTab('chart_gallery')}
          className={`flex items-center gap-1.5 text-xs font-medium py-1 px-2.5 rounded ${
            activeTab === 'chart_gallery' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400'
          }`}
        >
          <Image className="h-3.5 w-3.5" />
          Gallery
        </button>
        <button
          onClick={() => setActiveTab('broker_sync')}
          className={`flex items-center gap-1.5 text-xs font-medium py-1 px-2.5 rounded ${
            activeTab === 'broker_sync' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400'
          }`}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Broker Sync
        </button>
      </div>
    </header>
  );
};
