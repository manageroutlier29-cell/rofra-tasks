'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [isPremium, setIsPremium] = useState(false);
  const [balance, setBalance] = useState(0.0);
  const [withdrawMethod, setWithdrawMethod] = useState('MPESA');
  const [destination, setDestination] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const freeTasks = [
    { id: 1, title: 'Watch 30s Sponsored Video', reward: 15 },
    { id: 2, title: 'Complete 3-question Survey', reward: 20 },
  ];

  const premiumTasks = [
    { id: 3, title: '⭐ Review App on PlayStore', reward: 150 },
    { id: 4, title: '⭐ Test Beta Web Software', reward: 300 },
  ];

  const completeTask = (reward: number) => {
    setBalance((prev) => prev + reward);
    alert(`Task completed! KES ${reward} added to your balance.`);
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    if (amt > balance) {
      alert('Insufficient balance!');
      return;
    }

    setStatusMsg('Processing instant payout...');
    setTimeout(() => {
      setBalance((prev) => prev - amt);
      setStatusMsg(`Success! Sent KES ${amt} via ${withdrawMethod} to ${destination}`);
      setWithdrawAmount('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-black">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Rofra Tasks Dashboard</h1>
            <p className="text-gray-500">Account Type: <span className="font-semibold text-blue-800">{isPremium ? '⭐ PREMIUM' : 'FREE USER'}</span></p>
          </div>
          <div className="bg-green-50 border border-green-200 px-6 py-3 rounded-xl text-center">
            <span className="text-sm text-green-600 font-medium">Available Balance</span>
            <p className="text-2xl font-bold text-green-700">KES {balance.toFixed(2)}</p>
          </div>
        </div>

        {!isPremium && (
          <div className="bg-amber-500 text-white p-6 rounded-2xl shadow-md flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Upgrade to Rofra Premium</h2>
              <p className="text-sm opacity-90">Unlock high-paying tasks up to KES 500 per task.</p>
            </div>
            <button
              onClick={() => { setIsPremium(true); alert('Upgraded to Premium!'); }}
              className="bg-white text-amber-600 px-4 py-2 rounded-xl font-bold shadow hover:bg-amber-50"
            >
              Pay KES 200 to Unlock
            </button>
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Available Tasks</h2>
          <div className="grid gap-4">
            {freeTasks.map((task) => (
              <div key={task.id} className="border p-4 rounded-xl flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-green-600 font-bold">+ KES {task.reward}</p>
                </div>
                <button onClick={() => completeTask(task.reward)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium">
                  Complete Task
                </button>
              </div>
            ))}

            {isPremium && premiumTasks.map((task) => (
              <div key={task.id} className="border border-amber-300 bg-amber-50/30 p-4 rounded-xl flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-green-600 font-bold">+ KES {task.reward}</p>
                </div>
                <button onClick={() => completeTask(task.reward)} className="bg-amber-500 text-white px-4 py-2 rounded-lg font-medium">
                  Complete Task
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Instant Withdrawal</h2>
          {statusMsg && <div className="p-3 mb-4 bg-blue-50 text-blue-700 rounded-lg text-sm">{statusMsg}</div>}
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {['MPESA', 'BANK', 'CRYPTO'].map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setWithdrawMethod(method)}
                  className={`p-3 rounded-xl border text-center font-bold text-sm ${
                    withdrawMethod === method ? 'border-blue-600 bg-blue-50 text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder={withdrawMethod === 'MPESA' ? 'Phone Number (e.g. 2547...)' : withdrawMethod === 'BANK' ? 'Account Number' : 'Crypto Wallet Address'}
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full p-3 border rounded-xl"
            />

            <input
              type="number"
              placeholder="Amount (KES)"
              required
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="w-full p-3 border rounded-xl"
            />

            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-xl font-bold">
              Withdraw Instantly
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
