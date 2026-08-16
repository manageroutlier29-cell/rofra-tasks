'use client';
import { useState } from 'react';

export default function WorkerTasksPage() {
  const [rating, setRating] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Active Workspace</span>
        <h1 className="text-xl font-black text-white mt-1">Chatbot Response Evaluation</h1>
      </div>

      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase">User Prompt:</span>
          <p className="text-xs text-slate-200 font-mono">Write a recursive function in Python to compute the Nth Fibonacci number.</p>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-emerald-400 uppercase">Model Output:</span>
          <p className="text-xs text-slate-200 font-mono">def fib(n): return n if n &lt;= 1 else fib(n-1) + fib(n-2)</p>
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-300">Grade Response Accuracy & Efficiency (1-5):</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(num => (
              <button key={num} onClick={() => setRating(num)} className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition border ${rating === num ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-950 text-slate-400 border-slate-800'}`}>
                {num} ★
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => alert('Evaluation submitted for quality review!')} disabled={!rating} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-black text-xs py-3 rounded-xl transition">
          Submit Task Evaluation
        </button>
      </div>
    </div>
  );
}
