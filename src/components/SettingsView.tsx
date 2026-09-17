import React, { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { CheckCircle2, Loader2, Save, Edit2, ShieldAlert, RotateCcw } from 'lucide-react';

interface SettingsViewProps {
  user: User;
  onPreferencesChange: (prefs: any) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ user, onPreferencesChange }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');

  // Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.user_metadata?.phone || '');
  const [address, setAddress] = useState(user.user_metadata?.address || '');
  
  // OTP State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Preferences State
  const [bgColor, setBgColor] = useState(user.user_metadata?.preferences?.bgColor || '#080c15');
  const [accentColor, setAccentColor] = useState(user.user_metadata?.preferences?.accentColor || '#10b981');
  const [timezone, setTimezone] = useState(user.user_metadata?.preferences?.timezone || 'UTC');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const initiateSave = () => {
    // Before saving, require OTP
    setShowOtpModal(true);
    setOtp('');
  };

  const handleVerifyAndSave = async () => {
    setIsVerifying(true);
    
    // In a real environment with email/phone OTP enabled in Supabase, 
    // you would call supabase.auth.verifyOtp() here.
    // Since this is a preview environment, we simulate a successful OTP check.
    if (otp.length < 6) {
      showToast('Please enter a valid 6-digit OTP.');
      setIsVerifying(false);
      return;
    }

    // OTP verified, now update the user
    const { error } = await supabase.auth.updateUser({
      email: email,
      data: {
        phone: phone,
        address: address,
      }
    });

    setIsVerifying(false);
    setShowOtpModal(false);

    if (error) {
      showToast('Error updating profile: ' + error.message);
    } else {
      showToast('Profile updated successfully!');
      setIsEditing(false); // Lock editing again
    }
  };

  const savePreferences = async () => {
    setIsSaving(true);
    const newPrefs = { bgColor, accentColor, timezone };
    
    const { error } = await supabase.auth.updateUser({
      data: {
        preferences: newPrefs
      }
    });

    setIsSaving(false);
    if (error) {
      showToast('Error saving preferences.');
    } else {
      showToast('Preferences updated successfully!');
      onPreferencesChange(newPrefs);
    }
  };

  const handleResetPreferences = async () => {
    setIsSaving(true);
    const defaultPrefs = { bgColor: '#080c15', accentColor: '#10b981', timezone: 'UTC' };
    
    setBgColor(defaultPrefs.bgColor);
    setAccentColor(defaultPrefs.accentColor);
    setTimezone(defaultPrefs.timezone);

    const { error } = await supabase.auth.updateUser({
      data: { preferences: defaultPrefs }
    });

    setIsSaving(false);
    if (error) {
      showToast('Error resetting preferences.');
    } else {
      showToast('Preferences reset to default!');
      onPreferencesChange(defaultPrefs);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto pb-12 relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="mb-6 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">Account Settings</h1>
          <p className="text-sm font-medium text-slate-400">Manage your profile details and preferences</p>
        </div>
        
        <div className="flex bg-slate-900 p-1 rounded-lg w-fit border border-slate-800">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'profile' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
          >
            Profile
          </button>
          <button 
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${activeTab === 'preferences' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-300'}`}
          >
            Preferences
          </button>
        </div>
      </div>
      
      {activeTab === 'profile' && (
        <div className="bg-[#0e1422] rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-6 md:p-10 flex flex-col items-center">
          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border-4 border-slate-700 flex items-center justify-center text-2xl font-bold text-white mb-4">
            {initials}
          </div>
          <h2 className="text-xl font-bold text-white mb-1">{fullName}</h2>
          <p className="text-slate-400 text-sm mb-8">{user.email}</p>
          
          <div className="w-full bg-[#161f33] rounded-xl p-6 border border-slate-800/80 text-left space-y-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white">Personal Information</h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg transition-colors border border-slate-700"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit Details
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email"
                  value={email}
                  disabled={!isEditing}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter email address"
                />
              </div>

              {/* Phone Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone Number</label>
                <input 
                  type="tel"
                  value={phone}
                  disabled={!isEditing}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Address Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Address</label>
                <textarea 
                  value={address}
                  disabled={!isEditing}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors min-h-[80px] resize-none disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter full address"
                />
              </div>
            </div>

            {isEditing && (
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800 mt-6">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 text-slate-400 hover:text-white font-bold rounded-lg transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={initiateSave}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all text-sm"
                >
                  Update & Verify
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'preferences' && (
        <div className="bg-[#0e1422] rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-6 md:p-10 flex flex-col items-center">
          <div className="w-full bg-[#161f33] rounded-xl p-6 border border-slate-800/80 text-left space-y-6">
            <h3 className="text-lg font-bold text-white mb-2">Theme & Customization</h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Background Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="h-10 w-14 rounded cursor-pointer bg-slate-900 border border-slate-700"
                    />
                    <span className="text-sm font-mono text-slate-300">{bgColor}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Select the main background color for the app.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Accent Color</label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="h-10 w-14 rounded cursor-pointer bg-slate-900 border border-slate-700"
                    />
                    <span className="text-sm font-mono text-slate-300">{accentColor}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">Used for buttons, highlights, and active states.</p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-6">
                <h3 className="text-lg font-bold text-white mb-4">Regional</h3>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Timezone</label>
                  <select 
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                  >
                    <option value="UTC">UTC (Universal Coordinated Time)</option>
                    <option value="EST">EST (Eastern Standard Time)</option>
                    <option value="PST">PST (Pacific Standard Time)</option>
                    <option value="GMT">GMT (Greenwich Mean Time)</option>
                    <option value="CET">CET (Central European Time)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-slate-800 mt-6">
                <button
                  onClick={handleResetPreferences}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2.5 text-slate-400 hover:text-white font-bold rounded-lg transition-colors text-sm"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset to Default
                </button>
                <button
                  onClick={savePreferences}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080c15]/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0e1422] border border-slate-800 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95">
            <div className="p-6">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 mx-auto border border-emerald-500/20">
                <ShieldAlert className="h-6 w-6 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white text-center mb-2">Verify Update</h2>
              <p className="text-sm text-slate-400 text-center mb-6">
                For security, please enter the 6-digit code sent to your email/phone to confirm these changes.
                <br/><span className="text-xs text-slate-500 mt-2 block">(For preview demo, you can enter any 6 digits like 123456)</span>
              </p>
              
              <input 
                type="text"
                placeholder="000000"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-center text-2xl tracking-widest text-white font-mono focus:outline-none focus:border-emerald-500 transition-colors mb-6"
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowOtpModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-slate-700 text-slate-300 font-bold hover:bg-slate-800 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleVerifyAndSave}
                  disabled={otp.length < 6 || isVerifying}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50 text-sm flex items-center justify-center"
                >
                  {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
