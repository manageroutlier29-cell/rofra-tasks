'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const PUBLIC_NAV = [
  { label: 'Home', path: '/' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'For Companies', path: '/for-companies' },
  { label: 'For Evaluators', path: '/for-evaluators' },
  { label: 'Pricing', path: '/pricing' },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-slate-950">R</div>
            <span className="font-black text-white text-base tracking-wider">ROFRA EVAL</span>
          </Link>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-6">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-xs font-bold transition ${
                  pathname === item.path ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition shadow"
            >
              Register
            </Link>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-600">
        <p>© 2026 ROFRA EVAL Platform. Enterprise AI Data & Human Feedback Infrastructure.</p>
      </footer>
    </div>
  );
}
