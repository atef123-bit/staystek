import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { loginUser } from '../firebase/auth';

export const LoginPage: React.FC = () => {
  const { navigate, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await loginUser(email.trim(), password);
      showToast('Welcome back to AMIS ATELIER.', 'success');
      navigate({ name: 'account' });
    } catch (err: any) {
      let msg = 'Authentication failed. Please verify your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password entered.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-[#0e0e11] border border-white/10 p-8 sm:p-10 shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.35em] text-zinc-400 font-mono">
            Client Portal
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-white">
            Client Sign In
          </h1>
          <p className="text-xs text-zinc-400">
            Access your orders, saved silhouettes, and private concierge history.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-medium mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={15} className="absolute left-3.5 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@domain.com"
                className="w-full bg-black/60 border border-white/15 pl-10 pr-3 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
                Password
              </label>
              <button 
                type="button" 
                onClick={() => showToast('Password recovery instructions sent to your email.', 'info')}
                className="text-[11px] text-zinc-500 hover:text-zinc-300 underline"
              >
                Forgotten?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock size={15} className="absolute left-3.5 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/60 border border-white/15 pl-10 pr-3 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white text-black text-xs uppercase tracking-[0.25em] font-semibold hover:bg-zinc-200 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-xl pt-3"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Switch to Register */}
        <div className="pt-6 border-t border-white/10 text-center text-xs text-zinc-400 space-y-3">
          <p>
            Do not possess an atelier client profile?
          </p>
          <button
            onClick={() => navigate({ name: 'register' })}
            className="w-full py-3 border border-white/20 text-white text-xs uppercase tracking-widest font-medium hover:bg-white/5 hover:border-white transition-colors"
          >
            Create Atelier Account
          </button>
        </div>

      </div>
    </div>
  );
};
