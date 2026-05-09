"use client";

import { ReactNode, useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SolanaProvider = dynamic(() => import("./solana-provider").then(mod => ({ default: mod.SolanaProvider })), { ssr: false });

interface RootLayoutClientProps {
  children: ReactNode;
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  const [mounted, setMounted] = useState(false);
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as "devnet" | "mainnet-beta" | "testnet") || "devnet";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <SolanaProvider network={network}>{children}</SolanaProvider>;
}
