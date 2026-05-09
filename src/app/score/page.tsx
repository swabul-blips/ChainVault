"use client";

import { useMemo, useState } from "react";
import { ChainScoreCard } from "@/components/chain-score-card";
import { NavBar } from "@/components/nav-bar";
import { ScoreProgressCard } from "@/components/score-progress-card";
import { VoiceAlert } from "@/components/voice-alert";
import { useSolanaWallet } from "@/hooks/use-solana-wallet";
import { useChainVaultState } from "@/hooks/use-chainvault-state";
import { applyScoreDelta } from "@/lib/scoring";
import { addNotification, announceVoice, saveState } from "@/lib/storage";
import type { WalletCreditAnalysis } from "@/lib/wallet-score";

export default function ScorePage() {
  const state = useChainVaultState();
  const wallet = useSolanaWallet();
  const score = useMemo(() => state.chainScore || 520, [state.chainScore]);
  const [message, setMessage] = useState("Simulate repayments to update your ChainScore.");
  const [walletAnalysis, setWalletAnalysis] = useState<WalletCreditAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  async function analyzeWallet() {
    const walletAddress = wallet.publicKey?.toBase58();
    if (!walletAddress) {
      setMessage("Connect a wallet first to analyze live Solana signals.");
      return;
    }

    setAnalysisLoading(true);
    try {
      const response = await fetch("/api/score/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress,
          network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet",
        }),
      });

      const data = (await response.json()) as WalletCreditAnalysis | { error?: string };

      if (!response.ok || !("inputs" in data)) {
        setMessage("Wallet analysis failed. Check your RPC connection and try again.");
        return;
      }

      setWalletAnalysis(data);
      saveState({ ...state, chainScore: data.score });
      addNotification({ type: "score", message: `Wallet score updated to ${data.score} from live Solana data.` });
      announceVoice(`Live wallet analysis complete. Score ${data.score}.`);
      setMessage(`Live wallet score: ${data.score} (${data.tier.name}).`);
    } catch (error) {
      console.error("Wallet analysis failed:", error);
      setMessage("Wallet analysis failed.");
    } finally {
      setAnalysisLoading(false);
    }
  }

  function updateScore(delta: number, label: string) {
    const nextScore = applyScoreDelta(score, delta);
    saveState({ ...state, chainScore: nextScore });
    addNotification({ type: "score", message: `${label} updated score to ${nextScore}.` });
    announceVoice(`Your chain score is now ${nextScore}.`);
    setMessage(`${label} applied. New score: ${nextScore}.`);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <NavBar />
      <main className="animate-fade-scale mx-auto grid max-w-6xl gap-6 px-6 py-10 pb-24 md:grid-cols-2 md:pb-10">
        <section className="space-y-6">
          <ScoreProgressCard score={score} />
          <ChainScoreCard score={score} />
          <div className="glass-card animate-rise p-6">
            <h2 className="text-xl font-semibold">Live Wallet Analysis</h2>
            <p className="mt-2 text-sm text-slate-300">
              Pull live Solana signals from the connected wallet and sync them into ChainScore.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={analyzeWallet}
                className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium hover:bg-cyan-500 disabled:opacity-50"
                disabled={analysisLoading}
              >
                {analysisLoading ? "Analyzing wallet..." : "Analyze connected wallet"}
              </button>
            </div>
            {walletAnalysis ? (
              <div className="mt-4 rounded-md border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <p>Signals collected: {walletAnalysis.signals.signatureCount} signatures, {walletAnalysis.signals.uniqueProgramCount} unique programs.</p>
                <p>Balance proxy: {walletAnalysis.signals.solBalance.toFixed(2)} SOL and {walletAnalysis.signals.usdcBalance.toFixed(2)} USDC.</p>
                <p className="mt-2 text-cyan-300">{walletAnalysis.advice}</p>
              </div>
            ) : null}
          </div>
          <div className="glass-card animate-rise p-6">
            <h2 className="text-xl font-semibold">Repayment Impact Simulator</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={() => updateScore(25, "On-time repayment")} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500">
                On-time (+25)
              </button>
              <button onClick={() => updateScore(-15, "Late repayment")} className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium hover:bg-amber-500">
                Late (-15)
              </button>
              <button onClick={() => updateScore(-50, "Default")} className="rounded-md bg-rose-700 px-4 py-2 text-sm font-medium hover:bg-rose-600">
                Default (-50)
              </button>
            </div>
            <p className="mt-4 text-sm text-cyan-300">{message}</p>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold">Score Breakdown</h3>
            <ul className="mt-2 space-y-1 text-xs text-slate-300">
              <li>Repayment history - 35 pts</li>
              <li>DeFi interactions - 22 pts</li>
              <li>Transaction frequency - 18 pts</li>
              <li>Savings consistency - 14 pts</li>
              <li>Wallet age - 11 pts</li>
              <li>Token diversity - 9 pts</li>
              <li>Community vouching - 3 pts</li>
            </ul>
          </div>
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold">Savings History</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {state.vaults.map((vault) => (
                <li key={vault.id} className="rounded-md border border-white/10 p-2">
                  {vault.isCompleted ? "✅" : "🔄"} {vault.name} - {vault.isCompleted ? "Completed (+30pts)" : `Active (${Math.round((vault.currentBalance / vault.targetAmount) * 100)}%)`}
                </li>
              ))}
              {state.vaults.length === 0 ? <li className="text-slate-500">No savings vaults yet.</li> : null}
            </ul>
          </div>
        </section>
        <VoiceAlert />
      </main>
    </div>
  );
}
