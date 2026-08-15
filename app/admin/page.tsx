'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { fetchAllTasks, Task } from '@/lib/tasks';

export default function AdminBackendPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'team' | 'payouts' | 'tasks'>('users');
  
  const [workers, setWorkers] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [newTeamEmail, setNewTeamEmail] = useState('');
  const [newTeamRole, setNewTeamRole] = useState('director');

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
    const { data: workerData } = await supabase.from('workers').select('*');
    if (workerData) setWorkers(workerData);

    const { data: payoutData } = await supabase.from('payouts').select('*').order('created_at', { ascending: false });
    if (payoutData) setPayouts(payoutData);
  };

  const loadTasks = async () => {
    const data = await fetchAllTasks();
    setTasks(data);
  };

  const toggleProStatus = async (email: string, currentPro: boolean) => {
    await supabase.from('workers').update({ is_pro: !currentPro }).eq('email', email);
    fetchAdminData();
  };

  const adjustBalance = async (email: string, currentBalance: number) => {
    const added = prompt('Set user balance (KSh):', currentBalance.toString());
    if (added !== null) {
      const newBal = parseFloat(added);
      if (!isNaN(newBal)) {
        await supabase.from('workers').update({ balance: newBal }).eq('email', email);
        fetchAdminData();
      }
    }
  };

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamEmail) return;

    const lowerEmail = newTeamEmail.trim().toLowerCase();
    const { data: existing } = await supabase.from('workers').select('*').eq('email', lowerEmail).single();

    if (existing) {
      await supabase.from('workers').update({ role: newTeamRole, is_pro: true }).eq('email', lowerEmail);
    } else {
      await supabase.from('workers').insert([
        { email: lowerEmail, balance: 0, is_pro: true, role: newTeamRole }
      ]);
    }

    alert(`Role '${newTeamRole}' assigned to ${lowerEmail}`);
    setNewTeamEmail('');
    fetchAdminData();
  };

  const handlePayoutStatus = async (id: string, status: 'approved' | 'rejected') => {
    await supabase.from('payouts').update({ status }).eq('id', id);
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

  const teamMembers = workers.filter((w) => w.role && w.role !== 'worker');

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
          {(['users', 'team', 'payouts', 'tasks'] as const).map((tab) => (
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
                    <div className="text-[10px] text-slate-400">
                      Phone: {w.phone || 'N/A'} | Role: <span className="text-amber-400 font-bold">{w.role || 'worker'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => adjustBalance(w.email, w.balance || 0)} className="bg-slate-800 px-2.5 py-1 rounded font-bold text-emerald-400 border border-slate-700">
                      KSh {w.balance || 0}
                    </button>
                    <button onClick={() => toggleProStatus(w.email, w.is_pro)} className={`px-3 py-1 rounded font-bold ${w.is_pro ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      {w.is_pro ? 'PRO' : 'Make PRO'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="space-y-4">
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
              <h2 className="text-xs font-black uppercase text-slate-400">Assign Director / Support Access</h2>
              <form onSubmit={handleAddTeamMember} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input 
                  type="email" 
                  placeholder="director@rofratask.com" 
                  value={newTeamEmail}
                  onChange={(e) => setNewTeamEmail(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
                <select 
                  value={newTeamRole}
                  onChange={(e) => setNewTeamRole(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                >
                  <option value="director">Director</option>
                  <option value="support">Support Agent</option>
                  <option value="admin">Admin</option>
                </select>
                <button type="submit" className="bg-emerald-600 font-bold text-xs py-2 rounded-xl">
                  + Assign Role
                </button>
              </form>
            </div>

            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-black uppercase text-slate-400">Authorized Team Members ({teamMembers.length})</h3>
              <div className="divide-y divide-slate-800">
                {teamMembers.map((m) => (
                  <div key={m.email} className="py-2.5 flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{m.email}</span>
                    <span className="bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded-full font-black uppercase text-[10px]">
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payouts' && (
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400">Wednesday M-Pesa Payout Queue</h2>
            <div className="divide-y divide-slate-800">
              {payouts.map((p) => (
                <div key={p.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-white">{p.worker_email}</div>
                    <div className="text-[10px] text-slate-400">Phone: {p.phone} | KSh {p.amount}</div>
                  </div>
                  <div className="flex gap-2">
                    {p.status === 'pending' ? (
                      <>
                        <button onClick={() => handlePayoutStatus(p.id, 'approved')} className="bg-emerald-600 px-2 py-1 rounded text-white font-bold">Approve</button>
                        <button onClick={() => handlePayoutStatus(p.id, 'rejected')} className="bg-red-600 px-2 py-1 rounded text-white font-bold">Reject</button>
                      </>
                    ) : (
                      <span className="font-bold uppercase text-slate-500">{p.status}</span>
                    )}
                  </div>
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
