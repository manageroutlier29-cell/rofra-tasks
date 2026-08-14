'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UpgradePage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsSubmitted(true);
      } else {
        setErrorMessage(data.error || 'Failed to initiate M-Pesa STK push');
      }
    } catch (err) {
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1eb] text-slate-800 font-sans p-4 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-lg border border-slate-100 space-y-5">
        
        <div className="flex justify-between items-center">
          <button 
            onClick={() => router.push('/dashboard')} 
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            ← Back
          </button>
          <span className="text-xs font-black text-[#2a7a4c] bg-emerald-50 px-2.5 py-1 rounded-full">
            PRO ACCESS
          </span>
        </div>

        {!isSubmitted ? (
          <>
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-2xl mx-auto shadow-md">
                👑
              </div>
              <h1 className="text-xl font-black text-slate-900">Upgrade to Pro Account</h1>
              <p className="text-xs text-slate-500 leading-relaxed">
                Unlock instant M-Pesa withdrawals, access all 400+ daily tasks, and earn higher payout rates.
              </p>
            </div>

            <div className="bg-[#f7f9f7] rounded-2xl p-4 border border-emerald-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Activation Fee</span>
              <div className="text-2xl font-black text-[#2a7a4c] mt-0.5">
                KSh 250 <span className="text-xs font-medium text-slate-500">/ lifetime</span>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold text-center">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handlePay} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  M-Pesa Phone Number
                </label>
                <input 
                  type="tel" 
                  required 
                  placeholder="2547XXXXXXXX" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  className="w-full bg-[#f1f6f1] rounded-xl px-3.5 py-2.5 text-xs font-bold border border-slate-200 focus:outline-none focus:border-[#2a7a4c]" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full bg-[#2a7a4c] hover:bg-[#23683f] text-white font-bold py-3 rounded-xl text-xs transition shadow-md disabled:opacity-50"
              >
                {isProcessing ? 'Sending STK Push...' : 'Pay KSh 250 via M-Pesa'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#2a7a4c] flex items-center justify-center text-2xl mx-auto shadow-inner">
              📲
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">STK Push Sent!</h2>
              <p className="text-xs text-slate-500 mt-1 px-2 leading-relaxed">
                Check <span className="font-bold text-slate-800">{phoneNumber}</span> for the M-Pesa prompt and enter your M-Pesa PIN.
              </p>
            </div>
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full bg-[#2a7a4c] hover:bg-[#23683f] text-white font-bold py-3 rounded-xl text-xs transition shadow-md"
            >
              Return to Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
