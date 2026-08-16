'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TasksPage() {
  const [availableTasks, setAvailableTasks] = useState<any[]>([]);
  const [claimedTasks, setClaimedTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [submission, setSubmission] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  const loadTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setAvailableTasks(data.availableTasks || []);
      setClaimedTasks(data.claimedTasks || []);
    } catch (e) {
      console.error('Failed to load tasks feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleClaimTask = async (taskId: string) => {
    setActionLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/tasks/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to claim task');

      setMessage('Task claimed successfully! It is now locked under your active queue.');
      loadTasks();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    setActionLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/tasks/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId: selectedTask.id, submissionContent: submission }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to submit work');

      setMessage('Work submitted successfully! Pending Admin audit.');
      setSelectedTask(null);
      setSubmission('');
      loadTasks();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-bold text-sm">Loading task Workspace...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Worker Workspace</span>
          <h1 className="text-2xl font-black text-white">Task Board & Work Terminal</h1>
        </div>
        <Link href="/dashboard" className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition">
          ← Back to Dashboard
        </Link>
      </div>

      {message && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-bold">
          {message}
        </div>
      )}

      {/* Active Work Modal / Work Area */}
      {selectedTask && (
        <div className="bg-slate-900 border-2 border-emerald-500/40 p-6 rounded-3xl space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-400 font-mono">Active Working Terminal</span>
              <h2 className="text-lg font-black text-white">{selectedTask.title}</h2>
            </div>
            <button onClick={() => setSelectedTask(null)} className="text-xs font-bold text-slate-400 hover:text-white">Close Terminal</button>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs space-y-2">
            <span className="font-bold text-slate-400 uppercase">Instructions</span>
            <p className="text-slate-300 leading-relaxed">{selectedTask.instructions || 'Perform quality annotation or prompt validation as per standard guidelines.'}</p>
          </div>

          <form onSubmit={handleSubmitWork} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Your Submission Work Output</label>
              <textarea
                rows={5}
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                placeholder="Paste labeled data, prompt responses, or code audit feedback here..."
                className="w-full mt-1.5 p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setSelectedTask(null)} className="px-5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-400">Cancel</button>
              <button type="submit" disabled={actionLoading} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition disabled:opacity-50">
                {actionLoading ? 'Submitting...' : 'Submit Work for Audit'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Tasks feed */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">Open Tasks Feed</h2>
            <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-xl text-[10px] font-mono font-bold">{availableTasks.length} Available</span>
          </div>

          {availableTasks.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-6 text-center">No open tasks currently available in pool.</p>
          ) : (
            <div className="space-y-3">
              {availableTasks.map((task) => (
                <div key={task.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-white">{task.title}</h3>
                    <p className="text-[10px] text-emerald-400 font-mono font-bold">{task.reward}</p>
                  </div>
                  <button
                    onClick={() => handleClaimTask(task.id)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition disabled:opacity-50"
                  >
                    Claim Task
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Claimed & Submitted Tasks Queue */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">My Claimed Queue</h2>
            <span className="px-2.5 py-1 bg-slate-950 text-slate-400 rounded-xl text-[10px] font-mono font-bold">{claimedTasks.length} Total</span>
          </div>

          {claimedTasks.length === 0 ? (
            <p className="text-xs text-slate-500 italic py-6 text-center">You haven't claimed any tasks yet.</p>
          ) : (
            <div className="space-y-3">
              {claimedTasks.map((task) => (
                <div key={task.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-white">{task.title}</h3>
                    <span className={`inline-block text-[10px] font-mono font-bold ${
                      task.status === 'SUBMITTED' ? 'text-amber-400' : task.status === 'APPROVED' ? 'text-emerald-400' : 'text-sky-400'
                    }`}>
                      Status: {task.status}
                    </span>
                  </div>
                  {task.status === 'CLAIMED' && (
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition"
                    >
                      Open Work Area
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
