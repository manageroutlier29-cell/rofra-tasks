'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { fetchAllTasks, Task } from '@/lib/tasks';

export default function AdminBackendPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState('');
  const [activeTab, setActiveTab] = useState<'reviews' | 'users' | 'tasks'>('reviews');
  
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [workers, setWorkers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || 'admin@rofra.com';
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
    } catch (e) {
      console.warn('Remote database fetch skipped');
    }

    const localSubs = JSON.parse(localStorage.getItem('rofra_pending_submissions') || '[]');
    
    const combined = [...localSubs];
    remoteSubs.forEach((r) => {
      if (!combined.some((l) => l.id === r.id)) {
        combined.push(r);
      }
    });

    setSubmissions(combined);
  };

  const loadTasks = async () => {
    const data = await fetchAllTasks();
    setTasks(data);
  };

  const handleApproveSubmission = async (sub: any) => {
    try {
      await supabase.from('task_submissions').update({ status: 'approved' }).eq('id', sub.id);
    } catch (e) {}

    const local = JSON.parse(localStorage.getItem('rofra_pending_submissions') || '[]');
    const updatedLocal = local.map((item: any) => 
      item.id === sub.id ? { ...item, status: 'approved' } : item
    );
    localStorage.setItem('rofra_pending_submissions', JSON.stringify(updatedLocal));

    alert(`Correct Answer Approved! KSh ${sub.reward} credited to ${sub.worker_email}`);
    fetchAdminData();
  };

  const handleRejectSubmission = async (sub: any) => {
    try {
      await supabase.from('task_submissions').update({ status: 'rejected' }).eq('id', sub.id);
    } catch (e) {}

    const local = JSON.parse(localStorage.getItem('rofra_pending_submissions') || '[]');
    const updatedLocal = local.map((item: any) => 
      item.id === sub.id ? { ...item, status: 'rejected' } : item
    );
    localStorage.setItem('rofra_pending_submissions', JSON.stringify(updatedLocal));

    alert(`Submission rejected for ${sub.worker_email}`);
    fetchAdminData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Admin Header */}
        <div className="flex justify-between items-center bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-lg">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Quality Control</span>
            <h1 className="text-base font-black text-white">ROFRA TASK REVIEW PANEL</h1>
          </div>
          <button 
            onClick={() => router.push('/dashboard')} 
            className="text-xs font-bold bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-700 text-slate-300"
          >
            ← Back to App
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 gap-2">
          {(['reviews', 'users', 'tasks'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                activeTab === tab ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab === 'reviews' ? `Review Queue (${submissions.length})` : tab}
            </button>
          ))}
        </div>

        {/* Answer Quality Review Queue */}
        {activeTab === 'reviews' && (
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Submitted Academic Answers ({submissions.length})
            </h2>

            {submissions.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No submitted answers pending review yet.
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((s) => (
                  <div key={s.id} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                    
                    <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                            {s.category || 'Academic Task'}
                          </span>
                          {/* Worker Account Badge */}
                          <span className="bg-slate-800 text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded-md border border-slate-700 font-bold">
                            User: {s.worker_email || 'robertwaweru324@gmail.com'}
                          </span>
                        </div>
                        <h3 className="text-sm font-black text-white">{s.task_title}</h3>
                      </div>

                      <span className="text-xs font-black font-mono text-emerald-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
                        KSh {s.reward}
                      </span>
                    </div>

                    {/* Submitted Work */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Answer Submission by <span className="text-emerald-400">{s.worker_email || 'User'}</span>:
                      </span>
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                        {s.proof_text}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-2">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg ${
                        s.status === 'approved' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : s.status === 'rejected'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        Status: {s.status}
                      </span>

                      {s.status === 'pending' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleApproveSubmission(s)} 
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow"
                          >
                            ✓ Approve (KSh {s.reward})
                          </button>
                          <button 
                            onClick={() => handleRejectSubmission(s)} 
                            className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-bold text-xs px-3 py-2 rounded-xl transition"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
            <h2 className="text-xs font-black uppercase text-slate-400">Registered Accounts</h2>
            <div className="divide-y divide-slate-800 text-xs">
              <div className="py-2 flex justify-between items-center">
                <span className="font-bold text-white">robertwaweru324@gmail.com</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-500/30">Active Worker</span>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-3">
            <h2 className="text-xs font-black uppercase text-slate-400">Active Academic Question Bank ({tasks.length})</h2>
            <div className="divide-y divide-slate-800 text-xs">
              {tasks.map((t) => (
                <div key={t.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">{t.title}</div>
                    <div className="text-[10px] text-emerald-400">KSh {t.reward}</div>
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
