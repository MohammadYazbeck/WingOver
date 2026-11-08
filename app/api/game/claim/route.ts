import { NextRequest, NextResponse } from "next/server";
import { rewardForScore } from "@/lib/game-rewards";
import { createCouponCode, dailyPlayerKey, verifyGameSessionToken } from "@/lib/game-security";
import { updateRewardStore } from "@/lib/reward-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { token?: unknown; score?: unknown };
    if (typeof body.token !== "string" || !Number.isInteger(body.score) || Number(body.score) < 0) {
      return NextResponse.json({ message: "Invalid reward request." }, { status: 400 });
    }

    const score = Number(body.score);
    const session = verifyGameSessionToken(body.token);
    if (!session) return NextResponse.json({ message: "This game session is invalid." }, { status: 400 });

    const elapsed = Date.now() - session.startedAt;
    const maximumValidScore = Math.floor(elapsed / 100) + 20;
    if (elapsed < 1_000 || elapsed > 10 * 60 * 1000 || score > maximumValidScore) {
      return NextResponse.json({ message: "This score could not be verified." }, { status: 400 });
    }

    const reward = rewardForScore(score);
    const playerId = request.cookies.get("wingover_player")?.value;
    if (!playerId) return NextResponse.json({ message: "Please start a new run before claiming." }, { status: 400 });
    const today = new Date().toISOString().slice(0, 10);
    const playerKey = dailyPlayerKey(playerId, today);

    const result = await updateRewardStore((store) => {
      if (store.usedSessions.some(({ id }) => id === session.id)) {
        return { status: 409, body: { message: "This run has already been checked." } };
      }
      store.usedSessions.push({ id: session.id, usedAt: new Date().toISOString() });

      if (!reward) return { status: 200, body: { eligible: false } };
      const existingClaim = store.claims.find(({ dailyKey }) => dailyKey === playerKey);
      if (existingClaim) {
        return {
          status: 200,
          body: {
            eligible: true,
            alreadyClaimed: true,
            code: existingClaim.code,
            rewardTitle: existingClaim.rewardTitle,
            expiresAt: existingClaim.expiresAt,
          },
        };
      }

      const createdAt = new Date();
      const expiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
      const claim = {
        code: createCouponCode(),
        sessionId: session.id,
        dailyKey: playerKey,
        score,
        rewardId: reward.id,
        rewardTitle: reward.title,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        redeemedAt: null,
      };
      store.claims.push(claim);
      return {
        status: 200,
        body: { eligible: true, code: claim.code, rewardTitle: claim.rewardTitle, expiresAt: claim.expiresAt },
      };
    });

    return NextResponse.json(result.body, { status: result.status, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ message: "The reward could not be processed." }, { status: 500 });
  }
}
