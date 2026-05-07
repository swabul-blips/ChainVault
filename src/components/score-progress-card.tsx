"use client";

import { useEffect, useState } from "react";

function scoreColor(score: number) {
  if (score < 300) return "#ef4444";
  if (score < 500) return "#f97316";
  if (score < 650) return "#facc15";
  if (score < 750) return "#22c55e";
  return "#14b8a6";
}

export function ScoreProgressCard({ score }: { score: number }) {
  const [animated, setAnimated] = useState(0);
  const pct = Math.max(0, Math.min(100, Math.round((animated / 850) * 100)));
  const color = scoreColor(animated);

  useEffect(() => {
    const id = window.setInterval(() => {
      setAnimated((prev) => {
        if (prev >= score) {
          window.clearInterval(id);
          return score;
        }
        return Math.min(score, prev + 18);
      });
    }, 16);
    return () => window.clearInterval(id);
  }, [score]);

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold">Live Score Gauge</h3>
      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-800">
        <div className="h-full transition-all duration-300" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <p className="mt-2 text-2xl font-bold" style={{ color }}>
        {animated}
      </p>
      <p className="text-sm text-slate-300">
        Fastest improvement action: complete a savings vault (+30) or repay on time (+25).
      </p>
    </div>
  );
}
