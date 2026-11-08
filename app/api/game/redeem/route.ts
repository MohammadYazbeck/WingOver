import { NextRequest, NextResponse } from "next/server";
import { validAdminKey } from "@/lib/game-security";
import { updateRewardStore } from "@/lib/reward-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!validAdminKey(request.headers.get("authorization"))) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json() as { code?: unknown };
  if (typeof body.code !== "string") return NextResponse.json({ message: "Code is required." }, { status: 400 });
  const normalizedCode = body.code.trim().toUpperCase();

  const result = await updateRewardStore((store) => {
    const claim = store.claims.find(({ code }) => code === normalizedCode);
    if (!claim) return { status: 404, body: { message: "Code not found." } };
    if (claim.redeemedAt) return { status: 409, body: { message: "Code already redeemed.", claim } };
    if (Date.parse(claim.expiresAt) < Date.now()) return { status: 410, body: { message: "Code expired.", claim } };
    claim.redeemedAt = new Date().toISOString();
    return { status: 200, body: { message: "Reward redeemed.", claim } };
  });

  return NextResponse.json(result.body, { status: result.status, headers: { "Cache-Control": "no-store" } });
}
