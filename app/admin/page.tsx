'use client';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { fetchAllTasks, Task } from '@/lib/tasks';

export default function AdminBackendPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'reviews' | 'payouts' | 'tasks'>('users');
  
  const [workers, setWorkers] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [taskTitle, setTaskTitle] = useState('');
  const [taskReward, setTaskReward] = useState('');
  const [taskLink, setTaskLink] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || '';
    setCurrentUser(email);

    fetchAdminData();
    loadTasks();
  }, []);

  const fetchAdminData = async () => {
    try {
      const { data: workerData } = await supabase.from('workers').select('*');
      if (workerData) setWorkers(workerData);

      const { data: subData } = await supabase.from('task_submissions').select('*').order('created_at', { ascending: false });
      if (subData) setSubmissions(subData);

      const { data: payoutData } = await supabase.from('payouts').select('*').order('created_at', { ascending: false });
      if (payoutData) setPayouts(payoutData);
    } catch (e) {
      console.warn('Admin database fetch skipped during build');
    }
  };

  const loadTasks = async () => {
    const data = await fetchAllTasks();
    setTasks(data);
  };

  const handleApproveSubmission = async (sub: any) => {
    await supabase.from('task_submissions').update({ status: 'approved' }).eq('id', sub.id);

    const { data: worker } = await supabase.from('workers').select('balance').eq('email', sub.worker_email).single();
    const currentBal = worker?.balance || 0;
    const newBal = currentBal + parseFloat(sub.reward);

    await supabase.from('workers').update({ balance: newBal }).eq('email', sub.worker_email);

    alert(`Submission approved! Added KSh ${sub.reward} to ${sub.worker_email}`);
    fetchAdminData();
  };

  const handleRejectSubmission = async (id: string) => {
    await supabase.from('task_submissions').update({ status: 'rejected' }).eq('id', id);
    fetchAdminData();
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !taskReward || !taskLink) return;

    await supabase.from('tasks').insert([
      { title: taskTitle, reward: parseFloat(taskReward), link: taskLink, category: 'Pro' }
    ]);

    setTaskTitle('');
    setTaskReward('');
    setTaskLink('');
    alert('Task published globally!');
    loadTasks();
  };

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id);
    loadTasks();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-lg">
          <div>
            <h1 className="text-lg font-black text-emerald-400">ROFRA ADMIN BACKEND</h1>
            <p className="text-xs text-slate-400">Admin: {currentUser}</p>
          </div>
          <button onClick={() => router.push('/dashboard')} className="text-xs font-bold bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl border border-slate-700">
            ← Exit App
          </button>
        </div>

        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 gap-2">
          {(['users', 'reviews', 'payouts', 'tasks'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                activeTab === tab ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'users' && (
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400">All Workers ({workers.length})</h2>
            <div className="divide-y divide-slate-800">
              {workers.map((w) => (
                <div key={w.id || w.email} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-white">{w.email}</div>
                    <div className="text-[10px] text-slate-400">Phone: {w.phone || 'N/A'} | Role: <span className="text-amber-400 font-bold">{w.role || 'worker'}</span></div>
                  </div>
                  <div className="font-bold text-emerald-400 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                    KSh {w.balance || 0}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400">Outlier Quality Review Queue ({submissions.length})</h2>
            <div className="divide-y divide-slate-800">
              {submissions.map((s) => (
                <div key={s.id} className="py-3 flex justify-between items-center text-xs">
                  <div className="space-y-1 max-w-md">
                    <div className="font-bold text-white">{s.task_title} <span className="text-emerald-400">(KSh {s.reward})</span></div>
                    <div className="text-[10px] text-slate-400">Worker: {s.worker_email}</div>
                    <div className="bg-slate-950 p-2 rounded-lg text-slate-300 font-mono text-[11px] border border-slate-800">
                      Proof: {s.proof_text}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.status === 'pending' ? (
                      <>
                        <button onClick={() => handleApproveSubmission(s)} className="bg-emerald-600 px-3 py-1.5 rounded-lg font-bold text-white">
                          Approve & Pay
                        </button>
                        <button onClick={() => handleRejectSubmission(s.id)} className="bg-red-600/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg font-bold">
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className={`font-black uppercase text-[10px] px-2 py-0.5 rounded ${s.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {s.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400">Wednesday Payout Queue</h2>
            <div className="divide-y divide-slate-800">
              {payouts.map((p) => (
                <div key={p.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-white">{p.worker_email}</div>
                    <div className="text-[10px] text-slate-400">Phone: {p.phone} | KSh {p.amount}</div>
                  </div>
                  <span className="font-bold uppercase text-slate-500">{p.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
              <h2 className="text-xs font-black uppercase text-slate-400">Publish Global Task</h2>
              <form onSubmit={handleAddTask} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Task Title" 
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" 
                    placeholder="Reward (KES)" 
                    value={taskReward}
                    onChange={(e) => setTaskReward(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                  <input 
                    type="url" 
                    placeholder="Link" 
                    value={taskLink}
                    onChange={(e) => setTaskLink(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-emerald-600 font-bold text-xs py-2.5 rounded-xl">
                  + Add Live Task
                </button>
              </form>
            </div>

            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-400">Global Tasks ({tasks.length})</h3>
              <div className="divide-y divide-slate-800">
                {tasks.map((t) => (
                  <div key={t.id} className="py-2.5 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-bold text-white">{t.title}</div>
                      <div className="text-[10px] text-emerald-400">KSh {t.reward}</div>
                    </div>
                    <button onClick={() => deleteTask(t.id)} className="bg-red-600/20 text-red-400 px-2 py-1 rounded text-[10px] font-bold">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
