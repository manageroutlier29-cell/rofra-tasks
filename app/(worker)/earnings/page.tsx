'use client';

import { useState } from 'react';

export default function WorkerEarningsPage() {
  const [approvedBalance, setApprovedBalance] = useState(1200);
  const [pendingBalance, setPendingBalance] = useState(450);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState<'mpesa' | 'bank'>('mpesa');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [loading, setLoading] = useState(false);

  // History state
  const [transactions, setTransactions] = useState([
    { id: 'tx-1', amount: 800, method: 'M-Pesa (0712***567)', status: 'Completed', date: '2026-08-10' },
  ]);

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);

    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    if (withdrawAmount > approvedBalance) {
      alert('Requested amount exceeds your approved balance.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setApprovedBalance((prev) => prev - withdrawAmount);
      
      const destination =
        payoutMethod === 'mpesa'
          ? `M-Pesa (${phoneNumber})`
          : `${bankName} (${bankAccount})`;

      setTransactions((prev) => [
        {
          id: `tx-${Date.now()}`,
          amount: withdrawAmount,
          method: destination,
          status: 'Processing',
          date: new Date().toISOString().split('T')[0],
        },
        ...prev,
      ]);

      setLoading(false);
      setIsModalOpen(false);
      setAmount('');
      alert(`Payout request of KSh ${withdrawAmount} submitted successfully!`);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-black text-white">Earnings & Payouts</h1>
          <p className="text-xs text-slate-400 mt-1">Track approved balance and request withdrawals.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={approvedBalance <= 0}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-xs px-5 py-3 rounded-xl transition shadow"
        >
          Request Payout
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Pending Quality Audit</span>
          <div className="text-2xl font-black text-amber-400 font-mono">KSh {pendingBalance.toLocaleString()}</div>
        </div>
        <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase">Available for Withdrawal</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">KSh {approvedBalance.toLocaleString()}</div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 space-y-4">
        <h2 className="text-xs font-black uppercase text-slate-400 tracking-wider">
          Payout History
        </h2>

        <div className="space-y-2">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-white">{tx.method}</p>
                <span className="text-[10px] font-mono text-slate-500">{tx.date}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400 font-mono">KSh {tx.amount.toLocaleString()}</span>
                <span className={`block text-[10px] font-bold ${tx.status === 'Completed' ? 'text-emerald-500' : 'text-amber-400'}`}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-5 shadow-2xl">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white">Request Payout</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePayoutSubmit} className="space-y-4">
              
              {/* Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Select Payout Method:</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('mpesa')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition ${
                      payoutMethod === 'mpesa'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    M-Pesa
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('bank')}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition ${
                      payoutMethod === 'bank'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    Bank Transfer
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <label className="font-bold text-slate-300">Amount (KSh):</label>
                  <span className="text-slate-400 font-mono">Max: KSh {approvedBalance}</span>
                </div>
                <input
                  type="number"
                  required
                  max={approvedBalance}
                  min={100}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {/* Dynamic Inputs */}
              {payoutMethod === 'mpesa' ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">M-Pesa Phone Number:</label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 0712345678"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Bank Name:</label>
                    <input
                      type="text"
                      required
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="e.g. Equity Bank"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Account Number:</label>
                    <input
                      type="text"
                      required
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      placeholder="e.g. 0123456789"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs py-3 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-black text-xs py-3 rounded-xl transition"
                >
                  {loading ? 'Processing...' : 'Confirm Payout'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
