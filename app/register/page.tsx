'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'WORKER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register');

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-8 rounded-3xl w-full max-w-md space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Join Platform</span>
          <h1 className="text-2xl font-black text-white">Create ROFRA Account</h1>
        </div>

        {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-bold text-center">{error}</div>}

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Account Type</label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              <button type="button" onClick={() => setFormData({ ...formData, role: 'WORKER' })} className={`py-2.5 rounded-xl text-xs font-bold transition ${formData.role === 'WORKER' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}>Worker</button>
              <button type="button" onClick={() => setFormData({ ...formData, role: 'CLIENT' })} className={`py-2.5 rounded-xl text-xs font-bold transition ${formData.role === 'CLIENT' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}>Client</button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="John Doe" className="w-full mt-1.5 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500" required />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="name@example.com" className="w-full mt-1.5 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500" required />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
            <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="••••••••••••" className="w-full mt-1.5 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500" required />
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition disabled:opacity-50">
          {loading ? 'Creating Account...' : 'Register Account'}
        </button>

        <p className="text-center text-xs text-slate-400">
          Already have an account? <Link href="/login" className="text-emerald-400 font-bold hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}
