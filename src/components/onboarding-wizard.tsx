"use client";

import Link from "next/link";
import { updateState } from "@/lib/storage";
import { useChainVaultState } from "@/hooks/use-chainvault-state";

export function OnboardingWizard() {
  const state = useChainVaultState();
  const step = state.onboardingStep;

  if (step >= 4) return null;

  const titles = {
    1: "Step 1: Connect your wallet",
    2: "Step 2: Generate your ChainScore",
    3: "Step 3: Choose your path",
  } as const;

  return (
    <section className="glass-card animate-rise p-5">
      <p className="text-xs text-cyan-300">New user onboarding</p>
      <h3 className="mt-1 text-lg font-semibold">{titles[step as 1 | 2 | 3]}</h3>
      {step === 1 ? (
        <p className="mt-2 text-sm text-slate-300">
          Use a wallet identifier in Borrow flow. This simulates wallet connection.
        </p>
      ) : null}
      {step === 2 ? (
        <p className="mt-2 text-sm text-slate-300">
          Go to Borrow and compute your ChainScore to unlock borrowing and better savings insights.
        </p>
      ) : null}
      {step === 3 ? (
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          <Link href="/borrow" className="btn-primary">
            Borrow
          </Link>
          <Link href="/lend" className="btn-primary">
            Lend
          </Link>
          <Link href="/save" className="btn-primary">
            Save
          </Link>
        </div>
      ) : null}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="btn-primary text-xs"
          onClick={() =>
            updateState((current) => ({
              ...current,
              onboardingStep: Math.min(4, current.onboardingStep + 1) as 1 | 2 | 3 | 4,
            }))
          }
        >
          {step === 3 ? "Finish onboarding" : "Continue"}
        </button>
        <button
          type="button"
          className="rounded-md border border-white/20 px-3 py-2 text-xs"
          onClick={() => updateState((current) => ({ ...current, onboardingStep: 4 }))}
        >
          Skip
        </button>
      </div>
    </section>
  );
}
