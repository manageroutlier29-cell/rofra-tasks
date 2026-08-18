import Link from "next/link";
import { 
  Home, 
  Briefcase, 
  Award, 
  DollarSign, 
  Settings, 
  User, 
  CheckSquare,
  LogOut 
} from "lucide-react";

export default function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { label: "Home", href: "/dashboard", icon: Home },
    { label: "Projects", href: "/projects", icon: Briefcase },
    { label: "Tasks", href: "/tasks", icon: CheckSquare },
    { label: "Assessment", href: "/assessment", icon: Award },
    { label: "Earnings", href: "/earnings", icon: DollarSign },
    { label: "Profile", href: "/settings", icon: User },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      {/* Sleek Vertical Left Sidebar */}
      <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 flex flex-col justify-between sticky top-0 h-screen z-30 transition-all">
        <div className="p-4 lg:p-6 space-y-8">
          {/* Logo / Brand Header */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl font-black tracking-tight text-indigo-600 font-sans">
              ROFRA
            </span>
          </Link>

          {/* Primary Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3.5 px-3 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-all group"
                >
                  <Icon className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  <span className="hidden lg:block">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / Account Profile Avatar */}
        <div className="p-4 lg:p-6 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-semibold flex items-center justify-center text-sm shadow-sm">
              W
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-semibold text-slate-800">Worker Account</p>
              <p className="text-[11px] text-slate-400">Verified Member</p>
            </div>
          </div>
          <Link 
            href="/api/auth/signout" 
            className="hidden lg:block text-slate-400 hover:text-rose-600 transition-colors p-1"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>

      {/* Main Content Workspace Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
