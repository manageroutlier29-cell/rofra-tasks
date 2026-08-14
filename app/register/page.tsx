'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('Kenya');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert('Please enter your email address.');

    if (!isSignIn && password !== confirmPassword) {
      return alert('Passwords do not match!');
    }

    setIsLoading(true);

    const cleanEmail = email.trim().toLowerCase();
    const displayName = fullName.trim() || cleanEmail.split('@')[0];

    localStorage.setItem('userEmail', cleanEmail);
    localStorage.setItem('userName', displayName);
    localStorage.setItem('userPhone', phone);
    localStorage.setItem('userCountry', country);
    localStorage.setItem('authProvider', 'Email');

    setTimeout(() => {
      setIsLoading(false);
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f1f1eb] flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      
      {/* Top Profile Icon */}
      <div className="w-16 h-16 rounded-full bg-[#dbe8d8] text-[#2a7a4c] flex items-center justify-center mb-3 shadow-sm">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>

      {/* Main Title */}
      <h1 className="text-2xl font-black text-slate-900 tracking-tight">
        {isSignIn ? 'Sign In' : 'Create Account'}
      </h1>
      <p className="text-xs font-semibold text-slate-500 mb-6">
        {isSignIn ? 'Welcome back to Rofra Tasks' : 'Join us today'}
      </p>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-lg border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {!isSignIn && (
            <>
              {/* Full Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base">👤</span>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#f4f4f0] border-none rounded-xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2a7a4c]"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base">📞</span>
                  <input
                    type="tel"
                    required
                    placeholder="+254 700 000 000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#f4f4f0] border-none rounded-xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2a7a4c]"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email Address */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base">📧</span>
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f4f4f0] border-none rounded-xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2a7a4c]"
              />
            </div>
          </div>

          {!isSignIn && (
            /* Country Dropdown */
            <div>
              <label className="block font-bold text-slate-700 mb-1">Country *</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full bg-[#f4f4f0] border-none rounded-xl px-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2a7a4c]"
              >
                <option value="Kenya">Kenya</option>
                <option value="Uganda">Uganda</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="South Africa">South Africa</option>
              </select>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Password *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base">🔒</span>
              <input
                type="password"
                required
                placeholder={isSignIn ? "Enter your password" : "Create a secure password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#f4f4f0] border-none rounded-xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2a7a4c]"
              />
            </div>
          </div>

          {!isSignIn && (
            /* Confirm Password */
            <div>
              <label className="block font-bold text-slate-700 mb-1">Confirm Password *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base">🔒</span>
                <input
                  type="password"
                  required
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#f4f4f0] border-none rounded-xl pl-10 pr-3.5 py-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#2a7a4c]"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2a7a4c] hover:bg-[#23683f] text-white font-bold py-3.5 rounded-xl text-xs transition shadow-md mt-4 active:scale-[0.98]"
          >
            {isLoading 
              ? 'Please wait...' 
              : isSignIn 
                ? 'Sign In' 
                : 'Create Account'}
          </button>
        </form>

        {/* Bottom Switch Link */}
        <div className="text-center mt-5 text-[11px] text-slate-500 font-semibold">
          {isSignIn ? (
            <p>
              Don&apos;t have an account?{' '}
              <button 
                type="button" 
                onClick={() => setIsSignIn(false)} 
                className="text-[#2a7a4c] font-black hover:underline"
              >
                Create Account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={() => setIsSignIn(true)} 
                className="text-[#2a7a4c] font-black hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
