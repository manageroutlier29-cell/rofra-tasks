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

  // Seed Data / State Management
  const [workers, setWorkers] = useState([
    { id: 'usr_1', name: 'David Omondi', email: 'david@example.com', role: 'WORKER', status: 'PENDING_APPROVAL', score: 88, rating: '4.8 ★' },
    { id: 'usr_2', name: 'Faith Wanjiku', email: 'faith@example.com', role: 'WORKER', status: 'APPROVED', score: 95, rating: '4.9 ★' },
    { id: 'usr_3', name: 'Kevin Kiprop', email: 'kevin@example.com', role: 'WORKER', status: 'REJECTED', score: 45, rating: '3.2 ★' },
  ]);

  const [clients, setClients] = useState([
    { id: 'cli_1', name: 'Astra AI Labs', email: 'contact@astra.ai', projectsCount: 3, totalSpent: 'KSh 140,000' },
    { id: 'cli_2', name: 'Nairobi Data Systems', email: 'ops@nds.co.ke', projectsCount: 1, totalSpent: 'KSh 45,000' },
  ]);

  const [projects, setProjects] = useState([
    { id: 'prj_1', title: 'RLHF Swahili Text Annotation', client: 'Astra AI Labs', budget: 'KSh 80,000', tasksCount: 120, status: 'Active' },
    { id: 'prj_2', title: 'Python Code Quality Verification', client: 'Nairobi Data Systems', budget: 'KSh 45,000', tasksCount: 50, status: 'Active' },
  ]);

  const [tasks, setTasks] = useState([
    { id: 'tsk_101', project: 'RLHF Swahili Text Annotation', worker: 'Faith Wanjiku', reward: 'KSh 150', status: 'IN_REVIEW' },
    { id: 'tsk_102', project: 'Python Code Quality Verification', worker: 'David Omondi', reward: 'KSh 200', status: 'COMPLETED' },
  ]);

  const [disputes, setDisputes] = useState([
    { id: 'disp_1', worker: 'David Omondi', project: 'Python Code Quality Verification', reason: 'Task rejected unfairly due to false syntax error flag', status: 'OPEN' },
  ]);

  const [payments, setPayments] = useState([
    { id: 'pay_1', worker: 'Faith Wanjiku', amount: 'KSh 3,400', method: 'M-Pesa (0712***890)', status: 'Pending Approval' },
    { id: 'pay_2', worker: 'Kevin Kiprop', amount: 'KSh 800', method: 'M-Pesa (0798***123)', status: 'Disbursed' },
  ]);

  // Admin Authentication Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail.trim() === 'Admin@rofra.com' && loginPassword === '39855495WRMu') {
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid Administrator credentials.');
    }
  };

  // Actions
  const handleApproveWorker = (id: string) => {
    setWorkers(workers.map(w => w.id === id ? { ...w, status: 'APPROVED' } : w));
  };

  const handleRejectWorker = (id: string) => {
    setWorkers(workers.map(w => w.id === id ? { ...w, status: 'REJECTED' } : w));
  };

  const handleResolveDispute = (id: string) => {
    setDisputes(disputes.map(d => d.id === id ? { ...d, status: 'RESOLVED' } : d));
  };

  const handleApprovePayment = (id: string) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'Disbursed' } : p));
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
              <h2 className="text-sm font-black text-white">ROFRA Task Engine</h2>
              <p className="text-[10px] text-slate-400 font-mono">Admin: Admin@rofra.com</p>
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
                {tab.id === 'users' && workers.filter(w => w.status === 'PENDING_APPROVAL').length > 0 && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded-full font-mono">
                    {workers.filter(w => w.status === 'PENDING_APPROVAL').length}
                  </span>
                )}
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
            <h1 className="text-xl font-black text-white capitalize">{activeTab.replace('_', ' ')} Module</h1>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            System Operational
          </span>
        </div>

        {/* Dynamic Views */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase">Active Workers</span>
                <div className="text-2xl font-black text-white font-mono mt-1">{workers.length}</div>
              </div>
              <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase">Pending Audits</span>
                <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                  {workers.filter(w => w.status === 'PENDING_APPROVAL').length}
                </div>
              </div>
              <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase">Active Projects</span>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1">{projects.length}</div>
              </div>
              <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase">Pending Payments</span>
                <div className="text-2xl font-black text-sky-400 font-mono mt-1">
                  {payments.filter(p => p.status === 'Pending Approval').length}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">Manage Workers & Approvals</h2>
            <div className="space-y-3">
              {workers.map((worker) => (
                <div key={worker.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-white">{worker.name}</h3>
                    <p className="text-[10px] font-mono text-slate-400">{worker.email} • Quiz Score: {worker.score}% • Rating: {worker.rating}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {worker.status === 'PENDING_APPROVAL' ? (
                      <>
                        <button onClick={() => handleRejectWorker(worker.id)} className="px-3 py-1.5 bg-rose-950/60 text-rose-300 rounded-xl text-xs font-bold border border-rose-800/50">Reject</button>
                        <button onClick={() => handleApproveWorker(worker.id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">Approve</button>
                      </>
                    ) : (
                      <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${
                        worker.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {worker.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">Manage Clients</h2>
            <div className="space-y-3">
              {clients.map((client) => (
                <div key={client.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold text-white">{client.name}</h3>
                    <p className="text-[10px] font-mono text-slate-400">{client.email}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 font-mono">{client.totalSpent}</span>
                    <p className="text-[10px] text-slate-400">{client.projectsCount} Active Projects</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">Create & Manage Projects</h2>
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold text-white">{project.title}</h3>
                    <p className="text-[10px] font-mono text-slate-400">Client: {project.client} • Budget: {project.budget}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {project.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">Task Monitor</h2>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold text-white">{task.project}</h3>
                    <p className="text-[10px] font-mono text-slate-400">Assigned: {task.worker} • Reward: {task.reward}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assessment' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">Worker Assessments & Scoring</h2>
            <p className="text-xs text-slate-400">Configure quiz thresholds, evaluation tasks, and automated grading rules.</p>
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">Quality Audits & Dispute Resolution</h2>
            <div className="space-y-3">
              {disputes.map((dispute) => (
                <div key={dispute.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-rose-400">Dispute: {dispute.worker}</h3>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {dispute.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{dispute.reason}</p>
                  {dispute.status === 'OPEN' && (
                    <button onClick={() => handleResolveDispute(dispute.id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">
                      Resolve Dispute & Refund
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">Payment Disbursal Management</h2>
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-xs font-bold text-white">{payment.worker}</h3>
                    <p className="text-[10px] font-mono text-slate-400">{payment.method}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-400 font-mono">{payment.amount}</span>
                    {payment.status === 'Pending Approval' ? (
                      <button onClick={() => handleApprovePayment(payment.id)} className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold">
                        Approve Payout
                      </button>
                    ) : (
                      <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Disbursed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">System Settings</h2>
            <p className="text-xs text-slate-400">Manage credentials, API configurations, and admin access keys.</p>
          </div>
        )}

      </main>
    </div>
  );
}
