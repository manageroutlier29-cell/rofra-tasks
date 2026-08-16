'use client';

import { useState, useEffect } from 'react';

type NavigationTab = 'dashboard' | 'users' | 'projects' | 'tasks' | 'assessment';

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  const [users, setUsers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);

  // Toggle Forms
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'WORKER' });

  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', client: '', budget: '', tasksCount: 0 });

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', project: '', worker: '', reward: '' });

  const [showAddAssessment, setShowAddAssessment] = useState(false);
  const [newAssessment, setNewAssessment] = useState({ title: '', category: '', passingScore: 80, totalQuestions: 10 });

  // Load Data from PostgreSQL
  const fetchData = async () => {
    try {
      const [uRes, pRes, tRes, aRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/projects'),
        fetch('/api/admin/tasks'),
        fetch('/api/admin/assessments'),
      ]);
      setUsers(await uRes.json());
      setProjects(await pRes.json());
      setTasks(await tRes.json());
      setAssessments(await aRes.json());
    } catch (e) {
      console.error('Error loading database entities');
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail.trim() === 'Admin@rofra.com' && loginPassword === '39855495WRMu') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator credentials.');
    }
  };

  // Submit Handlers (Post to Database)
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    if (res.ok) {
      setShowAddUser(false);
      setNewUser({ name: '', email: '', password: '', role: 'WORKER' });
      fetchData();
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject),
    });
    if (res.ok) {
      setShowAddProject(false);
      setNewProject({ title: '', client: '', budget: '', tasksCount: 0 });
      fetchData();
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });
    if (res.ok) {
      setShowAddTask(false);
      setNewTask({ title: '', project: '', worker: '', reward: '' });
      fetchData();
    }
  };

  const handleCreateAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAssessment),
    });
    if (res.ok) {
      setShowAddAssessment(false);
      setNewAssessment({ title: '', category: '', passingScore: 80, totalQuestions: 10 });
      fetchData();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-md space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Security Gate</span>
            <h1 className="text-2xl font-black text-white">ROFRA Admin Portal</h1>
          </div>

          {loginError && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold text-center">{loginError}</div>}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Admin Email</label>
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Admin@rofra.com" className="w-full mt-1.5 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500" required />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••••••" className="w-full mt-1.5 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500" required />
            </div>
          </div>

          <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition">Authenticate Admin Session</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-sm">R</div>
            <div>
              <h2 className="text-sm font-black text-white">ROFRA Admin</h2>
              <p className="text-[10px] text-slate-400 font-mono">Admin@rofra.com</p>
            </div>
          </div>
          <nav className="space-y-1">
            {['dashboard', 'users', 'projects', 'tasks', 'assessment'].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab as NavigationTab)} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold capitalize transition ${activeTab === tab ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-white'}`}>
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={() => setIsAuthenticated(false)} className="w-full py-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold">Sign Out</button>
      </aside>

      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex justify-between items-center">
          <h1 className="text-xl font-black text-white capitalize">{activeTab} Management</h1>
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">DB Sync Active</span>
        </div>

        {activeTab === 'users' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black uppercase text-slate-400">Database Users</h2>
              <button onClick={() => setShowAddUser(!showAddUser)} className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">+ Add User</button>
            </div>
            {showAddUser && (
              <form onSubmit={handleCreateUser} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Full Name" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                  <input type="email" placeholder="Email Address" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                  <input type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                  <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
                    <option value="WORKER">WORKER</option>
                    <option value="CLIENT">CLIENT</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Save to Database</button>
              </form>
            )}
            <div className="space-y-2">
              {Array.isArray(users) && users.map((u) => (
                <div key={u.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between text-xs">
                  <div><strong className="text-white">{u.name}</strong> <span className="text-slate-400">({u.email})</span></div>
                  <span className="text-emerald-400 font-mono">{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black uppercase text-slate-400">Database Projects</h2>
              <button onClick={() => setShowAddProject(!showAddProject)} className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">+ Add Project</button>
            </div>
            {showAddProject && (
              <form onSubmit={handleCreateProject} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Title" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                  <input type="text" placeholder="Client" value={newProject.client} onChange={(e) => setNewProject({...newProject, client: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  <input type="text" placeholder="Budget (Amount only)" value={newProject.budget} onChange={(e) => setNewProject({...newProject, budget: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                  <input type="number" placeholder="Tasks Count" value={newProject.tasksCount} onChange={(e) => setNewProject({...newProject, tasksCount: Number(e.target.value)})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                </div>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Save to Database</button>
              </form>
            )}
            <div className="space-y-2">
              {Array.isArray(projects) && projects.map((p) => (
                <div key={p.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between text-xs">
                  <strong className="text-white">{p.title}</strong>
                  <span className="text-emerald-400 font-mono">{p.budget}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black uppercase text-slate-400">Database Tasks</h2>
              <button onClick={() => setShowAddTask(!showAddTask)} className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">+ Add Task</button>
            </div>
            {showAddTask && (
              <form onSubmit={handleCreateTask} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Task Title" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                  <input type="text" placeholder="Reward Amount" value={newTask.reward} onChange={(e) => setNewTask({...newTask, reward: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                </div>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Save to Database</button>
              </form>
            )}
            <div className="space-y-2">
              {Array.isArray(tasks) && tasks.map((t) => (
                <div key={t.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between text-xs">
                  <strong className="text-white">{t.title}</strong>
                  <span className="text-sky-400 font-mono">{t.reward}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assessment' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black uppercase text-slate-400">Database Assessments</h2>
              <button onClick={() => setShowAddAssessment(!showAddAssessment)} className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">+ Add Assessment</button>
            </div>
            {showAddAssessment && (
              <form onSubmit={handleCreateAssessment} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Title" value={newAssessment.title} onChange={(e) => setNewAssessment({...newAssessment, title: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                  <input type="text" placeholder="Category" value={newAssessment.category} onChange={(e) => setNewAssessment({...newAssessment, category: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                  <input type="number" placeholder="Passing Score" value={newAssessment.passingScore} onChange={(e) => setNewAssessment({...newAssessment, passingScore: Number(e.target.value)})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                  <input type="number" placeholder="Total Questions" value={newAssessment.totalQuestions} onChange={(e) => setNewAssessment({...newAssessment, totalQuestions: Number(e.target.value)})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                </div>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Save to Database</button>
              </form>
            )}
            <div className="space-y-2">
              {Array.isArray(assessments) && assessments.map((a) => (
                <div key={a.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex justify-between text-xs">
                  <strong className="text-white">{a.title}</strong>
                  <span className="text-amber-400 font-mono">Pass: {a.passingScore}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
