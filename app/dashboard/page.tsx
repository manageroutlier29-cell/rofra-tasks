'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getStoredTasks, Task } from '@/lib/tasks';

export default function WorkerDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isPro, setIsPro] = useState(false);
  const [balance, setBalance] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail') || 'robertwaweru324@gmail.com';
    setEmail(userEmail);

    if (userEmail.trim().toLowerCase() === 'robertwaweru324@gmail.com') {
      setIsPro(true);
    }

    fetchWorkerData(userEmail);
    setTasks(getStoredTasks());
  }, []);

  const fetchWorkerData = async (userEmail: string) => {
    const isAdmin = userEmail.trim().toLowerCase() === 'robertwaweru324@gmail.com';
    const { data } = await supabase.from('workers').select('*').eq('email', userEmail).single();
    
    if (data) {
      setIsPro(isAdmin || data.is_pro || false);
      setBalance(data.balance || 0);
    } else if (isAdmin) {
      setIsPro(true);
    }
  };

  const visibleTasks = isPro ? tasks : tasks.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 font-sans p-4 pb-20">
      <div className="max-w-md mx-auto space-y-4">
        
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-base font-black text-slate-900">ROFRA TASKS</h1>
            <p className="text-xs text-slate-400">{email}</p>
          </div>
          <div className="flex gap-2">
            {email.trim().toLowerCase() === 'robertwaweru324@gmail.com' && (
              <button 
                onClick={() => router.push('/admin')}
                className="text-xs font-bold bg-amber-500 text-white px-3 py-1.5 rounded-xl transition"
              >
                ⚙️ Admin
              </button>
            )}
            <button 
              onClick={() => router.push('/profile')}
              className="text-xs font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition"
            >
              Profile 👤
            </button>
          </div>
        </div>

        <div className="bg-[#2a7a4c] text-white p-5 rounded-3xl space-y-3 shadow-md">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-emerald-100">Available Balance</span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isPro ? 'bg-amber-400 text-slate-900' : 'bg-emerald-800 text-emerald-200'}`}>
              {email.trim().toLowerCase() === 'robertwaweru324@gmail.com' ? '👑 ADMIN PRO' : isPro ? '👑 PRO WORKER' : 'STANDARD WORKER'}
            </span>
          </div>
          <div className="text-2xl font-black">KSh {balance.toFixed(2)}</div>
          
          <div className="pt-2 flex gap-2">
            {isPro ? (
              <button 
                onClick={() => router.push('/withdraw')}
                className="w-full bg-white text-[#2a7a4c] font-black text-xs py-2.5 rounded-xl shadow hover:bg-emerald-50 transition"
              >
                Withdraw (Wednesday Payouts)
              </button>
            ) : (
              <button 
                onClick={() => router.push('/upgrade')}
                className="w-full bg-amber-400 text-slate-900 font-black text-xs py-2.5 rounded-xl shadow hover:bg-amber-300 transition"
              >
                🔒 Upgrade KSh 250 to Withdraw
              </button>
            )}
          </div>
        </div>

        {!isPro && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-1 text-amber-900">
            <div className="text-xs font-black flex items-center gap-1">⚠️ Standard Mode (Restricted)</div>
            <p className="text-[11px] leading-relaxed">
              You are viewing <strong>3 standard tasks</strong>. Upgrade to Pro for KSh 250 to unlock high-paying Pro tasks and enable Wednesday M-Pesa withdrawals.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider">
            {isPro ? 'All Available Tasks' : 'Standard Tasks (3 Max)'}
          </h2>

          {visibleTasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-slate-900">{task.title}</div>
                <div className="text-[10px] font-semibold text-emerald-600 mt-0.5">Earn KSh {task.reward}</div>
              </div>
              <a 
                href={task.link} 
                target="_blank" 
                rel="noreferrer" 
                className="bg-[#2a7a4c] hover:bg-[#23683f] text-white font-bold text-xs px-3 py-2 rounded-xl transition"
              >
                Start Task
              </a>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
