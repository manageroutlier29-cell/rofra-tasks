'use client';

import { useRouter } from 'next/navigation';

export default function UpgradePage() {
  const router = useRouter();

  const handlePay = () => {
    window.location.href = 'https://sandbox.intasend.com/pay/77e6bd13-10f4-4450-bbca-b953f6681d61/';
  };

  return (
    <div className="min-h-screen bg-[#f1f1eb] text-slate-800 font-sans p-4 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-lg border border-slate-100 space-y-5">
        
        {/* Header */}
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

        {/* Hero Info */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-2xl mx-auto shadow-md">
            👑
          </div>
          <h1 className="text-xl font-black text-slate-900">Upgrade to Pro Account</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Unlock instant M-Pesa withdrawals, access all 400+ daily tasks, and earn higher payout rates.
          </p>
        </div>

        {/* Pricing Box */}
        <div className="bg-[#f7f9f7] rounded-2xl p-4 border border-emerald-100 text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Activation Fee</span>
          <div className="text-2xl font-black text-[#2a7a4c] mt-0.5">
            KSh 250 <span className="text-xs font-medium text-slate-500">/ lifetime</span>
          </div>
        </div>

        {/* Payment Button */}
        <div className="space-y-3">
          <button 
            onClick={handlePay}
            className="w-full bg-[#2a7a4c] hover:bg-[#23683f] text-white font-bold py-3.5 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2"
          >
            <span>📲</span> Pay KSh 250 via M-Pesa
          </button>

          <p className="text-[9px] text-center text-slate-400 font-semibold">
            🔒 Secure IntaSend Checkout Integration
          </p>
        </div>

      </div>
    </div>
  );
}
