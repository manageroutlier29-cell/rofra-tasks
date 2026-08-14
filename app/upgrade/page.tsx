'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UpgradePage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('isProWorker', 'true');
      alert('STK Push Sent! Enter your M-Pesa PIN on your phone to complete payment of KSh 250.');
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 font-sans p-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-6">
        <button onClick={() => router.push('/dashboard')} className="text-xs font-bold text-slate-500">
          ← Back to Dashboard
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
            👑
          </div>
          <h1 className="text-xl font-black text-slate-900">Upgrade to Pro Account</h1>
          <p className="text-xs text-slate-500">
            Pay a one-time fee of <span className="font-bold text-emerald-600">KSh 250</span> to unlock premium tasks and instant M-Pesa withdrawals.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">✅ Unlock unlimited daily tasks</div>
          <div className="flex items-center gap-2">✅ Enable instant M-Pesa withdrawals (Min KSh 1,000)</div>
          <div className="flex items-center gap-2">✅ Priority 24/7 worker support</div>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">M-Pesa Phone Number</label>
            <input 
              type="tel" 
              placeholder="0712345678" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 focus:outline-emerald-600"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#2a7a4c] hover:bg-[#23683f] text-white font-black text-xs py-3 rounded-xl transition shadow-md"
          >
            {loading ? 'Initiating M-Pesa Prompt...' : 'Pay KSh 250 via M-Pesa'}
          </button>
        </form>
      </div>
    </div>
  );
}
