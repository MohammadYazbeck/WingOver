import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createGameSessionToken } from "@/lib/game-security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { token } = createGameSessionToken();
    const response = NextResponse.json({ token }, { headers: { "Cache-Control": "no-store" } });
    if (!request.cookies.get("wingover_player")?.value) {
      response.cookies.set("wingover_player", randomBytes(18).toString("base64url"), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 365 * 24 * 60 * 60,
      });
    }
    return response;
  } catch {
    return NextResponse.json({ message: "Rewards are temporarily unavailable." }, { status: 503 });
  }
}
