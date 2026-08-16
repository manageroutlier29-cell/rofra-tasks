'use client';

import { useState } from 'react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'assessments' | 'payouts' | 'projects'>('assessments');

  // Pending Assessments State
  const [assessments, setAssessments] = useState([
    { id: 'sub-1', email: 'worker1@example.com', score: 85, date: '2026-08-15', status: 'Pending Review' },
    { id: 'sub-2', email: 'evaluator@domain.com', score: 60, date: '2026-08-16', status: 'Pending Review' },
  ]);

  // Pending Payouts State
  const [payouts, setPayouts] = useState([
    { id: 'tx-101', email: 'worker1@example.com', amount: 1200, method: 'M-Pesa (0712345678)', status: 'Pending' },
    { id: 'tx-102', email: 'john@domain.com', amount: 3500, method: 'Equity Bank (0123456789)', status: 'Pending' },
  ]);

  const handleApproveAssessment = (id: string) => {
    setAssessments(assessments.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
  };

  const handleRejectAssessment = (id: string) => {
    setAssessments(assessments.map(a => a.id === id ? { ...a, status: 'Rejected' } : a));
  };

  const handleApprovePayout = (id: string) => {
    setPayouts(payouts.map(p => p.id === id ? { ...p, status: 'Disbursed' } : p));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Admin Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex justify-between items-center flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-black uppercase text-amber-400 tracking-widest">System Administration</span>
          <h1 className="text-xl font-black text-white">Admin Control Portal</h1>
        </div>
        <div className="flex gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            Admin Mode
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Pending Audits</span>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {assessments.filter(a => a.status === 'Pending Review').length}
          </div>
        </div>
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Pending Payouts</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {payouts.filter(p => p.status === 'Pending').length}
          </div>
        </div>
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Active Workers</span>
          <div className="text-2xl font-black text-white font-mono">142</div>
        </div>
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Disbursed</span>
          <div className="text-2xl font-black text-sky-400 font-mono">KSh 48,500</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('assessments')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'assessments'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Worker Assessment Audits
        </button>
        <button
          onClick={() => setActiveTab('payouts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'payouts'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Payout Approvals
        </button>
      </div>

      {/* Assessment Approvals Section */}
      {activeTab === 'assessments' && (
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            Worker Qualification Submissions
          </h2>

          <div className="space-y-3">
            {assessments.map((item) => (
              <div key={item.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="text-xs font-bold text-white">{item.email}</h3>
                  <div className="flex gap-3 text-[10px] font-mono text-slate-400 mt-1">
                    <span>Score: <strong className="text-emerald-400">{item.score}%</strong></span>
                    <span>Date: {item.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.status === 'Pending Review' ? (
                    <>
                      <button
                        onClick={() => handleRejectAssessment(item.id)}
                        className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-bold border border-rose-800/50"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApproveAssessment(item.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
                      >
                        Approve Worker
                      </button>
                    </>
                  ) : (
                    <span className={`text-xs font-bold px-3 py-1 rounded-xl ${
                      item.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payout Approvals Section */}
      {activeTab === 'payouts' && (
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            Pending Withdrawal Requests
          </h2>

          <div className="space-y-3">
            {payouts.map((pay) => (
              <div key={pay.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="text-xs font-bold text-white">{pay.email}</h3>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">{pay.method}</p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-emerald-400 font-mono">
                    KSh {pay.amount.toLocaleString()}
                  </span>

                  {pay.status === 'Pending' ? (
                    <button
                      onClick={() => handleApprovePayout(pay.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow"
                    >
                      Release Payment
                    </button>
                  ) : (
                    <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Disbursed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
