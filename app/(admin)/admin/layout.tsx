'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ADMIN_NAV = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Clients', path: '/admin/clients' },
  { label: 'Projects', path: '/admin/projects' },
  { label: 'Tasks', path: '/admin/tasks' },
  { label: 'Assessment', path: '/admin/assessment' },
  { label: 'Quality', path: '/admin/quality' },
  { label: 'Payment', path: '/admin/payments' },
  { label: 'Settings', path: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-5 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950">A</div>
            <div>
              <span className="font-black text-white text-sm block">ROFRA ADMIN</span>
              <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider">Quality & Ops</span>
            </div>
          </div>

          <nav className="space-y-1">
            {ADMIN_NAV.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800 pt-4">
          <span className="text-[10px] text-amber-400/80 block uppercase font-bold">Admin Console v2.0</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
