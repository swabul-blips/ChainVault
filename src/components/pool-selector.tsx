"use client";

import { useState } from "react";
import { addNotification, announceVoice, updateState } from "@/lib/storage";

const tiers = [
  { name: "Safe", apy: 8 },
  { name: "Balanced", apy: 14 },
  { name: "Bold", apy: 22 },
] as const;

export function PoolSelector() {
  const [lender, setLender] = useState("Amina Capital");
  const [tierName, setTierName] = useState<(typeof tiers)[number]["name"]>("Balanced");
  const [amount, setAmount] = useState(500);
  const [message, setMessage] = useState("");

  function handleDeposit() {
    const safeAmount = Number.isFinite(amount) ? amount : 0;
    const trimmedLender = lender.trim();
    if (!trimmedLender) {
      setMessage("Lender name is required.");
      return;
    }
    if (safeAmount <= 0) {
      setMessage("Amount must be greater than zero.");
      return;
    }

    updateState((state) => ({
      ...state,
      totalDeposits: state.totalDeposits + safeAmount,
      deposits: [{ lender: trimmedLender, tier: tierName, amount: safeAmount, createdAt: new Date().toISOString() }, ...state.deposits],
    }));
    addNotification({ type: "pool", message: `${trimmedLender} deposited $${safeAmount} into ${tierName} pool.` });
    announceVoice(`New lender deposit received in ${tierName} pool.`);
    setMessage(`Deposit successful: $${safeAmount} to ${tierName} pool.`);
  }

  return (
    <div className="glass-card animate-rise p-6">
      <h3 className="text-xl font-semibold">Lender Pool Selector</h3>
      <div className="mt-4 grid gap-3">
        <label className="text-sm text-slate-300">
          Lender Name
          <input className="input-field mt-1" value={lender} onChange={(e) => setLender(e.target.value)} />
        </label>
        <label className="text-sm text-slate-300">
          Risk Tier
          <select
            className="input-field mt-1"
            value={tierName}
            onChange={(e) => setTierName(e.target.value as (typeof tiers)[number]["name"])}
          >
            {tiers.map((tier) => (
              <option key={tier.name} value={tier.name}>
                {tier.name} ({tier.apy}% APY)
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-300">
          Amount (USDC)
          <input className="input-field mt-1" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </label>
      </div>
      <button type="button" className="btn-primary mt-4 text-sm font-medium" onClick={handleDeposit}>
        Deposit to Pool
      </button>
      {message && <p className="mt-3 text-sm text-emerald-300">{message}</p>}
    </div>
  );
}
