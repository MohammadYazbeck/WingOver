import "server-only";

import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type StoredClaim = {
  code: string;
  sessionId: string;
  dailyKey: string;
  score: number;
  rewardId: string;
  rewardTitle: string;
  createdAt: string;
  expiresAt: string;
  redeemedAt: string | null;
};

type RewardStore = {
  usedSessions: { id: string; usedAt: string }[];
  claims: StoredClaim[];
};

const dataDirectory = process.env.GAME_REWARD_DATA_DIR || path.join(process.cwd(), "data");
const storePath = path.join(dataDirectory, "game-rewards.json");
let queue: Promise<unknown> = Promise.resolve();

async function readStore(): Promise<RewardStore> {
  try {
    return JSON.parse(await readFile(storePath, "utf8")) as RewardStore;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { usedSessions: [], claims: [] };
    throw error;
  }
}

async function writeStore(store: RewardStore) {
  await mkdir(dataDirectory, { recursive: true });
  const temporaryPath = `${storePath}.${process.pid}.tmp`;
  await writeFile(temporaryPath, JSON.stringify(store, null, 2), "utf8");
  await rename(temporaryPath, storePath);
}

export function updateRewardStore<T>(update: (store: RewardStore) => Promise<T> | T): Promise<T> {
  const operation = queue.then(async () => {
    const store = await readStore();
    const cutoff = Date.now() - 8 * 24 * 60 * 60 * 1000;
    store.usedSessions = store.usedSessions.filter(({ usedAt }) => Date.parse(usedAt) >= cutoff);
    store.claims = store.claims.filter(({ expiresAt, redeemedAt }) => Boolean(redeemedAt) || Date.parse(expiresAt) >= cutoff);
    const result = await update(store);
    await writeStore(store);
    return result;
  });
  queue = operation.then(() => undefined, () => undefined);
  return operation;
}
