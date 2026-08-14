'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function UpgradePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail') || '';
    setEmail(userEmail);
  }, []);

  const handleMpesaPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Send STK push request via backend API
      const res = await fetch('/api/intasend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, email })
      });

      const data = await res.json();

      if (res.ok) {
        // 2. Mark worker as PRO in Supabase
        await supabase
          .from('workers')
          .update({ is_pro: true })
          .eq('email', email);

        alert('STK Push Sent! Check your phone and enter M-Pesa PIN for KSh 250. Account upgraded to PRO!');
        router.push('/dashboard');
      } else {
        alert(data.error || 'Failed to trigger M-Pesa prompt. Check your phone number.');
      }
    } catch (err: any) {
      alert('Network error initiating payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 font-sans p-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-6">
        <button onClick={() => router.push('/dashboard')} className="text-xs font-bold text-slate-500">
          ← Back to Dashboard
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-400 text-slate-900 rounded-2xl flex items-center justify-center mx-auto text-xl font-black">
            👑
          </div>
          <h1 className="text-xl font-black text-slate-900">Upgrade to PRO</h1>
          <p className="text-xs text-slate-500">Unlock high-paying Pro tasks & weekly Wednesday M-Pesa withdrawals.</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-2 text-xs text-amber-900">
          <div className="font-bold">PRO Member Benefits:</div>
          <ul className="list-disc list-inside space-y-1 text-[11px]">
            <li>Access to all high-reward tasks (Unlimited)</li>
            <li>Weekly Wednesday direct M-Pesa payouts</li>
            <li>One-time fee of KSh 250</li>
          </ul>
        </div>

        <form onSubmit={handleMpesaPayment} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">M-Pesa Phone Number</label>
            <input 
              type="tel" 
              placeholder="254712345678" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#2a7a4c] hover:bg-[#23683f] text-white font-black text-xs py-3.5 rounded-xl transition shadow"
          >
            {loading ? 'Sending M-Pesa Prompt...' : 'Pay KSh 250 via M-Pesa'}
          </button>
        </form>
      </div>
    </div>
  );
}
