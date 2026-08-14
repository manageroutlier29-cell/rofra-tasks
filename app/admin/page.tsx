'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/auth';

interface Worker {
  id: string;
  name: string;
  email: string;
  balance: number;
  pendingWithdrawal: number;
  phone: string;
}

interface Task {
  id: string;
  title: string;
  reward: number;
  category: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('robertwaweru324@gmail.com'); // Mock user email session
  const [activeTab, setActiveTab] = useState<'tasks' | 'payouts' | 'workers'>('payouts');

  // Sample State
  const [workers, setWorkers] = useState<Worker[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', balance: 450, pendingWithdrawal: 250, phone: '0712345678' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', balance: 1200, pendingWithdrawal: 500, phone: '0722000111' },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    { id: '101', title: 'App Rating & Review', reward: 50, category: 'App Testing' },
    { id: '102', title: 'Complete Survey', reward: 30, category: 'Surveys' },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskReward, setNewTaskReward] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');

  // Access Guard
  useEffect(() => {
    if (!isAdmin(currentUserEmail)) {
      router.push('/dashboard');
    }
  }, [currentUserEmail, router]);

  if (!isAdmin(currentUserEmail)) {
    return <div className="p-8 text-center text-red-500 font-bold">Unauthorized Access</div>;
  }

  // Admin Actions
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskReward) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      reward: parseFloat(newTaskReward),
      category: newTaskCategory || 'General',
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskReward('');
    setNewTaskCategory('');
    alert('Task added successfully!');
  };

  const handleApprovePayout = (workerId: string) => {
    setWorkers(workers.map(w => w.id === workerId ? { ...w, pendingWithdrawal: 0 } : w));
    alert('Payout marked as paid!');
  };

  const handleDeleteWorker = (workerId: string) => {
    if (confirm('Are you sure you want to delete this worker for policy violation?')) {
      setWorkers(workers.filter(w => w.id !== workerId));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Admin Header */}
        <div className="flex justify-between items-center bg-slate-800 p-4 rounded-2xl border border-slate-700">
          <div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
              ADMIN CONTROL PANEL
            </span>
            <h1 className="text-xl font-black mt-2">ROFRA TASKS Management</h1>
            <p className="text-xs text-slate-400">Logged in as: {currentUserEmail}</p>
          </div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-xl text-slate-200 font-bold"
          >
            Worker View
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          <button 
            onClick={() => setActiveTab('payouts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold ${activeTab === 'payouts' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            💳 Process Payouts
          </button>
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold ${activeTab === 'tasks' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            ➕ Add Tasks
          </button>
          <button 
            onClick={() => setActiveTab('workers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold ${activeTab === 'workers' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            👥 Manage Workers ({workers.length})
          </button>
        </div>

        {/* TAB 1: PROCESS PAYOUTS */}
        {activeTab === 'payouts' && (
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-amber-400">Pending Manual M-Pesa Payouts</h2>
            <div className="space-y-3">
              {workers.filter(w => w.pendingWithdrawal > 0).map(worker => (
                <div key={worker.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-slate-900 rounded-xl border border-slate-700/50 gap-3">
                  <div>
                    <div className="font-bold text-sm">{worker.name} ({worker.email})</div>
                    <div className="text-xs text-slate-400">M-Pesa: <span className="text-emerald-400 font-mono">{worker.phone}</span></div>
                    <div className="text-xs font-bold text-amber-400">Amount: KSh {worker.pendingWithdrawal}</div>
                  </div>
                  <button 
                    onClick={() => handleApprovePayout(worker.id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow"
                  >
                    Mark as Paid (M-Pesa Sent)
                  </button>
                </div>
              ))}
              {workers.filter(w => w.pendingWithdrawal > 0).length === 0 && (
                <p className="text-xs text-slate-500 py-4 text-center">No pending withdrawal requests.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ADD TASK */}
        {activeTab === 'tasks' && (
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-emerald-400">Create New Micro-Task</h2>
            <form onSubmit={handleAddTask} className="space-y-3 max-w-md">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Task Title</label>
                <input 
                  type="text" 
                  value={newTaskTitle} 
                  onChange={(e) => setNewTaskTitle(e.target.value)} 
                  placeholder="e.g. Subscribe to YouTube Channel"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Reward (KSh)</label>
                  <input 
                    type="number" 
                    value={newTaskReward} 
                    onChange={(e) => setNewTaskReward(e.target.value)} 
                    placeholder="50"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Category</label>
                  <input 
                    type="text" 
                    value={newTaskCategory} 
                    onChange={(e) => setNewTaskCategory(e.target.value)} 
                    placeholder="Social Media"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs w-full">
                Publish Task
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: MANAGE WORKERS */}
        {activeTab === 'workers' && (
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-slate-200">Registered Workers</h2>
            <div className="space-y-3">
              {workers.map(worker => (
                <div key={worker.id} className="flex justify-between items-center p-3 bg-slate-900 rounded-xl border border-slate-700/50">
                  <div>
                    <div className="font-bold text-sm">{worker.name}</div>
                    <div className="text-xs text-slate-400">{worker.email} | {worker.phone}</div>
                    <div className="text-xs text-slate-300 mt-0.5">Balance: KSh {worker.balance}</div>
                  </div>
                  <button 
                    onClick={() => handleDeleteWorker(worker.id)}
                    className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-800 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                  >
                    Delete Worker
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
