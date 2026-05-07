export type ChainScoreInputs = {
  walletAgeMonths: number;
  transactionFrequency: number;
  transactionVolumeUsd: number;
  defiInteractions: number;
  tokenDiversity: number;
  repaymentHistory: number;
  communityVouching: number;
};

export type ScoreTier = {
  name: "Platinum" | "Gold" | "Silver" | "Bronze" | "No Loan";
  min: number;
  max: number;
  maxLoanUsd: number;
  interestPercent: number;
  color: string;
};

const tiers: ScoreTier[] = [
  { name: "Platinum", min: 750, max: 850, maxLoanUsd: 500, interestPercent: 8, color: "text-cyan-300" },
  { name: "Gold", min: 650, max: 749, maxLoanUsd: 250, interestPercent: 12, color: "text-amber-300" },
  { name: "Silver", min: 500, max: 649, maxLoanUsd: 100, interestPercent: 18, color: "text-slate-300" },
  { name: "Bronze", min: 300, max: 499, maxLoanUsd: 50, interestPercent: 24, color: "text-orange-300" },
  { name: "No Loan", min: 0, max: 299, maxLoanUsd: 0, interestPercent: 0, color: "text-rose-300" },
];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalize(value: number, cap: number): number {
  return clamp(value / cap, 0, 1);
}

export function computeChainScore(inputs: ChainScoreInputs): number {
  const weighted =
    normalize(inputs.walletAgeMonths, 60) * 0.1 +
    normalize(inputs.transactionFrequency, 150) * 0.15 +
    normalize(inputs.transactionVolumeUsd, 6000) * 0.15 +
    normalize(inputs.defiInteractions, 100) * 0.2 +
    normalize(inputs.tokenDiversity, 100) * 0.1 +
    normalize(inputs.repaymentHistory, 100) * 0.25 +
    normalize(inputs.communityVouching, 100) * 0.05;

  return Math.round(clamp(300 + weighted * 550, 0, 850));
}

export function getScoreTier(score: number): ScoreTier {
  return tiers.find((tier) => score >= tier.min && score <= tier.max) ?? tiers[tiers.length - 1];
}

export function applyScoreDelta(currentScore: number, delta: number): number {
  return clamp(currentScore + delta, 0, 850);
}

export function scoreAdvice(score: number): string {
  if (score >= 750) return "Excellent trust profile. You qualify for top-rate lending.";
  if (score >= 650) return "Strong profile. Improve repayment streak for Platinum tier.";
  if (score >= 500) return "Good start. More DeFi consistency can unlock larger loans.";
  if (score >= 300) return "Build trust through smaller repayments and regular activity.";
  return "Not eligible yet. Start with wallet activity and community vouching.";
}
