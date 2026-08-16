'use client';

import { useState } from 'react';

type NavigationTab = 
  | 'dashboard' 
  | 'users' 
  | 'clients' 
  | 'projects' 
  | 'tasks' 
  | 'assessment' 
  | 'quality' 
  | 'payments' 
  | 'settings';

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // Core Data States
  const [workers, setWorkers] = useState([
    { id: 'usr_1', name: 'David Omondi', email: 'david@example.com', role: 'WORKER', status: 'PENDING_APPROVAL', score: 88, rating: '4.8 ★' },
    { id: 'usr_2', name: 'Faith Wanjiku', email: 'faith@example.com', role: 'WORKER', status: 'APPROVED', score: 95, rating: '4.9 ★' },
  ]);

  const [clients, setClients] = useState([
    { id: 'cli_1', name: 'Astra AI Labs', email: 'contact@astra.ai', projectsCount: 3, totalSpent: 'KSh 140,000' },
  ]);

  const [projects, setProjects] = useState([
    { id: 'prj_1', title: 'RLHF Swahili Text Annotation', client: 'Astra AI Labs', budget: 'KSh 80,000', tasksCount: 120, status: 'Active' },
  ]);

  const [tasks, setTasks] = useState([
    { id: 'tsk_101', project: 'RLHF Swahili Text Annotation', title: 'Swahili Sentiment Verification', worker: 'Faith Wanjiku', reward: 'KSh 150', status: 'IN_REVIEW' },
  ]);

  const [assessments, setAssessments] = useState([
    { id: 'asm_1', title: 'Swahili Grammar & Tone Assessment', category: 'Linguistics', passingScore: 80, totalQuestions: 10 },
  ]);

  const [disputes, setDisputes] = useState([
    { id: 'disp_1', worker: 'David Omondi', project: 'Python Code Quality Verification', reason: 'Task rejected unfairly due to false syntax error flag', status: 'OPEN' },
  ]);

  const [payments, setPayments] = useState([
    { id: 'pay_1', worker: 'Faith Wanjiku', amount: 'KSh 3,400', method: 'M-Pesa (0712***890)', status: 'Pending Approval' },
  ]);

  // Modals & Form States
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'WORKER' });

  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', client: '', budget: '', tasksCount: 0 });

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', project: '', worker: '', reward: '' });

  const [showAddAssessment, setShowAddAssessment] = useState(false);
  const [newAssessment, setNewAssessment] = useState({ title: '', category: '', passingScore: 80, totalQuestions: 10 });

  // Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail.trim() === 'Admin@rofra.com' && loginPassword === '39855495WRMu') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator credentials.');
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `usr_${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'APPROVED',
      score: 100,
      rating: '5.0 ★',
    };
    setWorkers([...workers, created]);
    setShowAddUser(false);
    setNewUser({ name: '', email: '', password: '', role: 'WORKER' });
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `prj_${Date.now()}`,
      title: newProject.title,
      client: newProject.client || 'Internal Project',
      budget: `KSh ${newProject.budget}`,
      tasksCount: Number(newProject.tasksCount),
      status: 'Active',
    };
    setProjects([...projects, created]);
    setShowAddProject(false);
    setNewProject({ title: '', client: '', budget: '', tasksCount: 0 });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `tsk_${Date.now()}`,
      title: newTask.title,
      project: newTask.project || 'General Tasks',
      worker: newTask.worker || 'Unassigned',
      reward: `KSh ${newTask.reward}`,
      status: 'AVAILABLE',
    };
    setTasks([...tasks, created]);
    setShowAddTask(false);
    setNewTask({ title: '', project: '', worker: '', reward: '' });
  };

  const handleCreateAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `asm_${Date.now()}`,
      title: newAssessment.title,
      category: newAssessment.category,
      passingScore: Number(newAssessment.passingScore),
      totalQuestions: Number(newAssessment.totalQuestions),
    };
    setAssessments([...assessments, created]);
    setShowAddAssessment(false);
    setNewAssessment({ title: '', category: '', passingScore: 80, totalQuestions: 10 });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-md space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Security Gate</span>
            <h1 className="text-2xl font-black text-white">ROFRA Admin Portal</h1>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold text-center">
              {loginError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Admin Email</label>
              <input 
                type="email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Admin@rofra.com"
                className="w-full mt-1.5 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
              <input 
                type="password" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full mt-1.5 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition"
          >
            Authenticate Admin Session
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between space-y-6">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-sm">
              R
            </div>
            <div>
              <h2 className="text-sm font-black text-white">ROFRA Control</h2>
              <p className="text-[10px] text-slate-400 font-mono">Admin@rofra.com</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'users', label: 'Users & Workers' },
              { id: 'clients', label: 'Clients' },
              { id: 'projects', label: 'Projects' },
              { id: 'tasks', label: 'Tasks' },
              { id: 'assessment', label: 'Assessments' },
              { id: 'quality', label: 'Quality & Disputes' },
              { id: 'payments', label: 'Payments' },
              { id: 'settings', label: 'Settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as NavigationTab)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                  activeTab === tab.id
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <button 
          onClick={() => setIsAuthenticated(false)}
          className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold transition"
        >
          Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
        
        {/* Header Bar */}
        <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex justify-between items-center flex-wrap gap-4">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">System Administration</span>
            <h1 className="text-xl font-black text-white capitalize">{activeTab} Module</h1>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            System Active
          </span>
        </div>

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Users</span>
              <div className="text-2xl font-black text-white font-mono mt-1">{workers.length}</div>
            </div>
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase">Active Projects</span>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{projects.length}</div>
            </div>
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase">Total Tasks</span>
              <div className="text-2xl font-black text-sky-400 font-mono mt-1">{tasks.length}</div>
            </div>
            <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase">Assessments</span>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">{assessments.length}</div>
            </div>
          </div>
        )}

        {/* Users View */}
        {activeTab === 'users' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">User Directory</h2>
              <button 
                onClick={() => setShowAddUser(!showAddUser)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
              >
                + Add New User
              </button>
            </div>

            {showAddUser && (
              <form onSubmit={handleCreateUser} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-emerald-400">Create New User Account</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Full Name" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                  <input type="email" placeholder="Email Address" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                  <input type="password" placeholder="Account Password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                  <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white">
                    <option value="WORKER">Worker</option>
                    <option value="CLIENT">Client</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Save User</button>
              </form>
            )}

            <div className="space-y-3">
              {workers.map((usr) => (
                <div key={usr.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold text-white">{usr.name} <span className="text-[10px] text-emerald-400 font-mono">({usr.role})</span></h3>
                    <p className="text-[10px] font-mono text-slate-400">{usr.email}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{usr.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects View */}
        {activeTab === 'projects' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">Projects List</h2>
              <button 
                onClick={() => setShowAddProject(!showAddProject)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
              >
                + Add New Project
              </button>
            </div>

            {showAddProject && (
              <form onSubmit={handleCreateProject} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-emerald-400">Create Project</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Project Title" value={newProject.title} onChange={(e) => setNewProject({...newProject, title: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                  <input type="text" placeholder="Client Name" value={newProject.client} onChange={(e) => setNewProject({...newProject, client: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  <input type="text" placeholder="Budget Amount (KSh)" value={newProject.budget} onChange={(e) => setNewProject({...newProject, budget: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                  <input type="number" placeholder="Total Tasks Count" value={newProject.tasksCount} onChange={(e) => setNewProject({...newProject, tasksCount: Number(e.target.value)})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                </div>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Save Project</button>
              </form>
            )}

            <div className="space-y-3">
              {projects.map((prj) => (
                <div key={prj.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold text-white">{prj.title}</h3>
                    <p className="text-[10px] font-mono text-slate-400">Client: {prj.client} • Budget: {prj.budget}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{prj.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks View */}
        {activeTab === 'tasks' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">Tasks Management</h2>
              <button 
                onClick={() => setShowAddTask(!showAddTask)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
              >
                + Add New Task
              </button>
            </div>

            {showAddTask && (
              <form onSubmit={handleCreateTask} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-emerald-400">Create Task</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Task Title" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                  <input type="text" placeholder="Project Title" value={newTask.project} onChange={(e) => setNewTask({...newTask, project: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  <input type="text" placeholder="Assigned Worker Email" value={newTask.worker} onChange={(e) => setNewTask({...newTask, worker: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" />
                  <input type="text" placeholder="Reward (KSh)" value={newTask.reward} onChange={(e) => setNewTask({...newTask, reward: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                </div>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Save Task</button>
              </form>
            )}

            <div className="space-y-3">
              {tasks.map((tsk) => (
                <div key={tsk.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold text-white">{tsk.title}</h3>
                    <p className="text-[10px] font-mono text-slate-400">Project: {tsk.project} • Reward: {tsk.reward}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">{tsk.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assessment View */}
        {activeTab === 'assessment' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">Assessments & Exams</h2>
              <button 
                onClick={() => setShowAddAssessment(!showAddAssessment)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
              >
                + Add New Assessment
              </button>
            </div>

            {showAddAssessment && (
              <form onSubmit={handleCreateAssessment} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-emerald-400">Create Skill Assessment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Assessment Title" value={newAssessment.title} onChange={(e) => setNewAssessment({...newAssessment, title: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                  <input type="text" placeholder="Category (e.g. STEM, Swahili)" value={newAssessment.category} onChange={(e) => setNewAssessment({...newAssessment, category: e.target.value})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                  <input type="number" placeholder="Passing Score (%)" value={newAssessment.passingScore} onChange={(e) => setNewAssessment({...newAssessment, passingScore: Number(e.target.value)})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                  <input type="number" placeholder="Total Questions" value={newAssessment.totalQuestions} onChange={(e) => setNewAssessment({...newAssessment, totalQuestions: Number(e.target.value)})} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white" required />
                </div>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Save Assessment</button>
              </form>
            )}

            <div className="space-y-3">
              {assessments.map((asm) => (
                <div key={asm.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold text-white">{asm.title}</h3>
                    <p className="text-[10px] font-mono text-slate-400">Category: {asm.category} • Passing Grade: {asm.passingScore}%</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">{asm.totalQuestions} Questions</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
