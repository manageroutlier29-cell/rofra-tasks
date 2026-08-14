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

    // Load IntaSend Inline Script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/intasend-inlinejs-sdk@3.0.4/build/intasend-inline.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleIntaSendPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (typeof window === 'undefined' || !(window as any).IntaSend) {
      alert('IntaSend SDK loading... please try again in a few seconds.');
      setLoading(false);
      return;
    }

    const publishableKey = process.env.NEXT_PUBLIC_INTASEND_PUBLISHABLE_KEY || 'ISPubKey_live_xxxx';

    const intasend = new (window as any).IntaSend({
      public_key: publishableKey,
      live: true
    });

    intasend
      .on('COMPLETE', async (response: any) => {
        // Automatically upgrade user in Supabase
        const { error } = await supabase
          .from('workers')
          .update({ is_pro: true })
          .eq('email', email);

        if (!error) {
          alert('Payment Successful! Your account has been upgraded to PRO.');
          router.push('/dashboard');
        } else {
          alert('Payment received, but database update failed. Please contact admin.');
        }
        setLoading(false);
      })
      .on('FAILED', (response: any) => {
        alert('Payment failed. Please try again.');
        setLoading(false);
      })
      .on('IN-PROGRESS', () => {
        alert('STK Push Sent! Enter your M-Pesa PIN on your phone to complete payment of KSh 250.');
      });

    intasend.run({
      amount: 250,
      currency: 'KES',
      email: email,
      phone_number: phone,
      api_ref: `PRO_UPGRADE_${Date.now()}`
    });
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

        <form onSubmit={handleIntaSendPayment} className="space-y-4">
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
            {loading ? 'Initiating M-Pesa Prompt...' : 'Pay KSh 250 via M-Pesa'}
          </button>
        </form>
      </div>
    </div>
  );
}
