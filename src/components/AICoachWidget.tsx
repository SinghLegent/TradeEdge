import React, { useState, useEffect } from 'react';
import { 
  X, MessageSquare, ShieldAlert, LineChart, 
  Send, Image as ImageIcon, Sparkles, TrendingUp,
  AlertTriangle, CheckCircle2, ChevronRight
} from 'lucide-react';

export const AICoachWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'pre_trade' | 'audit' | 'chat'>('pre_trade');
  const [tooltipText, setTooltipText] = useState('Need a trade check?');
  const [showTooltip, setShowTooltip] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  // Pre-Trade Check State
  const [preTradeForm, setPreTradeForm] = useState({
    pair: 'EUR/USD',
    direction: 'LONG',
    entry: '',
    sl: '',
    tp: '',
    confluences: [] as string[]
  });
  const [preTradeResult, setPreTradeResult] = useState<null | 'loading' | 'done'>(null);

  // Trade Audit State
  const [auditState, setAuditState] = useState<'idle' | 'loading' | 'done'>('idle');

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', content: "Hey! I'm KAI. How can I help you protect your capital today?" }
  ]);
  const [chatInput, setChatInput] = useState('');

  const TOOLTIPS = [
    "Need a trade check?",
    "Analyze my last setup!",
    "Watch your risk!",
    "Are you trading your plan?"
  ];

  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
      return;
    }
    
    const interval = setInterval(() => {
      setTooltipText(TOOLTIPS[Math.floor(Math.random() * TOOLTIPS.length)]);
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 5000);
    }, 15000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const toggleConfluence = (c: string) => {
    setPreTradeForm(prev => ({
      ...prev,
      confluences: prev.confluences.includes(c) 
        ? prev.confluences.filter(x => x !== c)
        : [...prev.confluences, c]
    }));
  };

  const handleEvaluateSetup = () => {
    setPreTradeResult('loading');
    setTimeout(() => {
      setPreTradeResult('done');
    }, 1500);
  };

  const handleRunAudit = () => {
    setAuditState('loading');
    setTimeout(() => {
      setAuditState('done');
    }, 2000);
  };

  const handleSendChat = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;
    
    const newMsg = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
    
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'ai', content: "I'm analyzing your request. As an AI, I'd say always stick to your max risk per trade!" }]);
    }, 1000);
  };

  const sendQuickPrompt = (prompt: string) => {
    setChatInput(prompt);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { role: 'user', content: prompt }]);
      setChatInput('');
      setTimeout(() => {
        setChatMessages(prev => [...prev, { role: 'ai', content: "Good question! Let's break down your recent data to find out why." }]);
      }, 1000);
    }, 50);
  };

  const CONFLUENCE_OPTIONS = ["FVG respected", "Key Level", "Trend Aligned", "Liquidity Swept", "Session Open"];

  return (
    <>
      {/* Floating Mascot Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
        
        {/* Speech Bubble */}
        <div className={`transition-all duration-500 origin-bottom-right mb-4 ${showTooltip && !isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
          <div className="bg-slate-800 border border-emerald-500/30 text-white text-xs font-bold px-4 py-2.5 rounded-2xl rounded-br-sm shadow-xl relative pointer-events-auto cursor-pointer" onClick={() => setIsOpen(true)}>
            {tooltipText}
            {/* Little pointer triangle */}
            <div className="absolute -bottom-2 right-2 w-3 h-3 bg-slate-800 border-b border-r border-emerald-500/30 transform rotate-45"></div>
          </div>
        </div>

        {/* Mascot Avatar */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className={`pointer-events-auto relative group transition-transform duration-300 ${isHovering ? 'scale-110' : 'scale-100'}`}
        >
          {/* Glowing aura */}
          <div className="absolute inset-0 bg-emerald-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          
          {/* Mascot Image Container */}
          <div className={`w-16 h-16 rounded-full bg-slate-900 border-2 ${isOpen ? 'border-emerald-400' : 'border-slate-600 group-hover:border-emerald-400'} shadow-2xl flex items-center justify-center overflow-hidden relative z-10 transition-colors`}>
            <img 
              src={`https://api.dicebear.com/7.x/bottts/svg?seed=Kai&backgroundColor=0f172a&primaryColor=34d399`} 
              alt="KAI Assistant"
              className={`w-14 h-14 object-contain transition-transform duration-500 ${isHovering ? '-translate-y-1 rotate-3' : 'translate-y-0'} ${!isHovering && !isOpen ? 'animate-[bounce_3s_infinite]' : ''}`}
            />
          </div>
          
          {/* Online Indicator */}
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 z-20 animate-pulse"></div>
        </button>
      </div>

      {/* Slide-out Panel Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity pointer-events-auto"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Panel */}
      <div 
        className={`fixed top-4 bottom-4 right-4 z-50 w-[420px] max-w-[calc(100vw-2rem)] bg-[#0c101d]/95 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-[120%]'}`}
      >
        {/* Decorative Mascot sitting on top border */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 pointer-events-none z-50 hidden sm:block">
          <img 
            src={`https://api.dicebear.com/7.x/bottts/svg?seed=Kai&backgroundColor=transparent&primaryColor=34d399`} 
            alt="KAI"
            className="w-full h-full object-contain animate-[bounce_4s_infinite]"
          />
        </div>

        {/* Panel Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 rounded-t-2xl z-10 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=Kai&backgroundColor=1e293b&primaryColor=34d399`} className="w-8 h-8" alt="Kai" />
            </div>
            <div>
              <h3 className="text-white font-black text-sm tracking-wide flex items-center gap-2">
                KAI <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-widest border border-emerald-500/20">Pro Coach</span>
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Online & Analyzing</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex p-2 bg-slate-900/50 border-b border-slate-800">
          <button 
            onClick={() => setActiveTab('pre_trade')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'pre_trade' ? 'bg-slate-800 text-white shadow-sm border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            Pre-Trade Check
          </button>
          <button 
            onClick={() => setActiveTab('audit')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'audit' ? 'bg-slate-800 text-white shadow-sm border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <LineChart className="h-3.5 w-3.5" />
            Trade Audit
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${activeTab === 'chat' ? 'bg-slate-800 text-white shadow-sm border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Ask KAI
          </button>
        </div>

        {/* Panel Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#0a0e17]">
          
          {/* TAB 1: PRE-TRADE CHECK */}
          {activeTab === 'pre_trade' && (
            <div className="p-5 flex flex-col h-full">
              {!preTradeResult ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                    <p className="text-xs text-slate-400 font-medium mb-4 leading-relaxed">
                      Enter your planned trade parameters. I'll evaluate the setup quality and calculate your risk before you execute.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Pair</label>
                        <select 
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                          value={preTradeForm.pair}
                          onChange={e => setPreTradeForm({...preTradeForm, pair: e.target.value})}
                        >
                          <option>EUR/USD</option>
                          <option>XAU/USD</option>
                          <option>BTC/USDT</option>
                          <option>NAS100</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Direction</label>
                        <div className="flex rounded-lg overflow-hidden border border-slate-800">
                          <button 
                            className={`flex-1 py-2 text-xs font-bold ${preTradeForm.direction === 'LONG' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-950 text-slate-500 hover:text-slate-300'}`}
                            onClick={() => setPreTradeForm({...preTradeForm, direction: 'LONG'})}
                          >LONG</button>
                          <button 
                            className={`flex-1 py-2 text-xs font-bold ${preTradeForm.direction === 'SHORT' ? 'bg-orange-500/20 text-orange-400' : 'bg-slate-950 text-slate-500 hover:text-slate-300'}`}
                            onClick={() => setPreTradeForm({...preTradeForm, direction: 'SHORT'})}
                          >SHORT</button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Entry</label>
                        <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 font-mono" placeholder="0.00" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Stop Loss</label>
                        <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 font-mono" placeholder="0.00" />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Take Profit</label>
                        <input type="number" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 font-mono" placeholder="0.00" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 mb-2 block">Confluences</label>
                      <div className="flex flex-wrap gap-2">
                        {CONFLUENCE_OPTIONS.map(conf => {
                          const isActive = preTradeForm.confluences.includes(conf);
                          return (
                            <button
                              key={conf}
                              onClick={() => toggleConfluence(conf)}
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition-colors ${isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-600'}`}
                            >
                              {conf}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleEvaluateSetup}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Sparkles className="h-4 w-4" />
                    Evaluate My Setup
                  </button>
                </div>
              ) : preTradeResult === 'loading' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
                  <div className="w-16 h-16 relative mb-4">
                    <div className="absolute inset-0 rounded-full border-t-2 border-emerald-400 animate-spin"></div>
                    <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=Kai&backgroundColor=transparent`} className="w-full h-full p-2" alt="Loading" />
                  </div>
                  <h4 className="text-white font-bold text-sm">Analyzing Market Structure...</h4>
                  <p className="text-xs text-slate-400 mt-1">Calculating R:R and checking historical probabilities.</p>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in pb-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-emerald-500"></div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Setup Quality Score</h4>
                    <div className="text-4xl font-black text-white mb-2">7.5<span className="text-lg text-slate-500">/10</span></div>
                    <div className="inline-block px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full text-xs font-bold">
                      Grade B Setup
                    </div>
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                    <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2 uppercase tracking-wide">
                      <CheckCircle2 className="h-4 w-4" /> Positives
                    </h5>
                    <ul className="space-y-2">
                      <li className="text-xs text-emerald-100/70 flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span> 
                        Trend alignment is strong on the 4H timeframe.
                      </li>
                      <li className="text-xs text-emerald-100/70 flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span> 
                        Multiple confluences selected increases probability.
                      </li>
                    </ul>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                    <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mb-2 uppercase tracking-wide">
                      <AlertTriangle className="h-4 w-4" /> Risk Warnings
                    </h5>
                    <ul className="space-y-2">
                      <li className="text-xs text-amber-100/70 flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span> 
                        Risk-to-Reward is 1:1.8. Your rules state minimum 1:2.
                      </li>
                      <li className="text-xs text-amber-100/70 flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">•</span> 
                        Major news event (CPI) in 45 minutes. Consider waiting.
                      </li>
                    </ul>
                  </div>

                  <button 
                    onClick={() => setPreTradeResult(null)}
                    className="w-full py-2.5 rounded-lg border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-colors"
                  >
                    Reset & Check Another
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TRADE AUDIT */}
          {activeTab === 'audit' && (
            <div className="p-5 flex flex-col h-full">
              {auditState === 'idle' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-900 rounded-full border border-slate-700 flex items-center justify-center mb-4">
                    <LineChart className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-white font-bold mb-2">Ready for your weekly audit?</h3>
                  <p className="text-xs text-slate-400 mb-6 max-w-[250px] leading-relaxed">
                    I will analyze your last 20 trades to identify recurring mistakes, psychological leaks, and edge optimizations.
                  </p>
                  <button 
                    onClick={handleRunAudit}
                    className="px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm shadow-[0_0_20px_rgba(99,102,241,0.3)] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <Sparkles className="h-4 w-4" />
                    Run Deep Flaw Analysis
                  </button>
                </div>
              ) : auditState === 'loading' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
                  <div className="w-16 h-16 relative mb-4">
                    <div className="absolute inset-0 rounded-full border-t-2 border-indigo-400 animate-spin"></div>
                    <LineChart className="absolute inset-0 m-auto h-6 w-6 text-indigo-400" />
                  </div>
                  <h4 className="text-white font-bold text-sm">Crunching your trade history...</h4>
                  <p className="text-xs text-slate-400 mt-1">Finding patterns in your losses.</p>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in pb-4">
                  <div className="mb-2">
                    <h3 className="text-sm font-black text-white">Audit Results</h3>
                    <p className="text-xs text-slate-400">Analysis of last 20 trades</p>
                  </div>

                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-rose-500/20 p-1.5 rounded text-rose-400">
                         <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-rose-400 mb-1">Time of Day Leak</h5>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          You lose <strong>75%</strong> of trades taken between 12:00 PM and 2:00 PM (Lunch Chop). Consider stepping away during this window.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-amber-500/20 p-1.5 rounded text-amber-400">
                         <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-amber-400 mb-1">Premature Exits</h5>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          On your winning trades, you are exiting on average at 1.2R when your original targets are set for 2.5R. Trust your stops.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 bg-emerald-500/20 p-1.5 rounded text-emerald-400">
                         <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-emerald-400 mb-1">Asset Dominance</h5>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Your win rate on XAU/USD is <strong>68%</strong>. Double down on Gold and consider dropping minor Forex pairs.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setAuditState('idle')}
                    className="w-full py-2.5 mt-2 rounded-lg border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-colors"
                  >
                    Clear Report
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CHAT PANEL */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-sm' 
                        : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-sm shadow-md'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-900/80">
                {/* Quick Prompts */}
                <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-3">
                  <button onClick={() => sendQuickPrompt("Why am I losing on Gold?")} className="shrink-0 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full px-3 py-1.5 text-[10px] font-bold text-slate-300 whitespace-nowrap transition-colors">
                    Why am I losing on Gold?
                  </button>
                  <button onClick={() => sendQuickPrompt("Check my current risk")} className="shrink-0 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full px-3 py-1.5 text-[10px] font-bold text-slate-300 whitespace-nowrap transition-colors">
                    Check my current risk
                  </button>
                  <button onClick={() => sendQuickPrompt("Explain Risk-to-Reward")} className="shrink-0 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full px-3 py-1.5 text-[10px] font-bold text-slate-300 whitespace-nowrap transition-colors">
                    Explain Risk-to-Reward
                  </button>
                </div>
                
                {/* Input Area */}
                <form onSubmit={handleSendChat} className="flex items-end gap-2 relative">
                  <button type="button" className="p-2 text-slate-400 hover:text-emerald-400 rounded-xl bg-slate-950 border border-slate-800 transition-colors h-10 w-10 flex items-center justify-center shrink-0">
                    <ImageIcon className="h-4 w-4" />
                  </button>
                  <textarea 
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendChat();
                      }
                    }}
                    placeholder="Ask KAI anything..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 resize-none h-10 max-h-32 custom-scrollbar placeholder:text-slate-600"
                    rows={1}
                  />
                  <button 
                    type="submit" 
                    disabled={!chatInput.trim()}
                    className="p-2 bg-emerald-500 text-slate-950 rounded-xl hover:bg-emerald-400 disabled:opacity-50 disabled:bg-slate-800 disabled:text-slate-500 transition-colors h-10 w-10 flex items-center justify-center shrink-0"
                  >
                    <Send className="h-4 w-4 ml-0.5" />
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};
