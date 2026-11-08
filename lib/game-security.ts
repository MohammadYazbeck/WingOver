import "server-only";

import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

type GameSession = { version: 1; id: string; startedAt: number };

function rewardSecret() {
  const secret = process.env.GAME_REWARD_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return "wingover-local-development-secret";
  throw new Error("GAME_REWARD_SECRET is not configured");
}

function signature(value: string) {
  return createHmac("sha256", rewardSecret()).update(value).digest("base64url");
}

export function createGameSessionToken() {
  const session: GameSession = {
    version: 1,
    id: randomBytes(18).toString("base64url"),
    startedAt: Date.now(),
  };
  const encoded = Buffer.from(JSON.stringify(session)).toString("base64url");
  return { session, token: `${encoded}.${signature(encoded)}` };
}

export function verifyGameSessionToken(token: string): GameSession | null {
  const [encoded, suppliedSignature, extra] = token.split(".");
  if (!encoded || !suppliedSignature || extra) return null;
  const expectedSignature = signature(encoded);
  const expected = Buffer.from(expectedSignature);
  const supplied = Buffer.from(suppliedSignature);
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;

  try {
    const session = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as GameSession;
    if (session.version !== 1 || typeof session.id !== "string" || !Number.isFinite(session.startedAt)) return null;
    return session;
  } catch {
    return null;
  }
}

export function createCouponCode() {
  return `WO-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export function dailyPlayerKey(playerId: string, date: string) {
  return createHash("sha256")
    .update(`${rewardSecret()}|${playerId}|${date}`)
    .digest("hex");
}

export function validAdminKey(value: string | null) {
  const expectedValue = process.env.GAME_REWARD_ADMIN_KEY;
  if (!expectedValue || !value?.startsWith("Bearer ")) return false;
  const expected = Buffer.from(expectedValue);
  const supplied = Buffer.from(value.slice(7));
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}
