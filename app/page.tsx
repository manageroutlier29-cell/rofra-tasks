import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white pb-16">
      
      {/* Top Banner / Hero Section */}
      <div className="max-w-md mx-auto px-4 pt-10 text-center relative">
        
        {/* Floating Feature Pills */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap text-xs font-semibold">
          <span className="bg-white border border-slate-200 shadow-sm text-slate-700 px-3 py-1 rounded-full flex items-center gap-1">
            💻 DATA ENTRY
          </span>
          <span className="bg-white border border-slate-200 shadow-sm text-slate-700 px-3 py-1 rounded-full flex items-center gap-1">
            ⭐ MICRO-GIGS
          </span>
          <span className="bg-white border border-slate-200 shadow-sm text-slate-700 px-3 py-1 rounded-full flex items-center gap-1">
            📊 SURVEYS
          </span>
        </div>

        {/* Central Icon Container */}
        <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center mb-6 border-4 border-white">
          <span className="text-4xl">💼</span>
        </div>

        {/* Category Pill */}
        <div className="inline-flex items-center gap-1.5 bg-emerald-100/80 text-emerald-800 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mb-4">
          ✨ KENYA'S #1 REMOTE TASK PLATFORM
        </div>

        {/* Main Title */}
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-3">
          ROFRA <span className="text-emerald-600">TASKS</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm text-slate-600 leading-relaxed mb-6 px-2">
          Complete simple digital tasks, unlock high-paying micro-gigs, and get paid instantly via M-Pesa, Bank, or Crypto.
        </p>

        {/* Live Indicator Badge */}
        <div className="inline-flex items-center gap-2 bg-white border border-slate-200/80 px-3.5 py-1.5 rounded-full text-xs text-slate-600 shadow-sm mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-800">Live: 8,430 workers online earning now</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/register"
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-600/25 transition-all text-base"
          >
            Get Started Now <span className="text-lg">→</span>
          </Link>
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center bg-white hover:bg-slate-100 text-slate-700 font-bold py-3.5 px-6 rounded-2xl border border-slate-200/90 shadow-sm transition-all text-base"
          >
            I already have an account
          </Link>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-md mx-auto px-4 mt-12">
        <h2 className="text-center font-extrabold text-slate-900 text-base mb-4 uppercase tracking-wide">
          How It Works
        </h2>

        <div className="bg-white rounded-3xl p-6 border border-slate-200/70 shadow-xl shadow-slate-200/50 space-y-6">
          
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0 text-sm border border-emerald-200">
              1
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                Create your free account <span>👥</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Takes less than 2 minutes.</p>
            </div>
          </div>

          {/* Divider Line */}
          <div className="ml-4 border-l-2 border-dashed border-slate-200 h-2 -my-4"></div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0 text-sm border border-emerald-200">
              2
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                Complete simple jobs <span>📈</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Surveys, app testing, reviews & more.</p>
            </div>
          </div>

          {/* Divider Line */}
          <div className="ml-4 border-l-2 border-dashed border-slate-200 h-2 -my-4"></div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center flex-shrink-0 text-sm border border-emerald-200">
              3
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                Redeem instantly <span>💸</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Withdraw to M-Pesa, Bank, or Crypto.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Feature Grid Section */}
      <div className="max-w-md mx-auto px-4 mt-8">
        <div className="grid grid-cols-2 gap-3">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-base mb-2">
              ⚡
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Easy Jobs</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">No experience needed</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-base mb-2">
              📲
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Instant Withdraw</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Direct M-Pesa payouts</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-base mb-2">
              🌍
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Work Anywhere</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">100% remote layout</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-base mb-2">
              ✅
            </div>
            <h4 className="font-bold text-slate-900 text-xs">Fast Setup</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Instant account approval</p>
          </div>

        </div>
      </div>

      {/* Social Proof */}
      <div className="max-w-md mx-auto px-4 mt-10 text-center">
        <div className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 mb-2">
          <span>🛡️</span> Trusted by 15,000+ Active Earners
        </div>
        <div className="flex justify-center -space-x-2">
          <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-700">RN</div>
          <div className="w-8 h-8 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-xs font-bold text-white">JK</div>
          <div className="w-8 h-8 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white">MK</div>
          <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white">AO</div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-[10px] text-slate-400 uppercase tracking-widest mt-12">
        © {new Date().getFullYear()} ROFRA TASKS. ALL RIGHTS RESERVED.
      </footer>

    </div>
  );
}
