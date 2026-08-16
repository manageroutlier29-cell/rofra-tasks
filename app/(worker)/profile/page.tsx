'use client';
import { useState } from 'react';

export default function WorkerProfilePage() {
  const [skills, setSkills] = useState(['RLHF Chatbot Rating', 'Python Code Evaluation']);
  const allSkills = ['RLHF Chatbot Rating', 'Python Code Evaluation', 'STEM / Math Reasoning', 'Translation Quality', 'Safety & Toxicity'];

  const toggleSkill = (skill: string) => {
    setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <h1 className="text-xl font-black text-white">Evaluator Profile</h1>
        <p className="text-xs text-slate-400 mt-1">Manage your identity, background, and verified competencies.</p>
      </div>

      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Selected Skills & Domains</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allSkills.map(s => (
            <button key={s} onClick={() => toggleSkill(s)} className={`p-3.5 rounded-2xl border text-xs font-bold text-left transition ${skills.includes(s) ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'}`}>
              {s} {skills.includes(s) && '✓'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
