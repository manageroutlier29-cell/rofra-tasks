'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredTasks, saveTask, deleteTask, Task } from '@/lib/tasks';
import { supabase } from '@/lib/supabase';

interface Worker {
  id: string;
  email: string;
  balance: number;
  is_pro: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'tasks' | 'payouts' | 'workers'>('tasks');

  const [tasks, setTasks] = useState<Task[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskReward, setNewTaskReward] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newTaskLink, setNewTaskLink] = useState('');

  useEffect(() => {
    const email = localStorage.getItem('userEmail') || 'robertwaweru324@gmail.com';
    setCurrentUserEmail(email);
    setTasks(getStoredTasks());
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    const { data } = await supabase.from('workers').select('*');
    if (data) setWorkers(data);
  };

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
    alert('Task published successfully!');
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      setTasks(getStoredTasks());
    }
  };

  const handleDeleteWorker = async (workerId: string) => {
    if (confirm('Are you sure you want to delete this worker account?')) {
      await supabase.from('workers').delete().eq('id', workerId);
      fetchWorkers();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
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

        <div className="flex gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'tasks' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            ➕ Tasks ({tasks.length})
          </button>
          <button 
            onClick={() => setActiveTab('workers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeTab === 'workers' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            👥 Registered Workers ({workers.length})
          </button>
        </div>

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
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

            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-3">
              <h2 className="text-base font-bold text-slate-200">Active Tasks</h2>
              <div className="space-y-2">
                {tasks.map(task => (
                  <div key={task.id} className="flex justify-between items-center p-3 bg-slate-900 rounded-xl border border-slate-700/50">
                    <div>
                      <div className="font-bold text-xs">{task.title}</div>
                      <div className="text-[10px] text-slate-400">{task.category} • KSh {task.reward}</div>
                    </div>
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-800 px-3 py-1 rounded-xl text-xs font-bold transition"
                    >
                      Delete Task
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workers' && (
          <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-slate-200">Registered Platform Workers</h2>
            <div className="space-y-3">
              {workers.map(worker => (
                <div key={worker.id} className="flex justify-between items-center p-3 bg-slate-900 rounded-xl border border-slate-700/50">
                  <div>
                    <div className="font-bold text-sm">{worker.email}</div>
                    <div className="text-xs text-slate-400">Balance: KSh {worker.balance} • {worker.is_pro ? '👑 Pro' : 'Standard'}</div>
                  </div>
                  <button 
                    onClick={() => handleDeleteWorker(worker.id)}
                    className="bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-800 px-3 py-1.5 rounded-xl text-xs font-bold transition"
                  >
                    Delete Worker
                  </button>
                </div>
              ))}
              {workers.length === 0 && (
                <p className="text-xs text-slate-500 py-4 text-center">No registered workers found in database.</p>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
