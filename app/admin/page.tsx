'use client';

export const dynamic = 'force-dynamic';

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

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || '';
    setCurrentUser(email);

    fetchAdminData();
    loadTasks();
  }, []);

  const fetchAdminData = async () => {
    let remoteSubs: any[] = [];
    try {
      const { data: workerData } = await supabase.from('workers').select('*');
      if (workerData) setWorkers(workerData);

      const { data: subData } = await supabase.from('task_submissions').select('*').order('created_at', { ascending: false });
      if (subData) remoteSubs = subData;

      const { data: payoutData } = await supabase.from('payouts').select('*').order('created_at', { ascending: false });
      if (payoutData) setPayouts(payoutData);
    } catch (e) {
      console.warn('Database fetch failed');
    }

    // Merge local backup submissions so submitted tasks always show up
    const localSubs = JSON.parse(localStorage.getItem('rofra_pending_submissions') || '[]');
    const merged = [...localSubs, ...remoteSubs];
    setSubmissions(merged);
  };

  const loadTasks = async () => {
    const data = await fetchAllTasks();
    setTasks(data);
  };

  const handleApproveSubmission = async (sub: any) => {
    try {
      await supabase.from('task_submissions').update({ status: 'approved' }).eq('id', sub.id);
    } catch(e) {}

    // Update local submissions list
    const local = JSON.parse(localStorage.getItem('rofra_pending_submissions') || '[]');
    const updatedLocal = local.map((item: any) => item.id === sub.id ? { ...item, status: 'approved' } : item);
    localStorage.setItem('rofra_pending_submissions', JSON.stringify(updatedLocal));

    alert(`Submission approved for ${sub.worker_email}!`);
    fetchAdminData();
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

        {activeTab === 'reviews' && (
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400">Quality Review Queue ({submissions.length})</h2>
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
                      <button onClick={() => handleApproveSubmission(s)} className="bg-emerald-600 px-3 py-1.5 rounded-lg font-bold text-white">
                        Approve & Pay
                      </button>
                    ) : (
                      <span className="font-black uppercase text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        {s.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
