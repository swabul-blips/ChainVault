"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useSolanaWallet } from "@/hooks/use-solana-wallet";

export function WalletConnect() {
  const wallet = useWallet();
  const { balances } = useSolanaWallet();

  return (
    <div className="flex items-center gap-2">
      {wallet.publicKey && (
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="px-2 py-1 rounded bg-slate-800/50">
            {balances.sol.toFixed(2)} SOL
          </span>
          <span className="px-2 py-1 rounded bg-slate-800/50">
            ${balances.usdc.toFixed(2)} USDC
          </span>
        </div>
      )}
      <WalletMultiButton />
    </div>
  );
}
