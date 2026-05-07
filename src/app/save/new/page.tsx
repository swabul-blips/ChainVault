"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { addNotification, announceVoice, updateState } from "@/lib/storage";
import { createVaultId } from "@/lib/vaults";

const icons = ["🎓", "💻", "🏪", "🏠", "🚲", "⛽"];

export default function SaveNewPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("School Fees");
  const [icon, setIcon] = useState("🎓");
  const [targetAmount, setTargetAmount] = useState(200);
  const [schedule, setSchedule] = useState<"Weekly" | "BiWeekly" | "Flexible">("Weekly");
  const [targetDate, setTargetDate] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState("");

  function createVault() {
    if (!name.trim() || targetAmount < 1) {
      setError("Provide vault name and target amount >= $1.");
      return;
    }
    const id = createVaultId();
    updateState((state) => {
      if (state.vaults.length >= 5) return state;
      return {
        ...state,
        onboardingStep: 4,
        vaults: [
          {
            id,
            owner: state.walletAddress || "wallet_uganda_001",
            name: name.trim(),
            icon,
            targetAmount,
            currentBalance: 0,
            interestEarned: 0,
            createdAt: new Date().toISOString(),
            targetDate: targetDate || undefined,
            contributionSchedule: schedule,
            isPublic,
            vouches: 0,
            isCompleted: false,
            contributionHistory: [],
          },
          ...state.vaults,
        ],
      };
    });
    addNotification({ type: "vault", message: `Vault created: ${name} with target $${targetAmount}.` });
    announceVoice(`Your new vault ${name} has been created. Your goal is ${targetAmount} dollars.`);
    router.push(`/save/${id}`);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <main className="mx-auto max-w-3xl px-6 py-10 pb-24">
        <section className="glass-card p-6">
          <h1 className="text-2xl font-semibold">Create VaultSave</h1>
          <p className="text-sm text-slate-300">Step {step} of 3</p>
          {step === 1 ? (
            <div className="mt-4 grid gap-3">
              <label className="text-sm">
                Vault Name
                <input className="input-field mt-1" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="text-sm">
                Icon
                <div className="mt-1 flex flex-wrap gap-2">
                  {icons.map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={`rounded-md border px-3 py-2 ${icon === value ? "border-cyan-300" : "border-white/20"}`}
                      onClick={() => setIcon(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </label>
            </div>
          ) : null}
          {step === 2 ? (
            <div className="mt-4 grid gap-3">
              <label className="text-sm">
                Target amount (USDC)
                <input
                  className="input-field mt-1"
                  type="number"
                  min={1}
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                />
              </label>
              <label className="text-sm">
                Target date (optional)
                <input className="input-field mt-1" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
              </label>
            </div>
          ) : null}
          {step === 3 ? (
            <div className="mt-4 grid gap-3">
              <label className="text-sm">
                Contribution schedule
                <select
                  className="input-field mt-1"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value as "Weekly" | "BiWeekly" | "Flexible")}
                >
                  <option value="Weekly">Weekly</option>
                  <option value="BiWeekly">Bi-weekly</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                Make this vault public for vouching
              </label>
            </div>
          ) : null}
          {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
          <div className="mt-5 flex gap-2">
            {step > 1 ? (
              <button type="button" className="rounded-md border border-white/20 px-3 py-2 text-sm" onClick={() => setStep(step - 1)}>
                Back
              </button>
            ) : null}
            {step < 3 ? (
              <button type="button" className="btn-primary text-sm" onClick={() => setStep(step + 1)}>
                Next
              </button>
            ) : (
              <button type="button" className="btn-primary text-sm" onClick={createVault}>
                Create vault
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
