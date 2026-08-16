'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface WorkerStats {
  workerStatus: string;
  activeTasksCount: number;
  lifetimeEarnings: number;
  qualityRating: string;
  submissions: Array<{
    id: string;
    title: string;
    rewardAmount: number;
    status: string;
  }>;
}

export default function WorkerDashboardPage() {
  const [stats, setStats] = useState<WorkerStats>({
    workerStatus: 'PENDING_ASSESSMENT',
    activeTasksCount: 0,
    lifetimeEarnings: 0,
    qualityRating: '100%',
    submissions: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/worker/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Worker Portal Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest">Worker Account</span>
          <h1 className="text-xl font-black text-white">Worker Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Account Status:</span>
          <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${
            stats.workerStatus === 'APPROVED' 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {loading ? 'LOADING...' : stats.workerStatus}
          </span>
        </div>
      </div>

      {/* Onboarding Lifecycle Flow */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">Worker Action Flow</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <Link href="/profile" className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 hover:border-emerald-500 transition">
            <div className="text-xs font-bold text-emerald-400">1. Select Skills</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Profile Settings</div>
          </Link>
          <Link href="/assessment" className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 hover:border-emerald-500 transition">
            <div className="text-xs font-bold text-emerald-400">2. Qualification</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Take Assessment</div>
          </Link>
          <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
            <div className="text-xs font-bold text-emerald-400">3. Admin Audit</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Approval Status</div>
          </div>
          <Link href="/projects" className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 hover:border-emerald-500 transition">
            <div className="text-xs font-bold text-emerald-400">4. Work & Tasks</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Browse Projects</div>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Active Tasks</span>
          <div className="text-2xl font-black text-white font-mono">{stats.activeTasksCount}</div>
        </div>
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Lifetime Earnings</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            KSh {stats.lifetimeEarnings.toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Quality Rating</span>
          <div className="text-2xl font-black text-amber-400 font-mono">{stats.qualityRating}</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">Recent Activity</h2>
          <Link href="/tasks" className="text-xs font-bold text-emerald-400 hover:underline">Go to Tasks →</Link>
        </div>

        {stats.submissions.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs font-mono bg-slate-950 rounded-2xl border border-slate-800">
            No active task submissions found. Complete an assessment to get assigned.
          </div>
        ) : (
          <div className="space-y-3">
            {stats.submissions.map((sub) => (
              <div key={sub.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-bold text-white">{sub.title}</h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Reward: KSh {sub.rewardAmount}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                  sub.status === 'APPROVED'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
