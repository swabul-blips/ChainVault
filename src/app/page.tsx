"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AnimatedNumber } from "@/components/animated-number";
import { OnboardingWizard } from "@/components/onboarding-wizard";
import { useChainVaultState } from "@/hooks/use-chainvault-state";
import { NavBar } from "@/components/nav-bar";

export default function Home() {
  const state = useChainVaultState();
  const repaymentRate =
    state.totalLoansIssued > 0 ? Math.round((state.totalRepaid / state.totalLoansIssued) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <main className="animate-fade-scale mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 pb-24 md:pb-10">
        <section className="glass-card animate-rise p-8">
          <h1 className="text-3xl font-bold text-cyan-300">Trustless Microfinance for the Underbanked</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Borrow on your reputation. Save toward your goals. Lend to earn. All without a bank.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/borrow" className="btn-primary text-sm font-medium">
              Start Borrow Flow
            </Link>
            <Link href="/lend" className="rounded-md border border-cyan-500/40 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-600/10">
              Open Lender Dashboard
            </Link>
            <Link href="/save" className="rounded-md border border-emerald-500/40 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-600/10">
              Start Saving
            </Link>
          </div>
        </section>
        <OnboardingWizard />

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard title="Deposits" value={<AnimatedNumber prefix="$" value={state.totalDeposits} />} />
          <StatCard title="Loans Issued" value={<AnimatedNumber prefix="$" value={state.totalLoansIssued} />} />
          <StatCard title="Repayment Rate" value={<AnimatedNumber value={repaymentRate} suffix="%" />} />
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: ReactNode }) {
  return (
    <article className="glass-card animate-rise p-5">
      <h2 className="text-sm text-slate-400">{title}</h2>
      <p className="mt-2 text-lg font-semibold text-slate-100">{value}</p>
    </article>
  );
}
