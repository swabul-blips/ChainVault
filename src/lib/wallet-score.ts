import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import type { ChainScoreInputs, ScoreTier } from "@/lib/scoring";
import { computeChainScore, getScoreTier, scoreAdvice } from "@/lib/scoring";
import { getConnection, getSolBalance, getUsdcBalance, type Network } from "@/lib/solana-client";

const ANALYSIS_SIGNATURE_LIMIT = 50;
const ANALYSIS_TX_SAMPLE = 10;
const SECONDS_PER_MONTH = 30 * 24 * 60 * 60;

const EXCLUDED_PROGRAMS = new Set([
  "system",
  "computebudget",
  "memo",
  "stake",
  "vote",
  "addresslookuptable",
  "spl-token",
  "spl-token-2022",
  "associatedtokenaccount",
]);

export type WalletCreditSignals = {
  signatureCount: number;
  successfulSignatureCount: number;
  recentSignatureCount: number;
  uniqueProgramCount: number;
  tokenAccountCount: number;
  counterpartyCount: number;
  solBalance: number;
  usdcBalance: number;
};

export type WalletCreditAnalysis = {
  walletAddress: string;
  network: Network;
  score: number;
  tier: ScoreTier;
  advice: string;
  inputs: ChainScoreInputs;
  signals: WalletCreditSignals;
};

type ParsedTransactionLike = {
  transaction?: {
    message?: {
      instructions?: unknown[];
      accountKeys?: unknown[];
    };
  };
};

type ParsedTokenAccountEntry = {
  account?: {
    data?: {
      parsed?: {
        info?: {
          tokenAmount?: {
            uiAmount?: number | null;
          };
        };
      };
    };
  };
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function toBase58(value: unknown): string | null {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toBase58" in value && typeof (value as { toBase58: () => string }).toBase58 === "function") {
    return (value as { toBase58: () => string }).toBase58();
  }
  if (value && typeof value === "object" && "pubkey" in value) {
    const pubkey = (value as { pubkey?: unknown }).pubkey;
    if (pubkey && typeof pubkey === "object" && "toBase58" in pubkey && typeof (pubkey as { toBase58: () => string }).toBase58 === "function") {
      return (pubkey as { toBase58: () => string }).toBase58();
    }
  }
  return null;
}

function normalizeProgramName(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");
}

function analyzeTransactionSample(transactions: ParsedTransactionLike[], walletAddress: string) {
  const programNames = new Set<string>();
  const counterparties = new Set<string>();

  for (const transaction of transactions) {
    const message = transaction?.transaction?.message;
    const instructions = Array.isArray(message?.instructions) ? message.instructions : [];
    const accountKeys = Array.isArray(message?.accountKeys) ? message.accountKeys : [];

    for (const instruction of instructions) {
      const program = normalizeProgramName(instruction?.program ?? instruction?.programId);
      if (program && !EXCLUDED_PROGRAMS.has(program)) {
        programNames.add(program);
      }

      const accounts = Array.isArray(instruction?.accounts) ? instruction.accounts : [];
      for (const account of accounts) {
        const address = toBase58(account);
        if (address && address !== walletAddress) {
          counterparties.add(address);
        }
      }
    }

    for (const accountKey of accountKeys) {
      const address = toBase58(accountKey);
      if (address && address !== walletAddress) {
        counterparties.add(address);
      }
    }
  }

  return {
    uniqueProgramCount: programNames.size,
    counterpartyCount: counterparties.size,
  };
}

function buildInputsFromSignals(signals: WalletCreditSignals, walletAgeMonths: number): ChainScoreInputs {
  return {
    walletAgeMonths,
    transactionFrequency: clamp(signals.recentSignatureCount * 12, 0, 150),
    transactionVolumeUsd: clamp(Math.round(signals.solBalance * 160 + signals.usdcBalance + signals.tokenAccountCount * 25), 0, 6000),
    defiInteractions: clamp(signals.uniqueProgramCount * 14 + signals.recentSignatureCount * 2, 0, 100),
    tokenDiversity: clamp(signals.tokenAccountCount * 12, 0, 100),
    repaymentHistory: signals.signatureCount > 0 ? clamp(Math.round((signals.successfulSignatureCount / signals.signatureCount) * 100), 0, 100) : 0,
    communityVouching: clamp(signals.counterpartyCount * 4 + signals.tokenAccountCount * 2, 0, 100),
  };
}

export async function analyzeWalletCredit(walletAddress: string, network: Network = "devnet"): Promise<WalletCreditAnalysis> {
  const publicKey = new PublicKey(walletAddress);
  const connection = getConnection(network);

  const emptyTokenAccounts: { value: ParsedTokenAccountEntry[] } = { value: [] };

  const [signatures, solBalance, usdcBalance, tokenAccountsResponse] = await Promise.all([
    connection.getSignaturesForAddress(publicKey, { limit: ANALYSIS_SIGNATURE_LIMIT }, "confirmed"),
    getSolBalance(connection, publicKey),
    getUsdcBalance(connection, publicKey, network),
    connection.getParsedTokenAccountsByOwner(publicKey, { programId: TOKEN_PROGRAM_ID }).catch(() => emptyTokenAccounts),
  ]);

  const signatureCount = signatures.length;
  const successfulSignatureCount = signatures.filter((signature) => !signature.err).length;
  const recentWindow = Math.floor(Date.now() / 1000) - SECONDS_PER_MONTH;
  const recentSignatureCount = signatures.filter((signature) => (signature.blockTime ?? 0) >= recentWindow).length;

  const oldestSignature = signatures.reduce<number | null>((oldest, signature) => {
    if (!signature.blockTime) return oldest;
    if (oldest === null) return signature.blockTime;
    return Math.min(oldest, signature.blockTime);
  }, null);

  const parsedTransactions = signatureCount
    ? await connection.getParsedTransactions(
        signatures.slice(0, ANALYSIS_TX_SAMPLE).map((signature) => signature.signature),
        { maxSupportedTransactionVersion: 0 },
      ).catch(() => [])
    : [] as ParsedTransactionLike[];

  const sampleSignals = analyzeTransactionSample(parsedTransactions as ParsedTransactionLike[], walletAddress);
  const tokenAccountCount = tokenAccountsResponse.value.filter((entry: ParsedTokenAccountEntry) => {
    const uiAmount = entry?.account?.data?.parsed?.info?.tokenAmount?.uiAmount ?? 0;
    return uiAmount > 0;
  }).length;

  const signals: WalletCreditSignals = {
    signatureCount,
    successfulSignatureCount,
    recentSignatureCount,
    uniqueProgramCount: sampleSignals.uniqueProgramCount,
    tokenAccountCount,
    counterpartyCount: sampleSignals.counterpartyCount,
    solBalance,
    usdcBalance,
  };

  const walletAgeMonths = oldestSignature ? clamp(Math.round((Date.now() / 1000 - oldestSignature) / SECONDS_PER_MONTH), 0, 60) : 0;
  const inputs = buildInputsFromSignals(signals, walletAgeMonths);
  const score = computeChainScore(inputs);
  const tier = getScoreTier(score);

  return {
    walletAddress,
    network,
    score,
    tier,
    advice: scoreAdvice(score),
    inputs,
    signals,
  };
}