'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Worker {
  id: string;
  email: string;
  balance: number;
  is_pro: boolean;
}

interface Payout {
  id: string;
  worker_email: string;
  amount: number;
  phone: string;
  status: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [activeTab, setActiveTab] = useState<'workers' | 'payouts'>('workers');

  useEffect(() => {
    fetchWorkers();
    fetchPayouts();
  }, []);

  const fetchWorkers = async () => {
    const { data } = await supabase.from('workers').select('*');
    if (data) setWorkers(data);
  };

  const fetchPayouts = async () => {
    const { data } = await supabase.from('payouts').select('*').order('created_at', { ascending: false });
    if (data) setPayouts(data);
  };

  const toggleProStatus = async (workerId: string, currentStatus: boolean) => {
    await supabase.from('workers').update({ is_pro: !currentStatus }).eq('id', workerId);
    fetchWorkers();
  };

  const approvePayout = async (payoutId: string, email: string, amount: number) => {
    // Approve payout
    await supabase.from('payouts').update({ status: 'approved' }).eq('id', payoutId);
    
    // Deduct worker balance in Supabase
    const { data: worker } = await supabase.from('workers').select('balance').eq('email', email).single();
    if (worker) {
      const newBal = Math.max(0, worker.balance - amount);
      await supabase.from('workers').update({ balance: newBal }).eq('email', email);
    }

    alert('Payout Approved and balance updated!');
    fetchPayouts();
    fetchWorkers();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center bg-slate-800 p-4 rounded-2xl border border-slate-700">
          <div>
            <h1 className="text-lg font-black text-white">ROFRA Admin Console</h1>
            <p className="text-xs text-slate-400">Wednesday Payout Approval & Client Tier Manager</p>
          </div>
          <button onClick={() => router.push('/dashboard')} className="text-xs font-bold bg-slate-700 px-3 py-1.5 rounded-xl">
            Exit
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('workers')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold ${activeTab === 'workers' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            👥 Clients (Pro vs Standard)
          </button>
          <button 
            onClick={() => setActiveTab('payouts')} 
            className={`px-4 py-2 rounded-xl text-xs font-bold ${activeTab === 'payouts' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            💸 Wednesday Payout Requests ({payouts.filter(p => p.status === 'pending').length})
          </button>
        </div>

        {/* Workers List */}
        {activeTab === 'workers' && (
          <div className="bg-slate-800 p-4 rounded-2xl space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase">Worker Accounts</h2>
            {workers.map(w => (
              <div key={w.id} className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-700">
                <div>
                  <div className="text-xs font-bold text-white">{w.email}</div>
                  <div className="text-[10px] text-slate-400">Balance: KSh {w.balance}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${w.is_pro ? 'bg-amber-400 text-slate-900' : 'bg-slate-700 text-slate-300'}`}>
                    {w.is_pro ? '👑 PRO' : 'STANDARD'}
                  </span>
                  <button 
                    onClick={() => toggleProStatus(w.id, w.is_pro)}
                    className="text-[10px] font-bold bg-slate-700 hover:bg-slate-600 px-2.5 py-1 rounded-lg text-slate-200"
                  >
                    {w.is_pro ? 'Downgrade' : 'Upgrade KSh 250'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Wednesday Payout Approvals */}
        {activeTab === 'payouts' && (
          <div className="bg-slate-800 p-4 rounded-2xl space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase">Pending Wednesday Approvals</h2>
            {payouts.map(p => (
              <div key={p.id} className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-700">
                <div>
                  <div className="text-xs font-bold text-white">{p.worker_email}</div>
                  <div className="text-[10px] text-emerald-400 font-bold">KSh {p.amount} → M-Pesa: {p.phone}</div>
                </div>
                <div>
                  {p.status === 'pending' ? (
                    <button 
                      onClick={() => approvePayout(p.id, p.worker_email, p.amount)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl"
                    >
                      Approve & Pay
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-400">Approved ✅</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
