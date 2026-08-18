import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { User, Mail, Shield, Smartphone, CreditCard, Award, CheckCircle } from "lucide-react";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Account Settings & Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your profile details, payout preferences, and account security.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{user.name || "Worker Name"}</h2>
              <p className="text-slate-500 text-sm">{user.email}</p>
              <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle className="w-3 h-3" /> Status: {user.status}
              </span>
            </div>
          </div>

          {/* Form Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" /> Full Name
              </label>
              <input
                type="text"
                defaultValue={user.name || ""}
                readOnly
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-400" /> Email Address
              </label>
              <input
                type="email"
                defaultValue={user.email}
                readOnly
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Payout Information */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            Payout Methods
          </h3>
          <p className="text-slate-500 text-sm">
            Earnings are automatically remitted through M-Pesa or direct bank wire once task reviews are approved.
          </p>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-slate-900">M-Pesa Express</p>
                <p className="text-xs text-slate-500">Connected via registered phone number</p>
              </div>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
              Active
            </span>
          </div>
        </div>

        {/* Verification & Badges */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            Domain Assessment & Badges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 rounded-xl flex items-center gap-3">
              <Shield className="w-8 h-8 text-indigo-600" />
              <div>
                <p className="text-sm font-semibold text-slate-900">General Assessor</p>
                <p className="text-xs text-slate-500">Qualified for RLHF & Standard Annotation</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
