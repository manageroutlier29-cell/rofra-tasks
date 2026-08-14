'use client';

import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/auth';

export default function WorkerDashboard() {
  const router = useRouter();
  
  // Replace with dynamic email from your auth provider (e.g. NextAuth / Supabase / Clerk)
  const userEmail = 'robertwaweru324@gmail.com'; 

  return (
    <div className="min-h-screen bg-[#f1f1eb] text-slate-800 font-sans p-4">
      <div className="max-w-md mx-auto space-y-4">
        
        {/* Top Navbar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
          <div>
            <h1 className="text-base font-black text-slate-900">ROFRA TASKS</h1>
            <p className="text-[10px] text-slate-400">{userEmail}</p>
          </div>
          
          <div className="flex gap-2">
            {isAdmin(userEmail) && (
              <button 
                onClick={() => router.push('/admin')}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow"
              >
                ⚙️ Admin
              </button>
            )}
            <button 
              onClick={() => router.push('/profile')}
              className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl"
            >
              👤 Profile
            </button>
          </div>
        </div>

        {/* Worker Balance */}
        <div className="bg-[#2a7a4c] text-white p-5 rounded-2xl shadow-md space-y-2">
          <span className="text-[10px] uppercase font-bold text-emerald-200 tracking-wider">Available Earnings</span>
          <div className="text-3xl font-black">KSh 0.00</div>
          <button 
            onClick={() => router.push('/upgrade')}
            className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs py-2.5 rounded-xl transition mt-2"
          >
            👑 Upgrade to Pro (Unlock Withdrawals)
          </button>
        </div>

        {/* Available Tasks Section for Workers */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Micro-Jobs</h2>
          
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
            <div>
              <div className="text-xs font-bold text-slate-800">YouTube Channel Subscription</div>
              <div className="text-[10px] text-slate-400">Social Media • 2 mins</div>
            </div>
            <div className="text-right">
              <span className="text-xs font-black text-[#2a7a4c]">KSh 30.00</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
