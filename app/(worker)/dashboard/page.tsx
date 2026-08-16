'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function WorkerDashboardPage() {
  const [workerStatus] = useState<'ONBOARDING' | 'PENDING_ASSESSMENT' | 'PENDING_APPROVAL' | 'APPROVED'>('APPROVED');

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
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {workerStatus}
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
          <div className="text-2xl font-black text-white font-mono">2</div>
        </div>
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Lifetime Earnings</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">KSh 1,200</div>
        </div>
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Quality Rating</span>
          <div className="text-2xl font-black text-amber-400 font-mono">98% ★</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">Recent Activity</h2>
          <Link href="/tasks" className="text-xs font-bold text-emerald-400 hover:underline">Go to Tasks →</Link>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold text-white">RLHF Chatbot Prompt Evaluation</h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Project: Python Code Verification • Reward: KSh 150</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Approved
            </span>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold text-white">STEM Physics Reasoning Audit</h3>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Project: Physics Mechanics • Reward: KSh 200</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Pending Review
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
