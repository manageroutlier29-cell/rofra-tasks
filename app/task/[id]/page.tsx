'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { fetchAllTasks, Task } from '@/lib/tasks';

export default function OutlierTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [proof, setProof] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10-minute timer
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail') || '';
    setEmail(userEmail);

    async function loadTask() {
      const allTasks = await fetchAllTasks();
      const current = allTasks.find((t) => t.id === taskId);
      if (current) setTask(current);
    }
    loadTask();

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proof.trim() || !task) return;

    setSubmitting(true);

    const { error } = await supabase.from('task_submissions').insert([
      {
        task_id: task.id,
        task_title: task.title,
        worker_email: email,
        proof_text: proof,
        reward: task.reward,
        status: 'pending'
      }
    ]);

    if (!error) {
      alert('Task submitted for Reviewer Approval!');
      router.push('/dashboard');
    } else {
      alert('Failed to submit task. Please try again.');
    }
    setSubmitting(false);
  };

  if (!task) return <div className="p-6 text-center text-xs text-slate-500">Loading task workplace...</div>;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-2xl space-y-6">
        
        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active Task Workspace</span>
            <h1 className="text-lg font-black text-white">{task.title}</h1>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 block">Time Remaining</span>
            <span className={`text-sm font-black font-mono ${timeLeft < 120 ? 'text-red-400' : 'text-amber-400'}`}>
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700 space-y-2 text-xs">
          <div className="font-bold text-emerald-400">Task Instructions:</div>
          <p className="text-slate-300">
            Open the link below, complete the target action, and provide proof (e.g., username, transaction ID, or completion link) below.
          </p>
          <a 
            href={task.link} 
            target="_blank" 
            rel="noreferrer" 
            className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs px-4 py-2 rounded-xl transition mt-2"
          >
            Open External Task Link ↗
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Work Verification / Proof</label>
            <textarea 
              rows={4}
              placeholder="Enter screenshot link, username, or text proof here..."
              value={proof}
              onChange={(e) => setProof(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting || timeLeft === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3.5 rounded-xl transition shadow"
          >
            {submitting ? 'Submitting to Review Queue...' : 'Submit Task for Quality Review'}
          </button>
        </form>

      </div>
    </div>
  );
}
