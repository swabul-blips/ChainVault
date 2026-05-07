"use client";

import { ChainScoreCard } from "@/components/chain-score-card";
import { LoanWizard } from "@/components/loan-wizard";
import { NavBar } from "@/components/nav-bar";
import { useChainVaultState } from "@/hooks/use-chainvault-state";

export default function BorrowPage() {
  const state = useChainVaultState();
  const score = state.chainScore || 540;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <main className="animate-fade-scale mx-auto grid max-w-6xl gap-6 px-6 py-10 pb-24 md:grid-cols-[330px_1fr] md:pb-10">
        <ChainScoreCard score={score} />
        <LoanWizard />
      </main>
    </div>
  );
}
