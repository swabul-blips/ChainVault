import { NextRequest, NextResponse } from "next/server";
import { analyzeWalletCredit } from "@/lib/wallet-score";
import type { Network } from "@/lib/solana-client";

type WalletScoreRequest = {
  walletAddress?: string;
  network?: Network;
};

function isValidNetwork(network: unknown): network is Network {
  return network === "mainnet" || network === "devnet" || network === "localnet";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as WalletScoreRequest;
    const walletAddress = typeof body.walletAddress === "string" ? body.walletAddress.trim() : "";
    const network = isValidNetwork(body.network) ? body.network : "devnet";

    if (!walletAddress) {
      return NextResponse.json({ error: "walletAddress is required" }, { status: 400 });
    }

    const analysis = await analyzeWalletCredit(walletAddress, network);

    return NextResponse.json(
      {
        ...analysis,
        endpoint: "/api/score/wallet",
        source: "solana-rpc",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Wallet score analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze wallet credit" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: "ChainVault wallet credit analysis API",
      version: "1.0.0",
      endpoint: "/api/score/wallet",
      method: "POST",
    },
    { status: 200 },
  );
}