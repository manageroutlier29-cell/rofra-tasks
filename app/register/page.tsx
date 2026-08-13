'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', phoneNumber: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setMessage('Registration successful! Redirecting...');
      setTimeout(() => (window.location.href = '/dashboard'), 1500);
    } else {
      setMessage(data.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 text-black">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-2">Rofra Tasks</h1>
        <p className="text-center text-gray-500 mb-6">Create an account to start earning</p>

        {message && <div className="p-3 mb-4 text-sm bg-blue-50 text-blue-700 rounded-lg">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              required
              className="w-full mt-1 p-2 border rounded-lg text-black"
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              className="w-full mt-1 p-2 border rounded-lg text-black"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number (M-Pesa)</label>
            <input
              type="text"
              placeholder="e.g. 254712345678"
              required
              className="w-full mt-1 p-2 border rounded-lg text-black"
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="w-full mt-1 p-2 border rounded-lg text-black"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}
