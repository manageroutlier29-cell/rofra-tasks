'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { getStoredTasks, saveTask, Task } from '@/lib/tasks';

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
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
    alert('Task added successfully! It is now live on the Worker Dashboard.');
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
          </div>
          <button onClick={() => router.push('/dashboard')} className="text-xs bg-slate-700 px-3 py-2 rounded-xl text-slate-200 font-bold">
            Worker View
          </button>
        </div>

        <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 space-y-4">
          <h2 className="text-base font-bold text-emerald-400">Add New Micro-Task</h2>
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
              placeholder="Task Target Link (e.g., https://instagram.com/account)" 
              value={newTaskLink} 
              onChange={(e) => setNewTaskLink(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
            <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs w-full">
              Publish Live Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
