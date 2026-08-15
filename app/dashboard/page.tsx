'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAllTasks, Task } from '@/lib/tasks';

const ADMIN_EMAIL = 'robertwaweru324@gmail.com';

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [pendingSubmissions, setPendingSubmissions] = useState<any[]>([]);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail') || '';
    setEmail(userEmail);

    const localSubs = JSON.parse(localStorage.getItem('rofra_pending_submissions') || '[]');
    const userSubs = localSubs.filter((s: any) => s.worker_email === userEmail);
    setPendingSubmissions(userSubs);

    const doneIds = userSubs.map((s: any) => String(s.task_id));
    setCompletedIds(doneIds);

    async function loadTasks() {
      const allTasks = await fetchAllTasks();
      setTasks(allTasks);
    }
    loadTasks();
  }, []);

  const pendingBalance = pendingSubmissions
    .filter((s) => s.status === 'pending')
    .reduce((sum, s) => sum + Number(s.reward || 0), 0);

  const approvedBalance = pendingSubmissions
    .filter((s) => s.status === 'approved')
    .reduce((sum, s) => sum + Number(s.reward || 0), 0);

  const availableTasks = tasks.filter((t) => !completedIds.includes(String(t.id)));
  const completedCount = completedIds.length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-lg">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Worker Account</span>
            <h1 className="text-sm font-black text-white">{email || 'Worker'}</h1>
          </div>
          
          {/* Admin Panel button shows ONLY for Admin */}
          {email === ADMIN_EMAIL && (
            <button 
              onClick={() => router.push('/admin')} 
              className="text-[10px] font-bold bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 rounded-xl text-white shadow"
            >
              Admin Panel
            </button>
          )}
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Pending Review</span>
            <span className="text-lg font-black text-amber-400 font-mono">KSh {pendingBalance}</span>
          </div>
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Approved Earnings</span>
            <span className="text-lg font-black text-emerald-400 font-mono">KSh {approvedBalance}</span>
          </div>
        </div>

        {/* Pro Upgrade Requirement */}
        {completedCount >= 3 ? (
          <div className="bg-gradient-to-br from-amber-600/20 to-emerald-600/20 p-5 rounded-3xl border border-amber-500/30 text-center space-y-3">
            <span className="inline-block bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-amber-500/30">
              Starter Limit Reached ({completedCount}/3 Done)
            </span>
            <h2 className="text-base font-black text-white">Upgrade Account to Pro</h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              You have completed all 3 Starter tasks! To unlock high-tier tasks and cash out, upgrade to <strong className="text-emerald-400">Pro Account at KSh 250</strong>.
            </p>
            <button 
              onClick={() => alert('Send KSh 250 via M-Pesa to activate Pro status.')}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3 rounded-xl transition shadow-lg"
            >
              Upgrade to Pro (KSh 250)
            </button>
          </div>
        ) : (
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                Available Academic Tasks ({availableTasks.length})
              </h2>
              <span className="text-[10px] text-slate-500">Starter Progress: {completedCount}/3</span>
            </div>

            {availableTasks.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500">
                No active tasks available right now.
              </div>
            ) : (
              <div className="space-y-3">
                {availableTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 flex justify-between items-center gap-3"
                  >
                    <div>
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">
                        {task.category}
                      </span>
                      <h3 className="text-xs font-bold text-white">{task.title}</h3>
                      <span className="text-xs font-black text-emerald-400 font-mono block mt-0.5">
                        KSh {task.reward}
                      </span>
                    </div>

                    <button
                      onClick={() => router.push(`/task/${task.id}`)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow shrink-0"
                    >
                      Start Task
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Submissions Queue */}
        {pendingSubmissions.length > 0 && (
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              My Submissions Queue ({pendingSubmissions.length})
            </h3>
            <div className="divide-y divide-slate-800">
              {pendingSubmissions.map((sub, idx) => (
                <div key={sub.id || idx} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-white">{sub.task_title}</div>
                    <div className="text-[10px] text-slate-400">Reward: KSh {sub.reward}</div>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${
                    sub.status === 'approved' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {sub.status === 'pending' ? 'Pending Review' : 'Approved'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
