'use client';

import { useState } from 'react';

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
        if (isSignUp) {
          // Store provider type for dashboard
          localStorage.setItem('authProvider', 'Email & Password');
          localStorage.setItem('userEmail', form.email);
          localStorage.setItem('userName', form.fullName || 'User');
          
          setMessage('🎉 Account created! Please sign in to continue.');
          setIsSignUp(false); // Redirect to sign in tab
        } else {
          localStorage.setItem('authProvider', 'Email & Password');
          localStorage.setItem('userEmail', form.email);
          setMessage('Login successful! Redirecting...');
          setTimeout(() => (window.location.href = '/dashboard'), 1000);
        }
      } else {
        setMessage(data.error || 'Action failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setMessage('Network error. Please try again.');
    }
  };

  const handleSocialAuth = (provider: 'Google' | 'GitHub') => {
    // Save social login session details locally for dashboard sync
    localStorage.setItem('authProvider', `${provider} OAuth`);
    localStorage.setItem('userEmail', `user.${provider.toLowerCase()}@example.com`);
    localStorage.setItem('userName', `${provider} User`);

    setMessage(`Connecting to ${provider}...`);
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
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
          Create your free account or sign in to continue.
        </p>

        {/* Tab Switcher */}
        <div className="bg-[#f0f3f0] p-1 rounded-2xl flex mb-6">
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setMessage(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isSignUp ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create account
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setMessage(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              !isSignUp ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign in
          </button>
        </div>

        {/* Social Auth Options */}
        <div className="space-y-2 mb-6">
          <button
            type="button"
            onClick={() => handleSocialAuth('Google')}
            className="w-full flex items-center justify-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl py-3 text-xs font-bold text-slate-700 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => handleSocialAuth('GitHub')}
            className="w-full flex items-center justify-center gap-3 bg-slate-900 hover:bg-slate-800 rounded-2xl py-3 text-xs font-bold text-white transition"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">Or email</span>
          <div className="flex-grow border-t border-slate-200"></div>
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
