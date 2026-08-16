'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">
      
      {/* Hero Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <span className="inline-block bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/20">
          Enterprise Human-In-The-Loop AI Evaluation
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
          High-Quality Data & RLHF for Next-Gen Frontier Models
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          ROFRA EVAL connects AI companies with vetted domain experts for RLHF evaluation, code verification, STEM reasoning, and red-teaming.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link
            href="/register"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition shadow-lg"
          >
            Apply as Evaluator
          </Link>
          <Link
            href="/for-companies"
            className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs px-6 py-3.5 rounded-xl transition"
          >
            Hire AI Workforce
          </Link>
        </div>
      </div>

      {/* Value Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">01 / Rigorous Screening</span>
          <h3 className="text-base font-bold text-white">Domain-Specific Assessments</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Evaluators undergo skill tests covering Python development, STEM problem solving, and safety compliance.
          </p>
        </div>
        <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">02 / RLHF Quality Control</span>
          <h3 className="text-base font-bold text-white">Multi-Tier Auditing</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every prompt evaluation passes automated linting and admin audit rounds prior to client delivery.
          </p>
        </div>
        <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-800 space-y-2">
          <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest">03 / Fair Compensation</span>
          <h3 className="text-base font-bold text-white">Automated Payouts</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Workers track completed tasks in real time and receive earnings directly into local and international balances.
          </p>
        </div>
      </div>

    </div>
  );
}
