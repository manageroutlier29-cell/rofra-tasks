'use client';

export default function WorkerProjectsPage() {
  const projects = [
    { id: '1', title: 'RLHF Python Code Verification', pay: 'KSh 150 / task', status: 'Unlocked', category: 'Programming' },
    { id: '2', title: 'STEM Physics Reasoning Audit', pay: 'KSh 200 / task', status: 'Locked (Requires Assessment)', category: 'STEM' }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <h1 className="text-xl font-black text-white">Available Projects</h1>
        <p className="text-xs text-slate-400 mt-1">Explore client projects matching your verified skill set.</p>
      </div>

      <div className="space-y-3">
        {projects.map(p => (
          <div key={p.id} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{p.category}</span>
              <h3 className="text-sm font-bold text-white">{p.title}</h3>
              <span className="text-xs text-slate-400 font-mono">{p.pay}</span>
            </div>
            <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${p.status.startsWith('Unlocked') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
