'use client';

export default function WorkerEarningsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <h1 className="text-xl font-black text-white">Earnings & Balance</h1>
        <p className="text-xs text-slate-400 mt-1">Track approved balances and request payouts.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Pending Review</span>
          <div className="text-2xl font-black text-amber-400 font-mono">KSh 450</div>
        </div>
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Approved Balance</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">KSh 1,200</div>
        </div>
      </div>
    </div>
  );
}
