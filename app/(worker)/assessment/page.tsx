'use client';

import { useState } from 'react';

export default function WorkerAssessmentPage() {
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState({ q1: '', q2: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Calculate score (simple mock validation logic)
    let score = 0;
    if (answers.q1 === 'memoization') score += 50;
    if (answers.q2 === 'vector') score += 50;

    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerEmail: email,
          score,
          answers,
        }),
      });

      if (!res.ok) throw new Error('Failed to record submission');

      setSubmitted(true);
    } catch (err) {
      alert('Error submitting assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center space-y-4">
        <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
          ✓
        </div>
        <h1 className="text-xl font-black text-white">Assessment Submitted</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Your answers have been stored in Supabase and queued for admin audit.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Skill Verification</span>
        <h1 className="text-xl font-black text-white mt-1">Qualification Assessment</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">Worker Email:</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. evaluator@domain.com"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300">
            Q1: What optimization prevents stack overflow in recursive Fibonacci routines?
          </label>
          <select
            value={answers.q1}
            onChange={(e) => setAnswers({ ...answers, q1: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300"
          >
            <option value="">Select answer...</option>
            <option value="memoization">Memoization / Dynamic Programming</option>
            <option value="loop">Infinite While Loop</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300">
            Q2: Force is represented in mechanics as a:
          </label>
          <select
            value={answers.q2}
            onChange={(e) => setAnswers({ ...answers, q2: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300"
          >
            <option value="">Select answer...</option>
            <option value="scalar">Scalar Quantity</option>
            <option value="vector">Vector Quantity</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-black text-xs py-3 rounded-xl transition"
        >
          {loading ? 'Saving to Database...' : 'Submit Assessment'}
        </button>
      </form>
    </div>
  );
}
