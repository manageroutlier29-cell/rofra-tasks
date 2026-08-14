'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function WithdrawPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail') || '';
    setEmail(userEmail);
    if (userEmail) fetchWorker(userEmail);
  }, []);

  const fetchWorker = async (userEmail: string) => {
    const { data } = await supabase.from('workers').select('*').eq('email', userEmail).single();
    if (data) {
      setIsPro(data.is_pro);
      setBalance(data.balance);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPro) {
      alert('Withdrawals are restricted to Pro Workers. Please pay KSh 250 upgrade fee first.');
      router.push('/upgrade');
      return;
    }

    const numAmount = parseFloat(amount);
    if (numAmount > balance) {
      alert('Insufficient balance.');
      return;
    }

    setLoading(true);

    // Record pending payout for admin approval
    const { error } = await supabase.from('payouts').insert([
      { worker_email: email, amount: numAmount, phone, status: 'pending', payout_day: 'Wednesday' }
    ]);

    if (!error) {
      alert('Payout request submitted! Payments are approved by Admin every Wednesday.');
      router.push('/dashboard');
    } else {
      alert(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 font-sans p-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-5">
        <button onClick={() => router.push('/dashboard')} className="text-xs font-bold text-slate-500">
          ← Back to Dashboard
        </button>

        <div className="space-y-1">
          <h1 className="text-lg font-black text-slate-900">M-Pesa Withdrawal Queue</h1>
          <p className="text-xs text-slate-500">
            Payouts are processed <strong>once per week on Wednesdays</strong> upon Admin approval.
          </p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-xs text-emerald-900">
          Available Balance: <span className="font-black">KSh {balance.toFixed(2)}</span>
        </div>

        <form onSubmit={handleWithdraw} className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">M-Pesa Phone Number</label>
            <input 
              type="tel" 
              placeholder="0712345678" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold"
              required 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Amount (KSh)</label>
            <input 
              type="number" 
              placeholder="Minimum 100" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#2a7a4c] hover:bg-[#23683f] text-white font-black text-xs py-3 rounded-xl transition shadow"
          >
            {loading ? 'Submitting...' : 'Request Wednesday Payout'}
          </button>
        </form>
      </div>
    </div>
  );
}
