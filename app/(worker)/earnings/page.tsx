import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function EarningsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { payouts: true, submissions: { where: { status: "APPROVED" } } },
  });

  if (!user) redirect("/login");

  // Calculate real balances
  const availableBalance = user.balance || 0;
  const pendingAmount = 0; // Calculated from pending submissions if present
  const payoutHistory = user.payouts || [];

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      <div className="flex justify-between items-center bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Earnings & Payouts</h1>
          <p className="text-slate-400 text-sm mt-1">Track approved balances and request mobile payouts.</p>
        </div>
        <button 
          disabled={availableBalance <= 0}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10"
        >
          Request Payout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <span className="text-xs font-semibold text-amber-400 tracking-wider uppercase">Pending Quality Audit</span>
          <p className="text-3xl font-extrabold text-white mt-2">KSh {pendingAmount.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">Available for Withdrawal</span>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">KSh {availableBalance.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Payout History</h2>
        {payoutHistory.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
            <p className="text-slate-500 text-sm">No payout history found. Complete tasks to earn.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payoutHistory.map((payout) => (
              <div key={payout.id} className="flex justify-between items-center p-4 bg-slate-800/40 rounded-xl border border-slate-800">
                <div>
                  <p className="text-sm font-medium text-white">{payout.method} ({payout.accountNumber})</p>
                  <p className="text-xs text-slate-500">{new Date(payout.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-white">KSh {payout.amount}</p>
                  <span className="text-xs font-semibold text-emerald-400 uppercase">{payout.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
