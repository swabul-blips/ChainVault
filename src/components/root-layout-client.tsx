"use client";

import { ReactNode } from "react";
import { SolanaProvider } from "./solana-provider";

interface RootLayoutClientProps {
  children: ReactNode;
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as "devnet" | "mainnet-beta" | "testnet") || "devnet";

  return <SolanaProvider network={network}>{children}</SolanaProvider>;
}
