'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const namePart = cleanEmail.split('@')[0] || 'User';
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

    localStorage.setItem('userEmail', cleanEmail);
    localStorage.setItem('userName', formattedName);
    localStorage.setItem('authProvider', 'Email');

    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f4] flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-xl">
        
        <header className="mb-6">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Welcome to Rofra</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mt-1">
            Start earning on your terms.
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create your free account or sign in to continue.
          </p>
        </header>

        <div className="bg-slate-100 p-1 rounded-2xl flex text-xs font-bold mb-6">
          <button
            type="button"
            onClick={() => setIsSignIn(false)}
            className={`flex-1 py-2 rounded-xl transition ${!isSignIn ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Create account
          </button>
          <button
            type="button"
            onClick={() => setIsSignIn(true)}
            className={`flex-1 py-2 rounded-xl transition ${isSignIn ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
          >
            Sign in
          </button>
        </div>

        <div className="space-y-2.5 mb-6">
          <button
            type="button"
            onClick={() => {
              const defaultEmail = 'robertwaweru324@gmail.com';
              localStorage.setItem('userEmail', defaultEmail);
              localStorage.setItem('userName', 'Robert Waweru');
              localStorage.setItem('authProvider', 'Google');
              router.push('/dashboard');
            }}
            className="w-full flex items-center justify-center gap-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl py-2.5 text-xs font-bold text-slate-700 transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">or email</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Email address</label>
            <input
              type="email"
              required
              placeholder="e.g. robertwaweru324@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1b3d32] hover:bg-[#132c24] text-white font-bold py-3 rounded-2xl text-xs transition shadow-md flex items-center justify-center gap-1 mt-4"
          >
            {isLoading ? 'Signing in...' : isSignIn ? 'Sign in to account ↗' : 'Create Account ↗'}
          </button>
        </form>

        <p className="text-[10px] text-slate-400 text-center mt-6">
          By continuing, you agree to Rofra&apos;s terms and privacy policy.
        </p>
      </div>
    </div>
  );
}
