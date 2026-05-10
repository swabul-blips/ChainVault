"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AnimatedNumber } from "@/components/animated-number";
import { OnboardingWizard } from "@/components/onboarding-wizard";
import { useChainVaultState } from "@/hooks/use-chainvault-state";
import { NavBar } from "@/components/nav-bar";

export const dynamic = 'force-dynamic';

const HOW_IT_WORKS = [
  {
    icon: "🔗",
    title: "Connect Your Wallet",
    desc: "Link your Solana wallet (Phantom, Solflare, etc). No bank account or ID required.",
  },
  {
    icon: "📊",
    title: "Get Your ChainScore",
    desc: "We analyse your on-chain history — transactions, DeFi activity, repayments — and generate a trustless credit score.",
  },
  {
    icon: "💸",
    title: "Borrow, Lend or Save",
    desc: "Borrow USDC against your score, earn yield by lending to the pool, or grow savings in a goal-based vault.",
  },
  {
    icon: "✅",
    title: "Repay & Build Reputation",
    desc: "On-time repayments raise your score, unlock bigger loans, and strengthen the whole community.",
  },
];

export default function Home() {
  const state = useChainVaultState();

  // Show seeded demo numbers when no real activity yet
  const deposits = state.totalDeposits > 0 ? state.totalDeposits : 124800;
  const loansIssued = state.totalLoansIssued > 0 ? state.totalLoansIssued : 87340;
  const repaymentRate =
    state.totalLoansIssued > 0
      ? Math.round((state.totalRepaid / state.totalLoansIssued) * 100)
      : 94;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />

      {/* Demo mode banner */}
      <div
        style={{
          background: "linear-gradient(90deg, rgba(8,145,178,0.18), rgba(37,99,235,0.14))",
          borderBottom: "1px solid rgba(34,211,238,0.18)",
          padding: "0.45rem 1rem",
          textAlign: "center",
          fontSize: "0.78rem",
          color: "#a5f3fc",
          letterSpacing: "0.01em",
        }}
      >
        🧪 <strong>Demo Mode</strong> — No real wallet needed. Connect one to pull live Solana signals, or explore freely.
        &nbsp;|&nbsp; Running on <strong>Solana Devnet</strong>
      </div>

      <main className="animate-fade-scale mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 pb-28 md:pb-12">

        {/* HERO */}
        <section className="glass-card animate-rise p-8">
          <div
            style={{
              display: "inline-block",
              background: "rgba(34,211,238,0.12)",
              border: "1px solid rgba(34,211,238,0.25)",
              borderRadius: "999px",
              padding: "0.25rem 0.85rem",
              fontSize: "0.75rem",
              color: "#67e8f9",
              marginBottom: "0.85rem",
              fontWeight: 600,
              letterSpacing: "0.04em",
            }}
          >
            ⚡ Built on Solana · Powered by ChainScore
          </div>
          <h1 className="text-3xl font-bold text-cyan-300 md:text-4xl">
            Trustless Microfinance<br />for the Underbanked
          </h1>
          <p className="mt-3 max-w-2xl text-slate-300 text-base leading-relaxed">
            Borrow on your on-chain reputation. Save toward your goals. Lend to earn yield.
            All without a bank, ID, or credit history.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/borrow" className="btn-primary text-sm font-medium">
              🚀 Start Borrow Flow
            </Link>
            <Link
              href="/lend"
              className="rounded-md border border-cyan-500/40 px-4 py-2 text-sm font-medium text-cyan-300 hover:bg-cyan-600/10"
            >
              💰 Open Lender Dashboard
            </Link>
            <Link
              href="/save"
              className="rounded-md border border-emerald-500/40 px-4 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-600/10"
            >
              🏦 Start Saving
            </Link>
          </div>
        </section>

        {/* ONBOARDING */}
        <OnboardingWizard />

        {/* LIVE STATS */}
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Platform Activity (Devnet Demo)
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              icon="🏦"
              title="Total Deposits"
              value={<AnimatedNumber prefix="$" value={deposits} />}
              sub="across all lending pools"
            />
            <StatCard
              icon="📤"
              title="Loans Issued"
              value={<AnimatedNumber prefix="$" value={loansIssued} />}
              sub="to underbanked borrowers"
            />
            <StatCard
              icon="✅"
              title="Repayment Rate"
              value={<AnimatedNumber value={repaymentRate} suffix="%" />}
              sub="on-time repayments"
            />
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
            How It Works
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step, i) => (
              <article
                key={step.title}
                className="glass-card animate-rise p-5"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>{step.icon}</div>
                <h3 className="text-sm font-semibold text-cyan-200">{step.title}</h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA FOOTER */}
        <section
          className="glass-card p-8 text-center"
          style={{ background: "linear-gradient(135deg, rgba(8,145,178,0.12), rgba(37,99,235,0.10))" }}
        >
          <h2 className="text-xl font-bold text-cyan-300">Ready to experience trustless finance?</h2>
          <p className="mt-2 text-sm text-slate-400">
            Connect your Solana wallet to get a real ChainScore in seconds.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/score" className="btn-primary text-sm font-medium">
              📊 Check My ChainScore
            </Link>
            <Link
              href="/borrow"
              className="rounded-md border border-white/20 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/5"
            >
              Apply for a Loan
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  sub,
}: {
  icon: string;
  title: string;
  value: ReactNode;
  sub: string;
}) {
  return (
    <article className="glass-card animate-rise p-5">
      <div style={{ fontSize: "1.4rem", marginBottom: "0.35rem" }}>{icon}</div>
      <h2 className="text-xs text-slate-400">{title}</h2>
      <p className="mt-1 text-2xl font-bold text-slate-100">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{sub}</p>
    </article>
  );
}
