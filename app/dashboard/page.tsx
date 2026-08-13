'use client';

import { useState, useEffect } from 'react';

type Task = {
  id: number;
  title: string;
  category: string;
  reward: number;
  timeEstimate: string;
  type: 'video' | 'survey' | 'review';
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'home' | 'tasks' | 'payments' | 'profile' | 'settings'>('home');
  const [balance, setBalance] = useState(150.0);
  const [isPremium, setIsPremium] = useState(false);
  
  // Active execution modal state
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [taskTimer, setTaskTimer] = useState(0);
  const [surveyAnswer, setSurveyAnswer] = useState('');
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Withdrawal Form State
  const [withdrawMethod, setWithdrawMethod] = useState<'MPESA' | 'BANK' | 'CRYPTO'>('MPESA');
  const [destination, setDestination] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [payoutMsg, setPayoutMsg] = useState('');

  const taskList: Task[] = [
    { id: 1, title: 'Watch 15s Sponsored Tech Ad', category: 'Video', reward: 25, timeEstimate: '15s', type: 'video' },
    { id: 2, title: 'Evaluate Mobile Money Survey', category: 'Survey', reward: 40, timeEstimate: '1 min', type: 'survey' },
    { id: 3, title: 'Review E-Commerce App on Store', category: 'App Test', reward: 120, timeEstimate: '2 mins', type: 'review' },
    { id: 4, title: '⭐ Premium: Beta Software Testing', category: 'Software', reward: 350, timeEstimate: '5 mins', type: 'review' },
  ];

  // Handle task timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeTask && activeTask.type === 'video' && taskTimer > 0) {
      timer = setInterval(() => {
        setTaskTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTask, taskTimer]);

  const startTaskExecution = (task: Task) => {
    setActiveTask(task);
    setSurveyAnswer('');
    if (task.type === 'video') {
      setTaskTimer(15);
    }
  };

  const handleCompleteTask = () => {
    if (!activeTask) return;
    setIsSubmittingTask(true);

    setTimeout(() => {
      setBalance((prev) => prev + activeTask.reward);
      setIsSubmittingTask(false);
      alert(`🎉 Task Completed Successfully! KES ${activeTask.reward} added to your balance.`);
      setActiveTask(null);
    }, 1200);
  };

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    if (amt > balance) {
      alert('Insufficient available balance.');
      return;
    }

    setPayoutMsg('Processing withdrawal request...');
    setTimeout(() => {
      setBalance((prev) => prev - amt);
      setPayoutMsg(`✅ Withdrawal of KES ${amt} sent via ${withdrawMethod} to ${destination}`);
      setWithdrawAmount('');
      setDestination('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f6f8f6] text-slate-900 font-sans flex flex-col md:flex-row">
      
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/80 flex md:flex-col justify-between p-4 flex-shrink-0 shadow-sm">
        <div>
          {/* Logo Brand */}
          <div className="flex items-center gap-2 px-2 py-3 mb-6 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white font-black flex items-center justify-center text-lg shadow-sm">
              R
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 text-base leading-none">ROFRA TASKS</h1>
              <span className="text-[10px] text-emerald-700 font-semibold tracking-wider uppercase">Workspace</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:space-y-1 md:block">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'home' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>🏠</span> Home
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'tasks' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>📝</span> Tasks
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'payments' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>💳</span> Payments
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'profile' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>👤</span> Profile
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'settings' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>⚙️</span> Settings
            </button>
          </nav>
        </div>

        {/* User Mini Profile Card */}
        <div className="hidden md:flex items-center gap-3 p-2 bg-slate-50 border border-slate-200/60 rounded-2xl">
          <div className="w-9 h-9 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xs">
            AW
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-xs font-bold text-slate-800 truncate">Amina Wanjiku</h4>
            <p className="text-[10px] text-slate-500 truncate">amina@example.com</p>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 flex justify-around p-2 text-center text-[10px]">
        <button onClick={() => setActiveTab('home')} className={`p-1.5 font-bold ${activeTab === 'home' ? 'text-emerald-700' : 'text-slate-500'}`}>
          <div>🏠</div> Home
        </button>
        <button onClick={() => setActiveTab('tasks')} className={`p-1.5 font-bold ${activeTab === 'tasks' ? 'text-emerald-700' : 'text-slate-500'}`}>
          <div>📝</div> Tasks
        </button>
        <button onClick={() => setActiveTab('payments')} className={`p-1.5 font-bold ${activeTab === 'payments' ? 'text-emerald-700' : 'text-slate-500'}`}>
          <div>💳</div> Payments
        </button>
        <button onClick={() => setActiveTab('profile')} className={`p-1.5 font-bold ${activeTab === 'profile' ? 'text-emerald-700' : 'text-slate-500'}`}>
          <div>👤</div> Profile
        </button>
        <button onClick={() => setActiveTab('settings')} className={`p-1.5 font-bold ${activeTab === 'settings' ? 'text-emerald-700' : 'text-slate-500'}`}>
          <div>⚙️</div> Settings
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 md:p-8 mb-16 md:mb-0 max-w-4xl mx-auto w-full">
        
        {/* HEADER BAR */}
        <header className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight capitalize">{activeTab} Workspace</h2>
            <p className="text-xs text-slate-500">Welcome back, Amina</p>
          </div>

          {/* Profile Icon Trigger */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 p-1.5 pr-3 rounded-full hover:bg-emerald-100/60 transition"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-xs">
              AW
            </div>
            <span className="text-xs font-bold text-emerald-900 hidden sm:inline">Profile</span>
          </button>
        </header>

        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-3xl shadow-lg">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Available Balance</span>
                <h3 className="text-3xl font-black mt-1 text-emerald-400">KES {balance.toFixed(2)}</h3>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setActiveTab('payments')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                  >
                    Withdraw Funds ↗
                  </button>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition"
                  >
                    Earn More
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs text-amber-700 font-bold uppercase tracking-wider">Membership Status</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    {isPremium ? '⭐ PREMIUM ACCOUNT' : 'FREE WORKER'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isPremium ? 'You have unlocked highest paying tasks up to KES 500/task.' : 'Upgrade to access exclusive micro-gigs.'}
                  </p>
                </div>
                {!isPremium && (
                  <button
                    onClick={() => { setIsPremium(true); alert('Congratulations! Account upgraded to Premium.'); }}
                    className="mt-4 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition"
                  >
                    Upgrade to Premium (KES 200)
                  </button>
                )}
              </div>
            </div>

            {/* Quick Task Summary */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Recommended Tasks</h3>
                <button onClick={() => setActiveTab('tasks')} className="text-xs font-bold text-emerald-700 hover:underline">
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                {taskList.slice(0, 2).map((t) => (
                  <div key={t.id} className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <h4 className="font-bold text-xs text-slate-800">{t.title}</h4>
                      <p className="text-[10px] text-slate-500">{t.timeEstimate} • + KES {t.reward}</p>
                    </div>
                    <button
                      onClick={() => { setActiveTab('tasks'); startTaskExecution(t); }}
                      className="bg-[#244c3f] text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-[#1a382e]"
                    >
                      Start Task
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TASKS */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              <h3 className="font-bold text-slate-900 text-sm mb-1">Available Tasks</h3>
              <p className="text-xs text-slate-500">Select a task below, complete the instructions, and claim your earnings.</p>
            </div>

            <div className="space-y-3">
              {taskList.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                      {task.category}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{task.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Estimated time: {task.timeEstimate}</p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <span className="text-sm font-extrabold text-emerald-700">+ KES {task.reward}</span>
                    <button
                      onClick={() => startTaskExecution(task)}
                      className="bg-[#244c3f] hover:bg-[#1a382e] text-white text-xs font-bold px-4 py-2 rounded-xl transition"
                    >
                      Start Task ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PAYMENTS (Hidden Withdrawal Area) */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Instant Withdrawal</h3>
                  <p className="text-xs text-slate-500">Withdraw your balance directly to M-Pesa, Bank, or Crypto</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-right">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase">Balance</span>
                  <p className="text-sm font-black text-emerald-800">KES {balance.toFixed(2)}</p>
                </div>
              </div>

              {payoutMsg && (
                <div className="p-3 mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
                  {payoutMsg}
                </div>
              )}

              <form onSubmit={handleWithdrawal} className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {(['MPESA', 'BANK', 'CRYPTO'] as const).map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setWithdrawMethod(method)}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition ${
                        withdrawMethod === method
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {withdrawMethod === 'MPESA' ? 'M-Pesa Phone Number' : withdrawMethod === 'BANK' ? 'Account Number' : 'Wallet Address'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={withdrawMethod === 'MPESA' ? 'e.g. 254712345678' : 'Enter account details'}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-[#f8faf8] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (KES)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 150"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-[#f8faf8] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow-md"
                >
                  Withdraw Instantly ⚡
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
              <div className="w-16 h-16 rounded-full bg-emerald-800 text-white font-extrabold flex items-center justify-center text-xl shadow">
                AW
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Amina Wanjiku</h3>
                <p className="text-xs text-slate-500">Verified Worker • Nairobi, Kenya</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Email Address</span>
                <span className="font-bold text-slate-800">amina@example.com</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">M-Pesa Number</span>
                <span className="font-bold text-slate-800">+254 712 345 678</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Account Type</span>
                <span className="font-bold text-emerald-700">{isPremium ? 'Premium User' : 'Free Worker'}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Account Settings</h3>
            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                <span>SMS Earnings Notifications</span>
                <input type="checkbox" defaultChecked className="rounded accent-emerald-700" />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                <span>Two-Factor Authentication</span>
                <input type="checkbox" className="rounded accent-emerald-700" />
              </label>
            </div>
          </div>
        )}

      </main>

      {/* INTERACTIVE TASK EXECUTION MODAL */}
      {activeTask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  {activeTask.category}
                </span>
                <h3 className="font-black text-slate-900 text-base mt-1">{activeTask.title}</h3>
              </div>
              <button
                onClick={() => setActiveTask(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Task Simulation Content */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs space-y-3">
              {activeTask.type === 'video' && (
                <div className="text-center py-6 space-y-2">
                  <div className="text-3xl">🎥</div>
                  <p className="font-bold text-slate-800">Watching Sponsor Video...</p>
                  <p className="text-slate-500 text-[11px]">Keep this window open until timer finishes.</p>
                  <div className="text-2xl font-black text-emerald-700 mt-2">{taskTimer}s</div>
                </div>
              )}

              {activeTask.type === 'survey' && (
                <div className="space-y-3">
                  <p className="font-semibold text-slate-800">Question: How often do you use Mobile Money services in Kenya?</p>
                  {['Daily', 'Weekly', 'Rarely'].map((opt) => (
                    <label key={opt} className="flex items-center gap-2 p-2 bg-white rounded-xl border text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="survey"
                        value={opt}
                        onChange={(e) => setSurveyAnswer(e.target.value)}
                        className="accent-emerald-700"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {activeTask.type === 'review' && (
                <div className="space-y-2">
                  <p className="font-semibold text-slate-800">Instructions:</p>
                  <p className="text-slate-600">1. Download and open the partner app.</p>
                  <p className="text-slate-600">2. Leave a 5-star rating on Play Store.</p>
                  <p className="text-slate-600">3. Tap complete below to submit your proof.</p>
                </div>
              )}
            </div>

            {/* Task Action Buttons */}
            <button
              disabled={
                (activeTask.type === 'video' && taskTimer > 0) ||
                (activeTask.type === 'survey' && !surveyAnswer) ||
                isSubmittingTask
              }
              onClick={handleCompleteTask}
              className={`w-full py-3 px-4 rounded-2xl text-xs font-bold transition shadow ${
                (activeTask.type === 'video' && taskTimer > 0) || (activeTask.type === 'survey' && !surveyAnswer)
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              {isSubmittingTask ? 'Verifying Submission...' : `Submit & Claim KES ${activeTask.reward}`}
            </button>
          </div>
        </div>
      )}

      {/* PROFILE DETAILS MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">Profile Details</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 text-sm font-bold">✕</button>
            </div>
            <div className="text-center py-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-800 text-white font-black flex items-center justify-center text-xl mb-2">
                AW
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Amina Wanjiku</h4>
              <p className="text-xs text-slate-500">amina@example.com</p>
            </div>
            <button
              onClick={() => { setShowProfileModal(false); setActiveTab('profile'); }}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 rounded-xl transition"
            >
              Manage Account
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
