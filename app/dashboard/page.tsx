'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type Task = {
  id: number;
  title: string;
  category: string;
  reward: number;
  time_estimate: string;
  type: 'video' | 'survey' | 'review';
};

const ADMIN_EMAILS = ['robertwaweru324@gmail.com']; 

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'home' | 'tasks' | 'payments' | 'profile' | 'admin'>('home');
  const [balance, setBalance] = useState(150.0);
  
  const [userProfile, setUserProfile] = useState({
    name: 'Loading...',
    email: '',
    provider: '',
    isAdmin: false
  });

  const [taskList, setTaskList] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);

  // Admin New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Video');
  const [newTaskReward, setNewTaskReward] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('30s');
  const [newTaskType, setNewTaskType] = useState<'video' | 'survey' | 'review'>('video');

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [taskTimer, setTaskTimer] = useState(0);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);

  // Load User Info and Set Up Realtime Task Subscriptions
  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    const savedEmail = localStorage.getItem('userEmail') || '';
    const savedProvider = localStorage.getItem('authProvider');

    const userIsAdmin = ADMIN_EMAILS.includes(savedEmail.toLowerCase().trim());

    if (savedEmail || savedProvider) {
      setUserProfile({
        name: savedName || 'Guest User',
        email: savedEmail,
        provider: savedProvider || 'Email',
        isAdmin: userIsAdmin
      });
    }

    // 1. Initial Fetch of Tasks from Supabase
    fetchInitialTasks();

    // 2. Realtime Listener across all connected devices!
    const channel = supabase
      .channel('tasks-realtime-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => {
          // Re-fetch tasks instantly whenever any change (insert/delete) happens
          fetchInitialTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchInitialTasks = async () => {
    setIsLoadingTasks(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching tasks from Supabase:', error.message);
    } else if (data) {
      setTaskList(data as Task[]);
    }
    setIsLoadingTasks(false);
  };

  // REALTIME ACTION 1: Inject Task into Cloud Database
  const handleInjectTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskReward) return alert('Please fill out details.');

    const { error } = await supabase.from('tasks').insert([
      {
        title: newTaskTitle,
        category: newTaskCategory,
        reward: parseFloat(newTaskReward),
        time_estimate: newTaskTime,
        type: newTaskType,
      },
    ]);

    if (error) {
      alert('Error injecting task: ' + error.message);
    } else {
      setNewTaskTitle('');
      setNewTaskReward('');
      alert('⚡ Task injected live to all connected devices!');
    }
  };

  // REALTIME ACTION 2: Remove Task from Cloud Database
  const handleRemoveTask = async (taskId: number) => {
    if (confirm('Are you sure you want to remove this task?')) {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (error) {
        alert('Failed to delete task: ' + error.message);
      }
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeTask && activeTask.type === 'video' && taskTimer > 0) {
      timer = setInterval(() => setTaskTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [activeTask, taskTimer]);

  const startTaskExecution = (task: Task) => {
    setActiveTask(task);
    if (task.type === 'video') setTaskTimer(15);
  };

  const handleCompleteTask = async () => {
    if (!activeTask) return;
    setIsSubmittingTask(true);

    // Remove completed task for user
    await supabase.from('tasks').delete().eq('id', activeTask.id);

    setTimeout(() => {
      setBalance((prev) => prev + activeTask.reward);
      setIsSubmittingTask(false);
      alert(`🎉 KES ${activeTask.reward} added to your balance.`);
      setActiveTask(null);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6] text-slate-900 font-sans flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex md:flex-col justify-between p-4 flex-shrink-0 shadow-sm">
        <div>
          <div className="flex items-center gap-2 px-2 py-3 mb-6 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white font-black flex items-center justify-center text-lg shadow-sm">R</div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-base leading-none">ROFRA TASKS</h1>
              <span className="text-[10px] text-emerald-700 font-semibold tracking-wider uppercase">Workspace</span>
            </div>
          </div>

          <nav className="hidden md:space-y-1 md:block">
            <button onClick={() => setActiveTab('home')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'home' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'text-slate-600 hover:bg-slate-50'}`}><span>🏠</span> Home</button>
            <button onClick={() => setActiveTab('tasks')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'tasks' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'text-slate-600 hover:bg-slate-50'}`}><span>📝</span> Tasks ({taskList.length})</button>
            <button onClick={() => setActiveTab('payments')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'payments' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'text-slate-600 hover:bg-slate-50'}`}><span>💳</span> Payments</button>
            
            {userProfile.isAdmin && (
              <button onClick={() => setActiveTab('admin')} className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${activeTab === 'admin' ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'text-amber-800 hover:bg-amber-50'}`}>
                <span>⚡</span> Admin Control
              </button>
            )}
          </nav>
        </div>
      </aside>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 flex justify-around p-2 text-center text-[10px]">
        <button onClick={() => setActiveTab('home')} className={`p-1.5 font-bold ${activeTab === 'home' ? 'text-emerald-700' : 'text-slate-500'}`}><div>🏠</div> Home</button>
        <button onClick={() => setActiveTab('tasks')} className={`p-1.5 font-bold ${activeTab === 'tasks' ? 'text-emerald-700' : 'text-slate-500'}`}><div>📝</div> Tasks</button>
        <button onClick={() => setActiveTab('payments')} className={`p-1.5 font-bold ${activeTab === 'payments' ? 'text-emerald-700' : 'text-slate-500'}`}><div>💳</div> Payments</button>
        
        {userProfile.isAdmin && (
          <button onClick={() => setActiveTab('admin')} className={`p-1.5 font-bold ${activeTab === 'admin' ? 'text-amber-700' : 'text-slate-500'}`}><div>⚡</div> Admin</button>
        )}
      </div>

      <main className="flex-1 p-4 md:p-8 mb-16 md:mb-0 max-w-4xl mx-auto w-full">
        <header className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight capitalize">{activeTab} Workspace</h2>
            <p className="text-xs text-slate-500">Logged in as {userProfile.name}</p>
          </div>
        </header>

        {activeTab === 'home' && ( <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl shadow-lg"><span className="text-xs text-slate-400 font-semibold uppercase">Balance</span><h3 className="text-3xl font-black mt-1 text-emerald-400">KES {balance.toFixed(2)}</h3></div> )}

        {activeTab === 'tasks' && (
          <div className="space-y-4">
            {isLoadingTasks ? (
              <p className="text-xs text-slate-500 p-4">Loading real-time tasks...</p>
            ) : taskList.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border text-center text-xs text-slate-400">No active tasks right now.</div>
            ) : (
              taskList.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 rounded-md">{task.category}</span>
                    <h4 className="font-bold text-sm mt-1">{task.title}</h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-extrabold text-emerald-700">+ KES {task.reward}</span>
                    <button onClick={() => startTaskExecution(task)} className="bg-[#244c3f] text-white text-xs font-bold px-4 py-2 rounded-xl">Start ↗</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ADMIN PANEL FOR ROBERT WAWERU */}
        {activeTab === 'admin' && userProfile.isAdmin && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm">
              <h3 className="font-black mb-4 text-slate-900">⚡ Inject Real-Time Task</h3>
              <form onSubmit={handleInjectTask} className="space-y-3 text-xs">
                <input type="text" placeholder="Task Title" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl" required />
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Reward (KES)" value={newTaskReward} onChange={(e) => setNewTaskReward(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl" required />
                  <input type="text" placeholder="Category" value={newTaskCategory} onChange={(e) => setNewTaskCategory(e.target.value)} className="w-full bg-slate-50 border p-2.5 rounded-xl" required />
                </div>
                <button type="submit" className="w-full bg-amber-600 text-white font-bold py-3 rounded-xl mt-2">Inject Task Now ⚡</button>
              </form>
            </div>
            <div className="bg-white p-6 rounded-3xl border shadow-sm">
              <h3 className="font-bold text-sm mb-4">Manage Live Tasks</h3>
              {taskList.map((t) => (
                <div key={t.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border mb-2">
                  <h4 className="font-bold text-xs">{t.title}</h4>
                  <button onClick={() => handleRemoveTask(t.id)} className="text-red-600 font-bold text-xs">Remove 🗑️</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
