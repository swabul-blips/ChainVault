"use client";

import { useEffect } from "react";
import { useChainVaultState } from "@/hooks/use-chainvault-state";
import { updateState } from "@/lib/storage";

export function ThemeToggle() {
  const state = useChainVaultState();
  const theme = state.preferences.theme;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <button
      type="button"
      className="rounded-full border border-white/20 px-3 py-1 text-xs text-slate-200 hover:bg-white/10"
      onClick={() =>
        updateState((current) => ({
          ...current,
          preferences: { ...current.preferences, theme: theme === "dark" ? "light" : "dark" },
        }))
      }
    >
      {theme === "dark" ? "Light" : "Dark"} mode
    </button>
  );
}
