"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { computeChainScore, getScoreTier } from "@/lib/scoring";
import { addNotification, announceVoice, getState, updateState } from "@/lib/storage";

export function LoanWizard() {
  const current = getState();
  const [walletAddress, setWalletAddress] = useState(current.walletAddress || "wallet_uganda_001");
  const [walletAgeMonths, setWalletAgeMonths] = useState(12);
  const [transactionFrequency, setTransactionFrequency] = useState(30);
  const [transactionVolumeUsd, setTransactionVolumeUsd] = useState(500);
  const [defiInteractions, setDefiInteractions] = useState(60);
  const [tokenDiversity, setTokenDiversity] = useState(40);
  const [repaymentHistory, setRepaymentHistory] = useState(55);
  const [communityVouching, setCommunityVouching] = useState(70);
  const [amount, setAmount] = useState(80);
  const [termDays, setTermDays] = useState(30);
  const [message, setMessage] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const computedScore = useMemo(
    () =>
      computeChainScore({
        walletAgeMonths,
        transactionFrequency,
        transactionVolumeUsd,
        defiInteractions,
        tokenDiversity,
        repaymentHistory,
        communityVouching,
      }),
    [
      communityVouching,
      defiInteractions,
      repaymentHistory,
      tokenDiversity,
      transactionFrequency,
      transactionVolumeUsd,
      walletAgeMonths,
    ],
  );

  const tier = getScoreTier(computedScore);

  function handleApplyLoan() {
    const safeAmount = Number.isFinite(amount) ? amount : 0;
    const safeTerm = Number.isFinite(termDays) ? termDays : 0;
    const trimmedWallet = walletAddress.trim();

    if (!trimmedWallet) {
      setMessage("Wallet address is required.");
      setRejectionReason("");
      return;
    }
    if (safeAmount <= 0 || safeTerm <= 0) {
      setMessage("Loan amount and term must be greater than zero.");
      setRejectionReason("");
      return;
    }
    if (tier.maxLoanUsd === 0) {
      setMessage("Loan not approved.");
      setRejectionReason(
        `Your score is ${computedScore}. You need stronger activity before borrowing. Start a savings vault to build trust and add +30 on completion.`,
      );
      return;
    }
    if (safeAmount > tier.maxLoanUsd) {
      setMessage("Loan not approved.");
      setRejectionReason(
        `Your score is ${computedScore}. ${tier.name} tier max is $${tier.maxLoanUsd}, but you requested $${safeAmount}.`,
      );
      return;
    }

    updateState((state) => ({
      ...state,
      walletAddress: trimmedWallet,
      chainScore: computedScore,
      onboardingStep: (state.onboardingStep < 3 ? 3 : state.onboardingStep) as 1 | 2 | 3 | 4,
      totalLoansIssued: state.totalLoansIssued + safeAmount,
      loans: [
        {
          borrower: trimmedWallet,
          amount: safeAmount,
          termDays: safeTerm,
          interestPercent: tier.interestPercent,
          status: "Active" as const,
          createdAt: new Date().toISOString(),
        },
        ...state.loans,
      ],
    }));
    addNotification({
      type: "loan",
      message: `Loan approved for ${trimmedWallet}: $${safeAmount} over ${safeTerm} days.`,
    });
    announceVoice(`Congratulations. Your loan of ${safeAmount} dollars has been approved.`);
    setRejectionReason("");
    setMessage(`Loan approved: $${safeAmount} for ${safeTerm} days at ${tier.interestPercent}% interest.`);
  }

  return (
    <div className="glass-card animate-rise grid gap-5 p-6">
      <h3 className="text-xl font-semibold">Loan Application Wizard</h3>
      <label className="text-sm text-slate-300">
        Wallet Address
        <input className="input-field mt-1" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        <NumberField label="Wallet age (months)" value={walletAgeMonths} setValue={setWalletAgeMonths} />
        <NumberField label="Transaction frequency" value={transactionFrequency} setValue={setTransactionFrequency} />
        <NumberField label="Transaction volume (USD)" value={transactionVolumeUsd} setValue={setTransactionVolumeUsd} />
        <NumberField label="DeFi interactions" value={defiInteractions} setValue={setDefiInteractions} />
        <NumberField label="Token diversity" value={tokenDiversity} setValue={setTokenDiversity} />
        <NumberField label="Repayment history" value={repaymentHistory} setValue={setRepaymentHistory} />
        <NumberField label="Community vouching" value={communityVouching} setValue={setCommunityVouching} />
      </div>
      <p className="text-sm text-cyan-300">
        Computed ChainScore: {computedScore} ({tier.name})
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        <NumberField label="Loan amount (USDC)" value={amount} setValue={setAmount} />
        <NumberField label="Term (days)" value={termDays} setValue={setTermDays} />
      </div>
      <button type="button" className="btn-primary w-fit text-sm font-medium" onClick={handleApplyLoan}>
        Review & Sign (Simulated)
      </button>
      {message && <p className="text-sm text-emerald-300">{message}</p>}
      {rejectionReason ? (
        <div className="rounded-md border border-rose-400/30 bg-rose-500/10 p-3 text-sm">
          <p className="text-rose-200">{rejectionReason}</p>
          <div className="mt-2 flex gap-2">
            <Link href="/save/new" className="btn-primary text-xs">
              Start saving toward your goal
            </Link>
            <Link href="/score" className="rounded-md border border-white/20 px-3 py-2 text-xs">
              Improve your score
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function NumberField({
  label,
  value,
  setValue,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
}) {
  return (
    <label className="text-sm text-slate-300">
      {label}
      <input className="input-field mt-1" type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} />
    </label>
  );
}
