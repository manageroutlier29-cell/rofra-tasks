'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { getStoredTasks, saveTask, Task } from '@/lib/tasks';

interface Worker {
  id: string;
  name: string;
  email: string;
  balance: number;
  pendingWithdrawal: number;
  phone: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'tasks' | 'payouts' | 'workers'>('tasks');

  // Admin Managed State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([
    { id: '1', name: 'James Kariuki', email: 'james@gmail.com', balance: 450, pendingWithdrawal: 250, phone: '0712345678' },
    { id: '2', name: 'Mary Wanjiku', email: 'mary@gmail.com', balance: 1200, pendingWithdrawal: 500, phone: '0722000111' },
    { id: '3', name: 'Peter Otieno', email: 'peter@gmail.com', balance: 150, pendingWithdrawal: 0, phone: '0799887766' },
  ]);

  // Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskReward, setNewTaskReward] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newTaskLink, setNewTaskLink] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || 'robertwaweru324@gmail.com';
    setCurrentUserEmail(email);
    setTasks(getStoredTasks());
  }, []);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskReward) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      reward: parseFloat(newTaskReward),
      category: newTaskCategory || 'General',
      timeEstimate: '2-5 mins',
      link: newTaskLink || 'https://google.com',
    };

    saveTask(task);
    setTasks(getStoredTasks());
    setNewTaskTitle('');
    setNewTaskReward('');
    setNewTaskCategory('');
    setNewTaskLink('');
    alert('Task added successfully! It is live on worker dashboards.');
  };

  const handleApprovePayout = (workerId: string) => {
    setWorkers(workers.map(w => w.id === workerId ? { ...w, pendingWithdrawal: 0 } : w));
    alert('Payment marked as processed!');
  };

  const handleDeleteWorker = (workerId: string) => {
    if (confirm('Are you sure you want to delete this worker account?')) {
      setWorkers(workers.filter(w => w.id !== workerId));
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-slate-800 p-4 rounded-2xl border border-slate-700">
          <div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
              ADMIN CONTROL PANEL
            </span>
            <h1 className="text-xl font-black mt-2">ROFRA TASKS Management</h1>
            <p className="text-xs text-slate-400">{currentUserEmail}</p>
          </div>
          <button 
            onClick={() => router.push('/dashboard')} 
            className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-xl text-slate-200 font-bold"
          >
            Worker View
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'tasks' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            ➕ Add & View Tasks ({tasks.length})
          </button>
          <button 
            onClick={() => setActiveTab('payouts')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'payouts' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            💳 Payout Requests ({workers.filter(w => w.pendingWithdrawal > 0).length})
          </button>
          <button 
            onClick={() => setActiveTab('workers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'workers' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            👥 Manage Workers ({workers.length})
          </button>
        </div>

        {/* TAB 1: TASKS */}
        {activeTab === 'tasks' && (
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-5">
            <h2 className="text-base font-bold text-emerald-400">Publish New Task</h2>
            <form onSubmit={handleAddTask} className="space-y-3">
              <input 
                type="text" 
                placeholder="Task Title (e.g., Follow Instagram Account)" 
                value={newTaskTitle} 
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                required 
              />
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="number" 
                  placeholder="Reward (KSh)" 
                  value={newTaskReward} 
                  onChange={(e) => setNewTaskReward(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required 
                />
                <input 
                  type="text" 
                  placeholder="Category (e.g., Social Media)" 
                  value={newTaskCategory} 
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
              <input 
                type="url" 
                placeholder="Target URL (e.g., https://instagram.com/account)" 
                value={newTaskLink} 
                onChange={(e) => setNewTaskLink(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs w-full">
                Publish Live Task
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: PAYOUT REQUESTS */}
        {activeTab === 'payouts' && (
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-amber-400">Pending Manual M-Pesa Withdrawals</h2>
            <div className="space-y-3">
              {workers.filter(w => w.pendingWithdrawal > 0).map(worker => (
                <div key={worker.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-slate-900 rounded-xl border border-slate-700/50 gap-3">
                  <div>
                    <div className="font-bold text-sm">{worker.name} ({worker.email})</div>
                    <div className="text-xs text-slate-400">M-Pesa Number: <span className="text-emerald-400 font-mono">{worker.phone}</span></div>
                    <div className="text-xs font-bold text-amber-400">Amount Requested: KSh {worker.pendingWithdrawal}</div>
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

        {/* TAB 3: MANAGE WORKERS */}
        {activeTab === 'workers' && (
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-slate-200">Registered Platform Workers</h2>
            <div className="space-y-3">
              {workers.map(worker => (
                <div key={worker.id} className="flex justify-between items-center p-3 bg-slate-900 rounded-xl border border-slate-700/50">
                  <div>
                    <div className="font-bold text-sm">{worker.name}</div>
                    <div className="text-xs text-slate-400">{worker.email} • {worker.phone}</div>
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
