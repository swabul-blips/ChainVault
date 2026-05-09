import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAssociatedTokenAddress, getMint } from "@solana/spl-token";

export type Network = "mainnet" | "devnet" | "localnet";

export const NETWORKS = {
  mainnet: "https://api.mainnet-beta.solana.com",
  devnet: "https://api.devnet.solana.com",
  localnet: "http://localhost:8899",
} as const;

export function getConnection(network: Network = "devnet"): Connection {
  return new Connection(NETWORKS[network], "confirmed");
}

export function getUsdcMint(network: Network = "devnet"): PublicKey {
  const USDC_MINT = new PublicKey("EPjFWaLb3odccxFSrv3C6MrT3AxYqP1Vm2KaMtWvcs"); // USDC on mainnet
  const USDC_MINT_DEVNET = new PublicKey("4zMMC9srt5Ri5X14GAgIYY3W6YvV3BJKBjAPtVooS6T"); // USDC on devnet
  return network === "mainnet" ? USDC_MINT : USDC_MINT_DEVNET;
}

export async function getUsdcBalance(
  connection: Connection,
  walletAddress: PublicKey,
  network: Network = "devnet",
): Promise<number> {
  try {
    const usdcMint = getUsdcMint(network);
    const ata = await getAssociatedTokenAddress(usdcMint, walletAddress);
    const balance = await connection.getTokenAccountBalance(ata);
    return balance.value.uiAmount ?? 0;
  } catch {
    return 0;
  }
}

export async function getSolBalance(connection: Connection, walletAddress: PublicKey): Promise<number> {
  try {
    const balance = await connection.getBalance(walletAddress);
    return balance / LAMPORTS_PER_SOL;
  } catch {
    return 0;
  }
}

export function validatePublicKey(address: string): PublicKey | null {
  try {
    return new PublicKey(address);
  } catch {
    return null;
  }
}

export async function confirmTransaction(
  connection: Connection,
  signature: string,
  timeout: number = 30000,
): Promise<boolean> {
  try {
    const status = await connection.confirmTransaction(signature, "confirmed");
    return !status.value.err;
  } catch {
    return false;
  }
}
