'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { fetchAllTasks, Task } from '@/lib/tasks';

export default function OutlierDashboard() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isPro, setIsPro] = useState(false);
  const [balance, setBalance] = useState(0);
  const [pendingEarnings, setPendingEarnings] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'marketplace' | 'earnings' | 'payment' | 'profile'>('marketplace');

  // Payment State
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail') || 'robertwaweru324@gmail.com';
    setEmail(userEmail);

    const isAdmin = userEmail.trim().toLowerCase() === 'robertwaweru324@gmail.com';
    if (isAdmin) setIsPro(true);

    fetchUserData(userEmail);
    loadTasks();
  }, []);

  const fetchUserData = async (userEmail: string) => {
    const isAdmin = userEmail.trim().toLowerCase() === 'robertwaweru324@gmail.com';
    
    // Fetch Worker Profile
    const { data: worker } = await supabase.from('workers').select('*').eq('email', userEmail).single();
    if (worker) {
      setIsPro(isAdmin || worker.is_pro || false);
      setBalance(worker.balance || 0);
      setMpesaNumber(worker.phone || '');
    }

    // Calculate Pending Review Earnings
    const { data: pendingSubs } = await supabase
      .from('task_submissions')
      .select('reward')
      .eq('worker_email', userEmail)
      .eq('status', 'pending');

    if (pendingSubs) {
      const totalPending = pendingSubs.reduce((acc, curr) => acc + parseFloat(curr.reward || 0), 0);
      setPendingEarnings(totalPending);
    }
  };

  const loadTasks = async () => {
    const data = await fetchAllTasks();
    setTasks(data);
  };

  const handleSavePaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPhone(true);
    await supabase.from('workers').update({ phone: mpesaNumber }).eq('email', email);
    alert('M-Pesa Express Payment Details Saved!');
    setSavingPhone(false);
  };

  const visibleTasks = isPro ? tasks : tasks.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans flex flex-col md:flex-row">
      
      {/* Sidebar Navigation (Outlier Style) */}
      <aside className="w-full md:w-64 bg-[#1e293b] border-r border-slate-800 p-5 space-y-8 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-slate-950 text-lg shadow-lg">
            R
          </div>
          <div>
            <div className="font-black text-white text-sm tracking-wide">ROFRA LABS</div>
            <div className="text-[10px] text-slate-400">Outlier Tasking Engine</div>
          </div>
        </div>

        <nav className="space-y-1.5">
          {[
            { id: 'marketplace', label: 'Marketplace Tasks', icon: '⚡' },
            { id: 'earnings', label: 'Earnings History', icon: '💰' },
            { id: 'payment', label: 'Payment Method', icon: '💳' },
            { id: 'profile', label: 'Worker Profile', icon: '👤' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === item.id 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          {email.trim().toLowerCase() === 'robertwaweru324@gmail.com' && (
            <button 
              onClick={() => router.push('/admin')}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition mt-4"
            >
              ⚙️ Admin Control Panel
            </button>
          )}
        </nav>

        {/* Worker Mode Status */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-500 block">Tier Level</span>
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-400">
              {isPro ? '👑 PRO Contributor' : 'Standard Tier'}
            </span>
            {!isPro && (
              <button onClick={() => router.push('/upgrade')} className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-1 rounded-lg">
                Upgrade
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
        
        {/* Top Earnings Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1e293b] p-5 rounded-3xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400">Available Balance</span>
            <div className="text-2xl font-black text-emerald-400">KSh {balance.toFixed(2)}</div>
          </div>
          <div className="bg-[#1e293b] p-5 rounded-3xl border border-slate-800 space-y-1">
            <span className="text-[11px] font-bold text-slate-400">Pending Review</span>
            <div className="text-2xl font-black text-amber-400">KSh {pendingEarnings.toFixed(2)}</div>
          </div>
          <div className="bg-[#1e293b] p-5 rounded-3xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 block">Next Payout</span>
              <div className="text-sm font-black text-white">Wednesday M-Pesa</div>
            </div>
            {isPro ? (
              <button onClick={() => router.push('/withdraw')} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow transition">
                Payout Request
              </button>
            ) : (
              <button onClick={() => router.push('/upgrade')} className="bg-amber-400 text-slate-950 font-bold text-xs px-3 py-2.5 rounded-xl shadow">
                🔒 Unlock Payouts
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: TASK MARKETPLACE */}
        {activeTab === 'marketplace' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-black text-white">Task Marketplace Queue</h1>
                <p className="text-xs text-slate-400">Select an active production task to start working in real-time.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {visibleTasks.map((task) => (
                <div key={task.id} className="bg-[#1e293b] p-5 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-700 transition shadow-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                        {task.category || 'Production'}
                      </span>
                      <span className="text-[10px] text-slate-500">⏱️ ~10 min allocation</span>
                    </div>
                    <h2 className="text-base font-bold text-white">{task.title}</h2>
                  </div>
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Reward Rate</span>
                      <span className="text-base font-black text-emerald-400">KSh {task.reward}</span>
                    </div>
                    <button 
                      onClick={() => router.push(`/task/${task.id}`)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-5 py-3 rounded-2xl shadow transition"
                    >
                      Start Task →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: EARNINGS HISTORY */}
        {activeTab === 'earnings' && (
          <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-black text-white">Earnings & Payment Statements</h2>
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Available for Payout:</span>
                <span className="font-bold text-emerald-400">KSh {balance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Awaiting Reviewer Approval:</span>
                <span className="font-bold text-amber-400">KSh {pendingEarnings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payout Cycle:</span>
                <span className="font-bold text-white">Weekly Every Wednesday</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENT METHOD */}
        {activeTab === 'payment' && (
          <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 max-w-md space-y-4">
            <h2 className="text-lg font-black text-white">Primary Payment Account</h2>
            <p className="text-xs text-slate-400">Configure your direct M-Pesa payout phone number.</p>
            <form onSubmit={handleSavePaymentMethod} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">M-Pesa Express Phone Number</label>
                <input 
                  type="tel" 
                  value={mpesaNumber} 
                  onChange={(e) => setMpesaNumber(e.target.value)}
                  placeholder="254712345678"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 text-xs text-white outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={savingPhone}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3 rounded-xl transition shadow"
              >
                {savingPhone ? 'Saving Phone...' : 'Update Payment Method'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: WORKER PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 max-w-md space-y-4">
            <h2 className="text-lg font-black text-white">Worker Account Profile</h2>
            <div className="space-y-3 text-xs">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Registered Email</span>
                <span className="font-bold text-white">{email}</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Account Tier</span>
                <span className="font-bold text-amber-400">{isPro ? '👑 PRO Contributor' : 'Standard Tier'}</span>
              </div>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('userEmail');
                router.push('/login');
              }}
              className="w-full bg-red-600/10 text-red-400 border border-red-500/20 font-bold text-xs py-3 rounded-xl hover:bg-red-600/20 transition"
            >
              Log Out
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
