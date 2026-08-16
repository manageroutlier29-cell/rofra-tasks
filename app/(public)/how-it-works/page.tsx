'use client';

export default function HowItWorksPage() {
  const steps = [
    { num: '01', title: 'Register & Create Profile', desc: 'Sign up and submit your background experience in STEM, programming, or language evaluation.' },
    { num: '02', title: 'Pass Qualification Assessment', desc: 'Take a timed skill-verification test to demonstrate accuracy and evaluation capability.' },
    { num: '03', title: 'Receive Project Invites', desc: 'Approved evaluators unlock active client projects matching their verified skill set.' },
    { num: '04', title: 'Submit & Get Paid', desc: 'Complete RLHF tasks, receive quality reviews, and request earnings directly to your account.' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Process Flow</span>
        <h1 className="text-3xl font-black text-white">How ROFRA EVAL Works</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((s) => (
          <div key={s.num} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-2">
            <span className="text-xl font-black text-emerald-400 font-mono">{s.num}</span>
            <h2 className="text-base font-bold text-white">{s.title}</h2>
            <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
