"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { useChainVaultState } from "@/hooks/use-chainvault-state";
import { addNotification, announceVoice, updateState } from "@/lib/storage";

export default function VaultDetailPage() {
  const params = useParams<{ vaultId: string }>();
  const state = useChainVaultState();
  const vault = state.vaults.find((item) => item.id === params.vaultId);

  if (!vault) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <NavBar />
        <main className="mx-auto max-w-4xl px-6 py-10">
          <div className="glass-card p-6">
            <p>Vault not found.</p>
            <Link href="/save" className="text-cyan-300">
              Back to save dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const progress = Math.min(100, Math.round((vault.currentBalance / vault.targetAmount) * 100));

  function withdrawAll() {
    if (!vault) return;
    const selectedVault = vault;
    updateState((current) => ({
      ...current,
      totalRepaid: current.totalRepaid + selectedVault.currentBalance + selectedVault.interestEarned,
      chainScore:
        current.chainScore + (selectedVault.currentBalance >= selectedVault.targetAmount ? 30 : 0),
      vaults: current.vaults.map((item) =>
        item.id === selectedVault.id
          ? {
              ...item,
              currentBalance: 0,
              interestEarned: 0,
              isCompleted: false,
              contributionHistory: [],
            }
          : item,
      ),
    }));
    addNotification({
      type: "vault",
      message: `${selectedVault.name} withdrawn. You received $${(selectedVault.currentBalance + selectedVault.interestEarned).toFixed(2)}.`,
    });
    announceVoice(
      `Congratulations. Your ${selectedVault.name} vault reached target and can now be withdrawn.`,
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <main className="mx-auto max-w-4xl px-6 py-8 pb-24">
        <section className="glass-card p-6">
          <h1 className="text-2xl font-semibold">
            {vault.icon} {vault.name}
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            ${vault.currentBalance.toFixed(2)} / ${vault.targetAmount.toFixed(2)}
          </p>
          <div className="mt-3 h-4 rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-sm text-emerald-300">Interest: ${vault.interestEarned.toFixed(2)}</p>
          <p className="text-sm text-slate-300">
            Schedule: {vault.contributionSchedule} | Public: {vault.isPublic ? "Yes" : "No"} | Vouches: {vault.vouches}
          </p>
          <button type="button" className="btn-primary mt-4 text-sm" onClick={withdrawAll}>
            Withdraw (principal + interest)
          </button>
        </section>
      </main>
    </div>
  );
}
