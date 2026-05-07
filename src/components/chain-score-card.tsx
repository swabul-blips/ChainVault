import { getScoreTier, scoreAdvice } from "@/lib/scoring";

type Props = {
  score: number;
};

export function ChainScoreCard({ score }: Props) {
  const tier = getScoreTier(score);

  return (
    <div className="glass-card animate-rise p-6">
      <p className="text-sm text-slate-300">ChainScore</p>
      <p className="animate-glow text-4xl font-bold text-cyan-300">{score}</p>
      <p className={`mt-2 text-sm font-medium ${tier.color}`}>Tier: {tier.name}</p>
      <p className="mt-3 text-sm text-slate-400">{scoreAdvice(score)}</p>
      <p className="mt-3 text-sm text-slate-300">
        Max loan: ${tier.maxLoanUsd} | Interest: {tier.interestPercent}%
      </p>
    </div>
  );
}
