'use client';

import { useState } from 'react';

export default function WorkerAssessmentPage() {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [step, setStep] = useState<'skills' | 'test' | 'completed'>('skills');

  const availableSkills = [
    'RLHF Chatbot Rating',
    'Python Code Evaluation',
    'STEM / Math Reasoning',
    'Language Translation Quality',
    'Safety & Toxicity Filtering'
  ];

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Step 2 / 3</span>
        <h1 className="text-xl font-black text-white mt-1">Worker Qualification Assessment</h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete skill verification to unlock paid client projects.
        </p>
      </div>

      {step === 'skills' && (
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white">Select Your Expertise Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`p-4 rounded-2xl border text-left text-xs font-bold transition flex justify-between items-center ${
                  selectedSkills.includes(skill)
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>{skill}</span>
                {selectedSkills.includes(skill) && <span>✓</span>}
              </button>
            ))}
          </div>

          <button
            disabled={selectedSkills.length === 0}
            onClick={() => setStep('test')}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-black text-xs py-3.5 rounded-xl transition shadow-lg mt-4"
          >
            Start Qualification Test ({selectedSkills.length} Selected)
          </button>
        </div>
      )}

      {step === 'test' && (
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-400">Question 1 of 3</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">Time: 10:00</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-300">Evaluate Chatbot Response:</h3>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
              User: "Write a function to calculate Fibonacci."<br/>
              Bot: "def fib(n): return n if n &lt;= 1 else fib(n-1) + fib(n-2)"
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400">Rate Accuracy & Helpfulness (1-5):</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button key={num} className="flex-1 py-2.5 bg-slate-950 hover:bg-emerald-600 border border-slate-800 rounded-xl text-xs font-bold">
                  {num}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep('completed')}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3.5 rounded-xl transition shadow-lg"
          >
            Submit Assessment for Review
          </button>
        </div>
      )}

      {step === 'completed' && (
        <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <h2 className="text-base font-black text-white">Assessment Submitted!</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Your qualification assessment is currently under review by our admin team. You will be notified once approved to access active projects.
          </p>
        </div>
      )}
    </div>
  );
}
