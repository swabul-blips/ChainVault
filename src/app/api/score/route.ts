import { NextRequest, NextResponse } from "next/server";
import type { ChainScoreInputs } from "@/lib/scoring";
import { computeChainScore, getScoreTier, scoreAdvice } from "@/lib/scoring";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChainScoreInputs;

    // Validate inputs
    if (
      typeof body.walletAgeMonths !== "number" ||
      typeof body.transactionFrequency !== "number" ||
      typeof body.transactionVolumeUsd !== "number" ||
      typeof body.defiInteractions !== "number" ||
      typeof body.tokenDiversity !== "number" ||
      typeof body.repaymentHistory !== "number" ||
      typeof body.communityVouching !== "number"
    ) {
      return NextResponse.json(
        { error: "Invalid input parameters" },
        { status: 400 },
      );
    }

    const score = computeChainScore(body);
    const tier = getScoreTier(score);
    const advice = scoreAdvice(score);

    return NextResponse.json(
      {
        score,
        tier,
        advice,
        inputs: body,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Score calculation error:", error);
    return NextResponse.json(
      { error: "Failed to calculate score" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: "ChainVault Credit Scoring API",
      version: "1.0.0",
      endpoint: "/api/score",
      method: "POST",
    },
    { status: 200 },
  );
}
