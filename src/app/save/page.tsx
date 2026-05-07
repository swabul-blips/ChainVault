"use client";

import Link from "next/link";
import { NavBar } from "@/components/nav-bar";
import { useChainVaultState } from "@/hooks/use-chainvault-state";
import { addNotification, announceVoice, updateState } from "@/lib/storage";
import { computeAccruedInterest, projectedCompletionDate, weeklyPace } from "@/lib/vaults";

export default function SavePage() {
  const state = useChainVaultState();
  const activeVault = state.vaults[0];
  const totalSaved = state.vaults.reduce((sum, vault) => sum + vault.currentBalance, 0);
  const totalInterest = state.vaults.reduce((sum, vault) => sum + vault.interestEarned, 0);

  function depositToVault(vaultId: string, amount: number) {
    if (amount < 1) return;
    updateState((current) => {
      const nextVaults = current.vaults.map((vault) => {
        if (vault.id !== vaultId) return vault;
        const nextBalance = vault.currentBalance + amount;
        const nextInterest = vault.interestEarned + computeAccruedInterest(vault) * 0.03;
        const completed = nextBalance >= vault.targetAmount;
        return {
          ...vault,
          currentBalance: nextBalance,
          interestEarned: Number(nextInterest.toFixed(2)),
          contributionHistory: [{ amount, createdAt: new Date().toISOString() }, ...vault.contributionHistory],
          isCompleted: completed,
        };
      });

      return {
        ...current,
        totalDeposits: current.totalDeposits + amount,
        chainScore: current.chainScore + 5,
        vaults: nextVaults,
      };
    });
    addNotification({ type: "vault", message: `Deposit received: $${amount} added to your vault.` });
    announceVoice(`Deposit successful. ${amount} dollars added to your vault.`);
  }

  function togglePublic(vaultId: string) {
    updateState((current) => ({
      ...current,
      vaults: current.vaults.map((vault) =>
        vault.id === vaultId ? { ...vault, isPublic: !vault.isPublic } : vault,
      ),
    }));
  }

  function autoVouch(vaultId: string) {
    updateState((current) => ({
      ...current,
      vaults: current.vaults.map((vault) =>
        vault.id === vaultId ? { ...vault, vouches: Math.min(10, vault.vouches + 1) } : vault,
      ),
    }));
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <main className="animate-fade-scale mx-auto grid max-w-7xl gap-5 px-6 py-8 pb-24 lg:grid-cols-[260px_1fr_290px]">
        <aside className="glass-card p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">My Vaults</h2>
            <Link href="/save/new" className="btn-primary text-xs">
              New
            </Link>
          </div>
          <p className="text-xs text-slate-400">Saved: ${totalSaved.toFixed(2)}</p>
          <p className="mb-3 text-xs text-slate-400">Interest: ${totalInterest.toFixed(2)}</p>
          <ul className="space-y-2">
            {state.vaults.map((vault) => {
              const progress = Math.min(100, Math.round((vault.currentBalance / vault.targetAmount) * 100));
              return (
                <li key={vault.id} className="rounded-md border border-white/10 p-3">
                  <p className="text-sm">
                    {vault.icon} {vault.name}
                  </p>
                  <p className="text-xs text-slate-400">{progress}% complete</p>
                  <Link href={`/save/${vault.id}`} className="text-xs text-cyan-300">
                    Open detail
                  </Link>
                </li>
              );
            })}
            {state.vaults.length === 0 ? <li className="text-sm text-slate-400">No active vaults yet.</li> : null}
          </ul>
        </aside>

        <section className="glass-card p-5">
          {activeVault ? (
            <>
              <h2 className="text-2xl font-semibold">
                {activeVault.icon} {activeVault.name}
              </h2>
              <p className="text-sm text-slate-300">
                ${activeVault.currentBalance.toFixed(2)} of ${activeVault.targetAmount.toFixed(2)}
              </p>
              <div className="mt-3 h-4 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                  style={{ width: `${Math.min(100, (activeVault.currentBalance / activeVault.targetAmount) * 100)}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-emerald-300">+ ${activeVault.interestEarned.toFixed(2)} interest earned</p>
              <p className="mt-1 text-xs text-slate-400">Projected completion: {projectedCompletionDate(activeVault)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[5, 10, 20].map((value) => (
                  <button key={value} type="button" className="btn-primary text-xs" onClick={() => depositToVault(activeVault.id, value)}>
                    Deposit ${value}
                  </button>
                ))}
                <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-xs" onClick={() => togglePublic(activeVault.id)}>
                  {activeVault.isPublic ? "Make Private" : "Make Public"}
                </button>
                <button type="button" className="rounded-md border border-cyan-400/50 px-3 py-2 text-xs text-cyan-200" onClick={() => autoVouch(activeVault.id)}>
                  Add vouch
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-400">Vouches: {activeVault.vouches}</p>
              <h3 className="mt-5 text-sm font-semibold">Contribution history</h3>
              <ul className="mt-2 space-y-2 text-xs">
                {activeVault.contributionHistory.slice(0, 8).map((entry, index) => (
                  <li key={`${entry.createdAt}-${index}`} className="rounded-md border border-white/10 px-2 py-1">
                    +${entry.amount} on {new Date(entry.createdAt).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div>
              <h2 className="text-xl font-semibold">Create your first vault</h2>
              <p className="mt-2 text-sm text-slate-300">
                Set a savings goal, deposit weekly, and earn interest from the Safe pool.
              </p>
              <Link href="/save/new" className="btn-primary mt-4 inline-flex text-sm">
                Start VaultSave
              </Link>
            </div>
          )}
        </section>

        <aside className="glass-card p-4">
          <h3 className="text-lg font-semibold">Savings Insights</h3>
          {activeVault ? (
            <>
              <p className="mt-2 text-sm text-slate-300">
                Weekly pace: ${weeklyPace(activeVault)} ({activeVault.contributionSchedule})
              </p>
              <p className="mt-1 text-sm text-emerald-300">
                {weeklyPace(activeVault) >= activeVault.targetAmount / 10
                  ? "You are on track!"
                  : "Deposit $15 more this week to stay on track."}
              </p>
              <p className="mt-4 text-xs text-slate-400">Completing this vault can raise your score by +30.</p>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-400">Insights will appear once you create a vault.</p>
          )}
        </aside>
      </main>
    </div>
  );
}
