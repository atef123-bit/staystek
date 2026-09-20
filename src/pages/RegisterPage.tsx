import React, { useState } from 'react';
import { Lock, Mail, User, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { registerUser } from '../firebase/auth';

export const RegisterPage: React.FC = () => {
  const { navigate, showToast } = useStore();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }

    setLoading(true);
    try {
      await registerUser(email.trim(), password, fullName.trim(), phone.trim());
      showToast('Atelier client profile successfully established.', 'success');
      navigate({ name: 'account' });
    } catch (err: any) {
      let msg = 'Registration failed. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account already exists with this email address.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Invalid email address provided.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password must be at least 6 characters.';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-[#0e0e11] border border-white/10 p-8 sm:p-10 shadow-2xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.35em] text-zinc-400 font-mono">
            New Client Registration
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-white">
            Create Profile
          </h1>
          <p className="text-xs text-zinc-400">
            Enjoy priority order fulfillment, private showroom bookings, and bespoke sizing logs.
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
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-medium mb-1.5">
              Full Legal Name
            </label>
            <div className="relative flex items-center">
              <User size={15} className="absolute left-3.5 text-zinc-500" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Eleanor Vance"
                className="w-full bg-black/60 border border-white/15 pl-10 pr-3 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

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
            <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-medium mb-1.5">
              Phone (Optional, for Courier Dispatch)
            </label>
            <div className="relative flex items-center">
              <Phone size={15} className="absolute left-3.5 text-zinc-500" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2831"
                className="w-full bg-black/60 border border-white/15 pl-10 pr-3 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-zinc-400 font-medium mb-1.5">
              Password (Min 6 characters)
            </label>
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
            <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Switch to Login */}
        <div className="pt-6 border-t border-white/10 text-center text-xs text-zinc-400 space-y-3">
          <p>
            Already hold an established account?
          </p>
          <button
            onClick={() => navigate({ name: 'login' })}
            className="w-full py-3 border border-white/20 text-white text-xs uppercase tracking-widest font-medium hover:bg-white/5 hover:border-white transition-colors"
          >
            Sign In Instead
          </button>
        </div>

      </div>
    </div>
  );
};
