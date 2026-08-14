'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/auth';

export default function WorkerDashboard() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail') || 'worker@rofratasks.com';
    setUserEmail(storedEmail);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 font-sans">
      
      {/* Top Header Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2a7a4c] to-emerald-500 text-white flex items-center justify-center font-black text-sm shadow-sm">
              RT
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight">ROFRA TASKS</h1>
              <p className="text-[11px] text-slate-500 font-medium">{userEmail || 'Loading account...'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin(userEmail) && (
              <button 
                onClick={() => router.push('/admin')}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition"
              >
                ⚙️ Admin Panel
              </button>
            )}
            <button 
              onClick={() => router.push('/profile')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition"
            >
              👤 Profile
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        
        {/* Account Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Main Earnings Card */}
          <div className="md:col-span-2 bg-[#2a7a4c] text-white p-6 rounded-3xl shadow-md space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase font-extrabold text-emerald-200 tracking-wider">Available Balance</span>
                <span className="text-[10px] bg-emerald-900/50 text-emerald-200 font-bold px-2.5 py-1 rounded-full border border-emerald-700/50">
                  STANDARD ACCOUNT
                </span>
              </div>
              <div className="text-4xl font-black mt-2">KSh 0.00</div>
            </div>

            <button 
              onClick={() => router.push('/upgrade')}
              className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs py-3 px-4 rounded-xl transition shadow-md flex items-center justify-center gap-2"
            >
              👑 Upgrade to Pro to Unlock Instant M-Pesa Withdrawals
            </button>
          </div>

          {/* Quick Stats Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Work Summary</h3>
            
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="text-lg font-black text-slate-800">0</div>
                <div className="text-[10px] text-slate-400 font-semibold">Completed</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="text-lg font-black text-slate-800">0</div>
                <div className="text-[10px] text-slate-400 font-semibold">Pending</div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-center bg-emerald-50 text-[#2a7a4c] p-2 rounded-xl font-bold">
              Complete jobs below to increase balance
            </div>
          </div>

        </div>

        {/* Tasks Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-black text-slate-900">Available Daily Tasks</h2>
              <p className="text-xs text-slate-400">Complete tasks and submit proof for instant payout credit.</p>
            </div>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              4 Active Jobs
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            <div className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition flex justify-between items-center">
              <div className="space-y-1">
                <span className="text-[9px] font-extrabold uppercase bg-emerald-100 text-[#2a7a4c] px-2 py-0.5 rounded-md">
                  Social Media
                </span>
                <div className="text-xs font-bold text-slate-800">YouTube Channel Subscription</div>
                <div className="text-[10px] text-slate-400">Est. Time: 2 mins</div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-sm font-black text-[#2a7a4c]">KSh 30.00</div>
                <button className="bg-[#2a7a4c] hover:bg-[#23683f] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition">
                  Start Task
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition flex justify-between items-center">
              <div className="space-y-1">
                <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                  App Testing
                </span>
                <div className="text-xs font-bold text-slate-800">Download & Rate Android App</div>
                <div className="text-[10px] text-slate-400">Est. Time: 3 mins</div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-sm font-black text-[#2a7a4c]">KSh 50.00</div>
                <button className="bg-[#2a7a4c] hover:bg-[#23683f] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition">
                  Start Task
                </button>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
