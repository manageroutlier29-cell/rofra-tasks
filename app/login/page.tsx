'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isAdminEmail = email.trim().toLowerCase() === 'robertwaweru324@gmail.com';

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        alert(error.message);
      } else {
        await supabase.from('workers').insert([
          { email, balance: 0, is_pro: isAdminEmail }
        ]);
        localStorage.setItem('userEmail', email);
        alert('Account created successfully!');
        router.push('/dashboard');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        alert(error.message);
      } else {
        localStorage.setItem('userEmail', email);
        router.push('/dashboard');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto text-xl font-black">
            RT
          </div>
          <h1 className="text-xl font-black">{isSignUp ? 'Create ROFRA Account' : 'Welcome Back'}</h1>
          <p className="text-xs text-slate-400">Database encrypted real-time login</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder="worker@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold text-xs py-3 rounded-xl transition shadow"
          >
            {loading ? 'Authenticating...' : isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-xs font-semibold text-emerald-400 hover:underline"
          >
            {isSignUp ? 'Already have an account? Log In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
