'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto-fill saved credentials if available
    const savedEmail = localStorage.getItem('saved_email');
    const savedPassword = localStorage.getItem('saved_password');
    if (savedEmail) setEmail(savedEmail);
    if (savedPassword) setPassword(savedPassword);
  }, []);

  const validatePhone = (num: string) => {
    let clean = num.trim().replace(/\s+/g, '').replace('+', '');
    if (clean.startsWith('0')) clean = '254' + clean.slice(1);
    // Standard Kenyan phone format (2547... or 2541...)
    const kenyaPhoneRegex = /^254(7|1)\d{8}$/;
    return kenyaPhoneRegex.test(clean) ? clean : null;
  };

  const validateEmail = (mail: string) => {
    // Strict format check prohibiting disposable fake domains
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const lower = mail.trim().toLowerCase();
    const bannedDomains = ['mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'yopmail.com'];
    const domain = lower.split('@')[1];

    if (!emailRegex.test(lower)) return false;
    if (bannedDomains.includes(domain)) return false;
    return lower;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const validEmail = validateEmail(email);
    if (!validEmail) {
      alert('Please enter a valid, permanent email address (e.g., gmail.com, yahoo.com). Temporary emails are disallowed.');
      setLoading(false);
      return;
    }

    const isAdminEmail = validEmail === 'robertwaweru324@gmail.com';

    if (isSignUp) {
      const validPhone = validatePhone(phone);
      if (!validPhone) {
        alert('Please enter a valid Kenyan phone number (e.g., 0712345678 or 254712345678).');
        setLoading(false);
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email: validEmail, 
        password 
      });

      if (authError) {
        alert(authError.message);
        setLoading(false);
        return;
      }

      // Register worker in Supabase table
      await supabase.from('workers').insert([
        { 
          email: validEmail, 
          phone: validPhone, 
          balance: 0, 
          is_pro: isAdminEmail,
          role: isAdminEmail ? 'admin' : 'worker'
        }
      ]);

      if (rememberMe) {
        localStorage.setItem('saved_email', validEmail);
        localStorage.setItem('saved_password', password);
      }

      localStorage.setItem('userEmail', validEmail);
      alert('Account created successfully!');
      router.push('/dashboard');

    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: validEmail, password });
      
      if (error) {
        alert('Invalid email or password.');
      } else {
        if (rememberMe) {
          localStorage.setItem('saved_email', validEmail);
          localStorage.setItem('saved_password', password);
        }
        localStorage.setItem('userEmail', validEmail);
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
          <h1 className="text-xl font-black">{isSignUp ? 'Create Verified ROFRA Account' : 'Welcome Back'}</h1>
          <p className="text-xs text-slate-400">Strict real-time identity & secure portal access</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Official Email Address</label>
            <input 
              type="email" 
              placeholder="worker@gmail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
              required
            />
          </div>

          {isSignUp && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">M-Pesa Phone Number</label>
              <input 
                type="tel" 
                placeholder="0712345678" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                required
              />
            </div>
          )}

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

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-emerald-600"
              />
              Save login credentials
            </label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold text-xs py-3 rounded-xl transition shadow mt-2"
          >
            {loading ? 'Processing Verification...' : isSignUp ? 'Register Verified Account' : 'Log In'}
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
