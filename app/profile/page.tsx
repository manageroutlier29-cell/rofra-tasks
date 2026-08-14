'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail') || 'worker@rofratasks.com';
    setEmail(storedEmail);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-800 font-sans p-4">
      <div className="max-w-md mx-auto space-y-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200">
          <button onClick={() => router.push('/dashboard')} className="text-xs font-bold text-slate-500">
            ← Back to Dashboard
          </button>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            WORKER PROFILE
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#2a7a4c] text-white text-2xl font-black flex items-center justify-center mx-auto">
            {email.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">{email}</h2>
            <p className="text-xs text-slate-400">Account Status: Active Worker</p>
          </div>
        </div>
      </div>
    </div>
  );
}
