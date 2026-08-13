'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phoneNumber: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage(isSignUp ? 'Account created! Redirecting...' : 'Login successful! Redirecting...');
        setTimeout(() => (window.location.href = '/dashboard'), 1200);
      } else {
        setMessage(data.error || 'Action failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f6f3] flex flex-col justify-center items-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100/80">
        
        {/* Header Badges */}
        <p className="text-[11px] font-bold tracking-widest text-emerald-800 uppercase mb-2">
          WELCOME TO ROFRA
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2 leading-tight">
          Start earning on your terms.
        </h1>
        <p className="text-xs text-slate-500 mb-6">
          Create your free account in under a minute.
        </p>

        {/* Tab Switcher */}
        <div className="bg-[#f0f3f0] p-1 rounded-2xl flex mb-6">
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isSignUp ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create account
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              !isSignUp ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign in
          </button>
        </div>

        {message && (
          <div className="p-3 mb-4 text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full name
              </label>
              <input
                type="text"
                required={isSignUp}
                placeholder="e.g. Amina Wanjiku"
                className="w-full bg-[#f8faf8] border border-slate-200/90 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full bg-[#f8faf8] border border-slate-200/90 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone number
              </label>
              <input
                type="tel"
                required={isSignUp}
                placeholder="+254 7XX XXX XXX"
                className="w-full bg-[#f8faf8] border border-slate-200/90 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="At least 8 characters"
              className="w-full bg-[#f8faf8] border border-slate-200/90 rounded-2xl px-4 py-3 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#244c3f] hover:bg-[#1a382e] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-2xl transition shadow-md shadow-emerald-950/10 flex items-center justify-center gap-2 text-xs mt-2"
          >
            <span>{loading ? 'Processing...' : isSignUp ? 'Create my account' : 'Sign in to account'}</span>
            <span className="text-base">↗</span>
          </button>
        </form>

        <p className="text-[11px] text-slate-400 text-center mt-6 leading-normal">
          By continuing, you agree to Rofra's terms and privacy policy.
        </p>

      </div>
    </div>
  );
}
