'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type Task = {
  id: number;
  title: string;
  category: string;
  reward: number;
  time_estimate: string;
  type: string;
};

const DEFAULT_TASKS = [
  { id: 101, title: 'Data Categorization', category: 'Organize data into structured groups', reward: 2.50, isFree: true },
  { id: 102, title: 'Pattern Recognition', category: 'Identify data patterns in datasets', reward: 3.00, isFree: false },
  { id: 103, title: 'Sentence Arrangement', category: 'Arrange text in logical order', reward: 2.00, isFree: false },
  { id: 104, title: 'Refer & Earn', category: 'Invite friends for bonus rewards', reward: 2.70, isFree: false },
  { id: 105, title: 'Image Labeling', category: 'Label images for ML training', reward: 2.70, isFree: false },
  { id: 106, title: 'Sentiment Analysis', category: 'Classify text sentiment', reward: 2.80, isFree: false },
  { id: 107, title: 'Code Review', category: 'Evaluate code quality', reward: 3.00, isFree: false },
  { id: 108, title: 'Translation Task', category: 'Translate content accurately', reward: 3.40, isFree: false },
  { id: 109, title: 'Audio Transcription', category: 'Transcribe audio to text', reward: 3.10, isFree: false },
  { id: 110, title: 'Fact Checking', category: 'Verify claims and statements', reward: 3.50, isFree: false },
  { id: 111, title: 'Content Moderation', category: 'Review content for guidelines', reward: 2.20, isFree: false },
  { id: 112, title: 'Data Entry', category: 'Input structured data accurately', reward: 2.00, isFree: false },
];

export default function Dashboard() {
  const [userName, setUserName] = useState('robert');
  const [balance, setBalance] = useState(10.00);
  const [isPro, setIsPro] = useState(false);

  // Modals state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<'methods' | 'details' | 'pro_required'>('methods');
  const [withdrawMethod, setWithdrawMethod] = useState<'mpesa' | 'paypal' | 'bank' | 'crypto'>('mpesa');
  
  // Withdrawal Form Inputs
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('userName');
    if (savedName) setUserName(savedName.toLowerCase());
  }, []);

  const openWithdrawModal = () => {
    setWithdrawStep('methods');
    setShowWithdrawModal(true);
  };

  const handleSelectMethod = (method: 'mpesa' | 'paypal' | 'bank' | 'crypto') => {
    setWithdrawMethod(method);
    setWithdrawStep('details');
  };

  const handleProcessWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    // Intercept with Pro Required modal like in screenshot 4
    setWithdrawStep('pro_required');
  };

  return (
    <div className="min-h-screen bg-[#f1f1eb] text-slate-800 font-sans pb-24">
      
      {/* Top Header Navigation */}
      <header className="bg-[#f1f1eb] px-4 py-3 flex justify-between items-center max-w-md mx-auto sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#2a7a4c] text-white font-black flex items-center justify-center text-xs">
            R
          </div>
          <span className="font-extrabold text-xs tracking-wider text-slate-900 uppercase">REMOTASK</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-xs shadow-sm">🔔</button>
          <div className="w-7 h-7 rounded-full bg-[#a3c99a] text-[#1c4d2e] font-bold text-xs flex items-center justify-center">
            {userName.charAt(0).toUpperCase()}
          </div>
          <button className="text-slate-700 text-lg">☰</button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 space-y-4">
        
        {/* Welcome Section */}
        <div>
          <p className="text-[11px] text-slate-500 font-medium">welcome back,</p>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 capitalize">{userName}</h1>
            <span className="text-emerald-600 text-sm">c</span>
          </div>
        </div>

        {/* Available Balance Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1">
              <span>💰</span> Available Balance
            </span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              ${balance.toFixed(2)}
            </div>
          </div>
          <button 
            onClick={openWithdrawModal}
            className="bg-[#f28c28] hover:bg-[#e07b18] text-white text-xs font-black px-5 py-2.5 rounded-xl shadow-sm transition flex items-center gap-1 active:scale-95"
          >
            <span>💸</span> Withdraw
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-xl p-2.5 text-center shadow-sm border border-slate-100">
            <span className="block text-[9px] text-slate-400 font-bold">Tasks</span>
            <span className="text-xs font-black text-slate-900">400+</span>
          </div>
          <div className="bg-white rounded-xl p-2.5 text-center shadow-sm border border-slate-100">
            <span className="block text-[9px] text-slate-400 font-bold">Available</span>
            <span className="text-xs font-black text-slate-900">24 hrs</span>
          </div>
          <div className="bg-white rounded-xl p-2.5 text-center shadow-sm border border-slate-100">
            <span className="block text-[9px] text-slate-400 font-bold">Active Users</span>
            <span className="text-xs font-black text-slate-900">1,205</span>
          </div>
        </div>

        {/* Live Withdrawals Feed */}
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center text-[10px] font-bold mb-2">
            <span className="flex items-center gap-1 text-slate-700">🌐 Live Withdrawals</span>
            <span className="text-emerald-600 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> LIVE</span>
          </div>
          <div className="flex justify-between items-center bg-[#f7f9f7] p-2.5 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">M</div>
              <div>
                <p className="text-[10px] font-bold text-slate-800">+254 711****345</p>
                <p className="text-[8px] text-emerald-600 font-semibold">✓ Withdrawal Successful</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-slate-900">$18.90</p>
              <p className="text-[8px] text-slate-400">5m ago</p>
            </div>
          </div>
        </div>

        {/* Account Upgrade Banner */}
        <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex justify-between items-center">
          <div>
            <span className="text-[9px] text-slate-400 font-bold block">Account Type</span>
            <span className="text-xs font-black text-slate-800 flex items-center gap-1">💻 Free Account</span>
          </div>
          <button 
            onClick={() => setWithdrawStep('pro_required')}
            className="bg-[#f28c28] hover:bg-[#e07b18] text-white text-[11px] font-bold px-4 py-2 rounded-xl transition shadow-sm"
          >
            Upgrade
          </button>
        </div>

        {/* Start Earning Header */}
        <div className="pt-2">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-1">
            <span>📑</span> Start Earning
          </h2>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-2 gap-3">
          {DEFAULT_TASKS.map((task) => (
            <div key={task.id} className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="font-black text-xs text-slate-900 leading-tight">{task.title}</h3>
                <p className="text-[9px] text-slate-400 mt-1 line-clamp-2">{task.category}</p>
                <p className="text-[10px] font-black text-emerald-700 mt-2">${task.reward.toFixed(2)} / task</p>
              </div>

              {task.isFree ? (
                <button 
                  onClick={() => alert('Task started! Complete the steps to earn rewards.')}
                  className="w-full mt-3 bg-[#2a7a4c] hover:bg-[#23683f] text-white text-[10px] font-bold py-2 rounded-xl transition flex items-center justify-center gap-1"
                >
                  Start Earning →
                </button>
              ) : (
                <button 
                  onClick={() => {
                    setWithdrawStep('pro_required');
                    setShowWithdrawModal(true);
                  }}
                  className="w-full mt-3 bg-[#e2ece0] text-[#336842] text-[10px] font-bold py-2 rounded-xl transition flex items-center justify-center gap-1"
                >
                  🔒 Upgrade
                </button>
              )}
            </div>
          ))}
        </div>

      </main>

      {/* Withdraw Modal Backdrop */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#f4f7f4] rounded-3xl p-5 max-w-xs w-full shadow-2xl border border-slate-200 relative">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                <span className="w-5 h-5 rounded-md bg-emerald-200 text-emerald-800 flex items-center justify-center text-[10px]">💳</span>
                Withdraw Funds
              </div>
              <button 
                onClick={() => setShowWithdrawModal(false)}
                className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-xs flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* STEP 1: Select Method */}
            {withdrawStep === 'methods' && (
              <div className="space-y-3">
                <div className="bg-[#e4efe3] p-3 rounded-2xl text-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Available Balance</span>
                  <span className="text-xl font-black text-[#2a7a4c]">${balance.toFixed(2)}</span>
                </div>

                <p className="text-[10px] font-bold text-slate-600 mt-2">Select Method</p>

                <div className="space-y-2 text-left">
                  <button onClick={() => handleSelectMethod('mpesa')} className="w-full bg-[#f1f6f1] hover:bg-[#e4efe3] p-3 rounded-2xl border border-slate-200/60 flex items-center gap-3 transition">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">M-PESA</div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">M-Pesa</p>
                      <p className="text-[9px] text-slate-400">Safaricom • Instant transfer</p>
                    </div>
                  </button>

                  <button onClick={() => handleSelectMethod('paypal')} className="w-full bg-[#f1f6f1] hover:bg-[#e4efe3] p-3 rounded-2xl border border-slate-200/60 flex justify-between items-center transition">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">PayPal</div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">PayPal</p>
                        <p className="text-[9px] text-slate-400">1-3 business days</p>
                      </div>
                    </div>
                    <span className="text-[8px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">SOON</span>
                  </button>

                  <button onClick={() => handleSelectMethod('bank')} className="w-full bg-[#f1f6f1] hover:bg-[#e4efe3] p-3 rounded-2xl border border-slate-200/60 flex items-center gap-3 transition">
                    <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold flex items-center justify-center">🏦</div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Bank Transfer</p>
                      <p className="text-[9px] text-slate-400">2-5 business days</p>
                    </div>
                  </button>

                  <button onClick={() => handleSelectMethod('crypto')} className="w-full bg-[#f1f6f1] hover:bg-[#e4efe3] p-3 rounded-2xl border border-slate-200/60 flex items-center gap-3 transition">
                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center">₿</div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Cryptocurrency</p>
                      <p className="text-[9px] text-slate-400">Bitcoin, USDT • 1-2 hours</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Input Details */}
            {withdrawStep === 'details' && (
              <form onSubmit={handleProcessWithdrawal} className="space-y-3">
                <button 
                  type="button" 
                  onClick={() => setWithdrawStep('methods')} 
                  className="text-[10px] text-[#2a7a4c] font-bold hover:underline mb-1 block"
                >
                  ← Back to Methods
                </button>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">Withdrawal Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">$</span>
                    <input 
                      type="number" 
                      required 
                      placeholder="0.00" 
                      value={withdrawAmount} 
                      onChange={(e) => setWithdrawAmount(e.target.value)} 
                      className="w-full bg-[#e8f0e7] rounded-xl pl-7 pr-12 py-2 text-xs font-bold focus:outline-none" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setWithdrawAmount(balance.toString())} 
                      className="absolute right-2 top-2 text-[9px] font-extrabold text-[#2a7a4c] bg-white px-1.5 py-0.5 rounded shadow-xs"
                    >
                      MAX
                    </button>
                  </div>
                  <span className="text-[8px] text-slate-400 mt-0.5 block">Available: ${balance.toFixed(2)}</span>
                </div>

                <div className="p-2.5 bg-[#e4efe3] rounded-xl text-left">
                  <span className="text-[10px] font-bold text-[#2a7a4c] flex items-center gap-1">
                    <span>📲</span> M-Pesa details
                  </span>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="John Doe" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    className="w-full bg-[#e8f0e7] rounded-xl px-3 py-2 text-xs focus:outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="+254 7XX XXX XXX" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    className="w-full bg-[#e8f0e7] rounded-xl px-3 py-2 text-xs focus:outline-none" 
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#dbe8d8] hover:bg-[#2a7a4c] hover:text-white text-slate-800 font-bold py-3 rounded-xl text-xs transition mt-2 shadow-xs"
                >
                  Process Withdrawal
                </button>
              </form>
            )}

            {/* STEP 3: Pro Required Popup */}
            {withdrawStep === 'pro_required' && (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xl mx-auto shadow-inner">
                  🔒
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">Pro Account Required</h3>
                  <p className="text-[10px] text-slate-500 mt-1 px-2 leading-relaxed">
                    Upgrade your account to instantly process withdrawals and unlock premium features.
                  </p>
                </div>
                <button 
                  onClick={() => alert('Redirecting to account upgrade payment...')}
                  className="w-full bg-[#2a7a4c] hover:bg-[#23683f] text-white font-bold py-3 rounded-xl text-xs transition shadow-md mt-2"
                >
                  Upgrade to Pro
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/80 px-6 py-2 z-40 flex justify-between items-center max-w-md mx-auto">
        <button className="flex flex-col items-center gap-0.5 text-[#2a7a4c]">
          <span className="text-base">🏠</span>
          <span className="text-[9px] font-bold">Dashboard</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-700">
          <span className="text-base">📊</span>
          <span className="text-[9px] font-bold">Earnings</span>
        </button>
        <button onClick={openWithdrawModal} className="flex flex-col items-center gap-0.5 text-[#2a7a4c]">
          <div className="w-10 h-10 rounded-full bg-[#2a7a4c] text-white flex items-center justify-center text-lg -mt-5 shadow-lg border-2 border-white">
            $
          </div>
          <span className="text-[9px] font-bold text-[#2a7a4c]">Withdraw</span>
        </button>
        <button className="flex flex-col items-center gap-0.5 text-slate-400 hover:text-slate-700">
          <span className="text-base">❓</span>
          <span className="text-[9px] font-bold">Help</span>
        </button>
      </nav>

    </div>
  );
}
