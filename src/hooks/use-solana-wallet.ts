import { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getUsdcBalance, getSolBalance } from "@/lib/solana-client";

export interface WalletBalance {
  sol: number;
  usdc: number;
  loading: boolean;
}

export function useSolanaWallet() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [balances, setBalances] = useState<WalletBalance>({
    sol: 0,
    usdc: 0,
    loading: false,
  });

  const refreshBalances = useCallback(async () => {
    if (!wallet.publicKey) {
      setBalances({ sol: 0, usdc: 0, loading: false });
      return;
    }

    setBalances((prev) => ({ ...prev, loading: true }));
    try {
      const [sol, usdc] = await Promise.all([
        getSolBalance(connection, wallet.publicKey),
        getUsdcBalance(connection, wallet.publicKey, (process.env.NEXT_PUBLIC_SOLANA_NETWORK as "mainnet" | "devnet" | "localnet") || "devnet"),
      ]);
      setBalances({ sol, usdc, loading: false });
    } catch (error) {
      console.error("Failed to fetch balances:", error);
      setBalances({ sol: 0, usdc: 0, loading: false });
    }
  }, [wallet.publicKey, connection]);

  useEffect(() => {
    refreshBalances();
    const interval = setInterval(refreshBalances, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [refreshBalances]);

  return {
    ...wallet,
    balances,
    refreshBalances,
  };
}
