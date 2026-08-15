'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { fetchAllTasks, Task } from '@/lib/tasks';

export default function SubjectTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(600);
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail') || 'robertwaweru324@gmail.com';
    setEmail(userEmail);

    async function loadTask() {
      const allTasks = await fetchAllTasks();
      const current = allTasks.find((t) => String(t.id) === String(taskId));
      if (current) {
        setTask(current);
      }
    }
    loadTask();

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || !task) return;

    setSubmitting(true);

    const payload = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      task_id: String(task.id),
      task_title: task.title,
      category: task.category,
      worker_email: email,
      proof_text: answer.trim(),
      reward: Number(task.reward) || 0,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase.from('task_submissions').insert([payload]);
      if (error) throw error;
    } catch (err) {
      const existing = JSON.parse(localStorage.getItem('rofra_pending_submissions') || '[]');
      existing.push(payload);
      localStorage.setItem('rofra_pending_submissions', JSON.stringify(existing));
    } finally {
      setSubmitting(false);
      alert('Answer submitted for Review!');
      router.push('/dashboard');
    }
  };

  if (!task) return <div className="p-6 text-center text-xs text-slate-500">Loading task #{taskId}...</div>;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-2xl space-y-6">
        
        <div className="flex justify-between items-center border-b border-slate-700 pb-4">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{task.category} Task #{task.id}</span>
            <h1 className="text-lg font-black text-white">{task.title}</h1>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 block">Time Left</span>
            <span className={`text-sm font-black font-mono ${timeLeft < 120 ? 'text-red-400' : 'text-amber-400'}`}>
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </div>
        </div>

        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-700 space-y-2">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Question:</div>
          <p className="text-sm font-medium text-slate-200">{task.question}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Your Answer / Solution</label>
            <textarea 
              rows={5}
              placeholder="Type your complete answer or workings here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white outline-none focus:border-emerald-500"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting || timeLeft === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-3.5 rounded-xl transition shadow"
          >
            {submitting ? 'Submitting Solution...' : 'Submit Solution for Review'}
          </button>
        </form>

      </div>
    </div>
  );
}
