'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail') || 'worker@rofratasks.com';
    const proStatus = localStorage.getItem('isProWorker') === 'true';
    setEmail(storedEmail);
    setIsPro(proStatus);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isProWorker');
    localStorage.removeItem('rofra_worker_balance');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 font-sans p-4">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
          <button onClick={() => router.push('/dashboard')} className="text-xs font-bold text-slate-500">
            ← Back to Dashboard
          </button>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            WORKER PROFILE
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#2a7a4c] text-white text-2xl font-black flex items-center justify-center mx-auto">
            {email.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-base font-black text-slate-900">{email}</h2>
            <p className="text-xs font-bold text-slate-400 mt-1">
              Account Status: {isPro ? <span className="text-amber-500">👑 Pro Worker</span> : <span className="text-slate-500">Standard Worker</span>}
            </p>
          </div>

          {!isPro && (
            <button 
              onClick={() => router.push('/upgrade')}
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs py-2.5 rounded-xl transition"
            >
              Upgrade to Pro (KSh 250)
            </button>
          )}

          <hr className="border-slate-100" />

          <button 
            onClick={handleLogout}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs py-3 rounded-xl transition border border-red-100"
          >
            🚪 Logout Account
          </button>
        </div>
      </div>
    </div>
  );
}
