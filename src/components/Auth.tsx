import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ScanFace, 
  User, 
  Smartphone, 
  Globe, 
  ArrowLeft,
  Check,
  ShieldCheck
} from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

type AuthView = 'login' | 'register' | 'forgot';

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('login');
  
  // Login State
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [markets, setMarkets] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const toggleMarket = (market: string) => {
    setMarkets(prev => 
      prev.includes(market) ? prev.filter(m => m !== market) : [...prev, market]
    );
  };

  const handleSignUp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    // Check for missing Supabase credentials
    if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) {
      setErrorMsg('Database connection is not configured. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          markets: markets,
        },
      },
    });

    if (error) {
      console.error('Signup error:', error.message);
      setErrorMsg(error.message);
      setIsLoading(false);
      return;
    }
    
    // Auto-login or show success
    // In this applet, since we don't have full session management wired,
    // we'll just call onLogin() to enter the app for demo purposes, 
    // or set a success message.
    onLogin();
  };

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    // Check for missing Supabase credentials
    if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) {
      setErrorMsg('Database connection is not configured. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword
    });

    if (error) {
      console.error('Login error:', error.message);
      setErrorMsg(error.message);
      setIsLoading(false);
      return;
    }

    onLogin();
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return 0;
    let strength = 0;
    if (password.length > 5) strength += 25;
    if (password.length > 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9!@#$%^&*]/.test(password)) strength += 25;
    return strength;
  };

  const passStrength = getPasswordStrength();
  const strengthColor = 
    passStrength <= 25 ? 'bg-rose-500' : 
    passStrength <= 50 ? 'bg-amber-500' : 
    passStrength <= 75 ? 'bg-emerald-400' : 'bg-emerald-500';

  return (
    <div className="min-h-screen bg-[#090d15] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0e1422] rounded-3xl border border-slate-800 shadow-2xl p-8 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-cyan-500/10 blur-[100px] pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {view === 'login' && 'Welcome Back'}
            {view === 'register' && 'Create Trading Account'}
            {view === 'forgot' && 'Reset Password'}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {view === 'login' && 'Secure authentication for professional traders'}
            {view === 'register' && 'Join the professional trading ecosystem'}
            {view === 'forgot' && 'Enter your registered email address and we\'ll send you a password reset link.'}
          </p>
          {errorMsg && (
            <div className="mt-4 p-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-lg">
              {errorMsg}
            </div>
          )}
        </div>

        {/* LOGIN VIEW */}
        {view === 'login' && (
          <div className="space-y-5 relative z-10 animate-in fade-in zoom-in-95">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">User ID / Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  className="w-full bg-[#161f33] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full bg-[#161f33] border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-slate-600"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-[#161f33] text-cyan-500 focus:ring-cyan-500/20" />
                <span className="text-xs text-slate-400 font-medium">Remember Me</span>
              </label>
              <button onClick={() => setView('forgot')} className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Forgot Password?
              </button>
            </div>

            <button 
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20 transition-all text-sm mt-2 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>

            <div className="relative py-3 flex items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-500 uppercase tracking-widest">Or</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <button 
              onClick={onLogin}
              className="w-full py-3.5 px-4 bg-[#161f33] hover:bg-[#1a253c] border border-slate-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
            >
              <ScanFace className="h-5 w-5 text-emerald-400" />
              Login with Face ID
            </button>

            <div className="text-center mt-6">
              <span className="text-sm text-slate-400">Don't have an account? </span>
              <button onClick={() => setView('register')} className="text-sm text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
                Register Now
              </button>
            </div>
          </div>
        )}

        {/* REGISTER VIEW */}
        {view === 'register' && (
          <div className="space-y-4 relative z-10 animate-in fade-in zoom-in-95 max-h-[70vh] overflow-y-auto custom-scrollbar pr-2 pb-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Full Name <span className="text-rose-400">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full bg-[#161f33] border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500" 
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Email Address <span className="text-rose-400">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#161f33] border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Phone Number <span className="text-rose-400">*</span></label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  <input type="tel" className="w-full bg-[#161f33] border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Base Currency <span className="text-rose-400">*</span></label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                  <select className="w-full bg-[#161f33] border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 appearance-none">
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-2">Primary Trading Markets <span className="text-rose-400">*</span></label>
              <div className="grid grid-cols-2 gap-2">
                {['Forex', 'Crypto', 'Indices', 'Commodities'].map(m => (
                  <div key={m} onClick={() => toggleMarket(m)} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${markets.includes(m) ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-[#161f33] border-slate-700 hover:border-slate-600'}`}>
                    <div className={`h-4 w-4 rounded flex items-center justify-center border transition-colors ${markets.includes(m) ? 'bg-cyan-500 border-cyan-500' : 'border-slate-500'}`}>
                      {markets.includes(m) && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-[11px] font-medium text-slate-300">{m}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Password <span className="text-rose-400">*</span></label>
              <div className="relative mb-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#161f33] border border-slate-700 rounded-lg pl-9 pr-9 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
              <div className="flex gap-1 h-1 w-full rounded-full overflow-hidden bg-slate-800">
                <div className={`h-full transition-all duration-300 ${strengthColor}`} style={{ width: `${passStrength}%` }}></div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Confirm Password <span className="text-rose-400">*</span></label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  className="w-full bg-[#161f33] border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500" 
                />
              </div>
            </div>

            <label className="flex items-start gap-2 mt-4 cursor-pointer">
              <input type="checkbox" className="w-3.5 h-3.5 mt-0.5 rounded border-slate-700 bg-[#161f33] text-cyan-500" />
              <span className="text-[10px] text-slate-400 leading-tight">
                I accept the Terms of Service and Privacy Policy <span className="text-rose-400">*</span>
              </span>
            </label>

            <button 
              onClick={handleSignUp}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg mt-4 text-xs transition-all disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Create Trading Account'}
            </button>
            
            <div className="text-center mt-4">
              <button onClick={() => setView('login')} className="text-[11px] text-slate-400 hover:text-white transition-colors">
                Already have an account? <span className="text-cyan-400 font-bold">Log In</span>
              </button>
            </div>
          </div>
        )}

        {/* FORGOT PASSWORD VIEW */}
        {view === 'forgot' && (
          <div className="space-y-6 relative z-10 animate-in fade-in zoom-in-95">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Registered Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  className="w-full bg-[#161f33] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button 
              onClick={() => setView('login')}
              className="w-full py-3.5 px-4 bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg transition-all text-sm"
            >
              Send Reset Link
            </button>

            <div className="text-center">
              <button onClick={() => setView('login')} className="text-sm text-slate-400 hover:text-white font-medium flex items-center justify-center gap-2 mx-auto transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Login
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
