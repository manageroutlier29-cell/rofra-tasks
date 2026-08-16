'use client';

export default function PricingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Transparent Rates</span>
        <h1 className="text-3xl font-black text-white">Evaluator & Client Pricing</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-4">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">For Evaluators</span>
          <h2 className="text-2xl font-black text-white">Free Registration</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Create an account, complete qualification testing, and start earning per task without upfront costs.
          </p>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-4">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">For Enterprise Clients</span>
          <h2 className="text-2xl font-black text-white">Custom Project Quote</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pay per verified evaluation task with custom quality SLAs and dispute protection included.
          </p>
        </div>
      </div>
    </div>
  );
}
