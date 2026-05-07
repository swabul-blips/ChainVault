"use client";

import { NavBar } from "@/components/nav-bar";
import { PoolSelector } from "@/components/pool-selector";
import { useChainVaultState } from "@/hooks/use-chainvault-state";

export default function LendPage() {
  const state = useChainVaultState();
  const activeLoans = state.loans.filter((loan) => loan.status === "Active").length;
  const avgScore = state.loans.length
    ? Math.round(state.chainScore / Math.max(1, state.loans.length))
    : state.chainScore;
  const repaymentRate =
    state.totalLoansIssued > 0 ? Math.round((state.totalRepaid / state.totalLoansIssued) * 100) : 94;
  const projectedApy = Math.max(8, Math.min(22, Math.round(8 + activeLoans * 0.8 + repaymentRate / 15)));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <main className="animate-fade-scale mx-auto grid max-w-6xl gap-6 px-6 py-10 pb-24 md:grid-cols-[1fr_360px] md:pb-10">
        <PoolSelector />
        <section className="glass-card animate-rise p-6">
          <h2 className="text-xl font-semibold">Pool Overview</h2>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>Total deposits: ${state?.totalDeposits ?? 0}</p>
            <p>Total loans issued: ${state?.totalLoansIssued ?? 0}</p>
            <p>Total repaid: ${state?.totalRepaid ?? 0}</p>
          </div>
          <h3 className="mt-6 text-sm font-semibold text-slate-200">Recent deposits</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-300">
            {(state?.deposits ?? []).slice(0, 5).map((deposit, index) => (
              <li key={`${deposit.createdAt}-${index}`} className="rounded-md border border-white/10 p-2">
                {deposit.lender} deposited ${deposit.amount} in {deposit.tier}
              </li>
            ))}
            {state.deposits.length === 0 && <li className="text-slate-500">No deposits yet.</li>}
          </ul>
          <h3 className="mt-6 text-sm font-semibold text-slate-200">Pool health</h3>
          <div className="mt-2 grid gap-2 text-xs text-slate-300">
            <p>Total pool size: ${state.totalDeposits.toFixed(2)}</p>
            <p>Active loans count: {activeLoans}</p>
            <p>Average borrower ChainScore: {avgScore}</p>
            <p>Historical repayment rate: {repaymentRate}% on-time repayments</p>
            <p>Projected APY (30d): {projectedApy}%</p>
          </div>
        </section>
      </main>
    </div>
  );
}
