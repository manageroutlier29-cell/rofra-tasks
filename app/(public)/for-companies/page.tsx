'use client';

export default function ForCompaniesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Enterprise AI Workforce</span>
        <h1 className="text-3xl font-black text-white">Custom Model Evaluation at Scale</h1>
        <p className="text-xs text-slate-400">
          Source pre-screened specialists to grade, annotate, red-team, and refine model outputs.
        </p>
      </div>

      <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Available Expertise Domains</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 font-mono">
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">✓ Python & TypeScript Code Auditing</div>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">✓ Advanced Mathematics & STEM Reasoning</div>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">✓ Red-Teaming & Safety Compliance</div>
          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">✓ RLHF Model Comparison & Ranking</div>
        </div>
      </div>
    </div>
  );
}
