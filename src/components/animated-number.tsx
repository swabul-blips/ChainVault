"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
};

export function AnimatedNumber({ value, prefix = "", suffix = "", durationMs = 700 }: Props) {
  const [displayValue, setDisplayValue] = useState(0);
  const previousRef = useRef(0);

  useEffect(() => {
    const from = previousRef.current;
    const to = value;
    const start = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const next = Math.round(from + (to - from) * progress);
      setDisplayValue(next);
      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      } else {
        previousRef.current = to;
      }
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [durationMs, value]);

  return (
    <span>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  );
}
