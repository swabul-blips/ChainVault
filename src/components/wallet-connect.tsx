"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSolanaWallet } from "@/hooks/use-solana-wallet";

export function WalletConnect() {
  const wallet = useWallet();
  const { balances } = useSolanaWallet();

  return (
    <div className="flex items-center gap-2">
      {wallet.publicKey && !balances.loading && (
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
          <span className="px-2 py-1 rounded-md bg-slate-800/70 border border-white/10">
            {balances.sol.toFixed(3)} SOL
          </span>
          <span className="px-2 py-1 rounded-md bg-slate-800/70 border border-white/10">
            {balances.usdc.toFixed(2)} USDC
          </span>
        </div>
      )}
      <WalletMultiButton
        style={{
          height: "2rem",
          fontSize: "0.75rem",
          padding: "0 0.75rem",
          borderRadius: "9999px",
          background: "linear-gradient(120deg, #0891b2, #2563eb)",
          border: "none",
          fontFamily: "inherit",
          whiteSpace: "nowrap",
        }}
      />
    </div>
  );
}
