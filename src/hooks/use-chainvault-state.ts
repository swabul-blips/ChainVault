"use client";

import { useEffect, useState } from "react";
import { getState, subscribeState, type ChainVaultState } from "@/lib/storage";

export function useChainVaultState() {
  const [state, setState] = useState<ChainVaultState>(() => getState());

  useEffect(() => {
    return subscribeState((next) => setState(next));
  }, []);

  return state;
}
