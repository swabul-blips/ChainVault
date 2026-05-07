"use client";

import { useState } from "react";
import { addNotification, announceVoice, updateState } from "@/lib/storage";

const chains = ["Ethereum", "Base", "Arbitrum", "Polygon", "BNB Chain"] as const;

export function LiFiBridgeWidget() {
  const [fromChain, setFromChain] = useState<(typeof chains)[number]>("Ethereum");
  const [amount, setAmount] = useState(100);
  const [status, setStatus] = useState("");

  function simulateBridge() {
    const safeAmount = Number.isFinite(amount) ? amount : 0;
    if (safeAmount <= 0) {
      setStatus("Bridge amount must be greater than zero.");
      return;
    }
    const routeId = `route_${Math.random().toString(36).slice(2, 8)}`;
    updateState((state) => ({
      ...state,
      totalDeposits: state.totalDeposits + safeAmount,
      bridgeEvents: [
        {
          fromChain,
          toChain: "Solana",
          token: "USDC",
          amount: safeAmount,
          routeId,
          createdAt: new Date().toISOString(),
        },
        ...state.bridgeEvents,
      ],
    }));
    addNotification({
      type: "pool",
      message: `${safeAmount} USDC bridged from ${fromChain} to Solana pool (${routeId}).`,
    });
    announceVoice(`Bridge route ready. ${safeAmount} dollars moved from ${fromChain} to Solana.`);
    setStatus(`Route ${routeId} simulated. ${safeAmount} USDC bridged to Solana lending pool.`);
  }

  return (
    <div className="glass-card animate-rise p-6">
      <h3 className="text-xl font-semibold">LI.FI Bridge Widget (Simulated)</h3>
      <div className="mt-4 grid gap-3">
        <label className="text-sm text-slate-300">
          From Chain
          <select
            className="input-field mt-1"
            value={fromChain}
            onChange={(e) => setFromChain(e.target.value as (typeof chains)[number])}
          >
            {chains.map((chain) => (
              <option key={chain} value={chain}>
                {chain}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-slate-300">
          To Chain
          <input className="input-field mt-1" value="Solana" readOnly />
        </label>
        <label className="text-sm text-slate-300">
          Token
          <input className="input-field mt-1" value="USDC" readOnly />
        </label>
        <label className="text-sm text-slate-300">
          Amount
          <input className="input-field mt-1" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        </label>
      </div>
      <button type="button" className="btn-primary mt-4 text-sm font-medium" onClick={simulateBridge}>
        Get Route
      </button>
      {status && <p className="mt-3 text-sm text-emerald-300">{status}</p>}
    </div>
  );
}
