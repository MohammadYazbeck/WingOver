export type RewardTier = {
  id: "sauce" | "fries" | "discount";
  minScore: number;
  title: string;
  detail: string;
};

export const rewardTiers: readonly RewardTier[] = [
  { id: "sauce", minScore: 250, title: "Free sauce", detail: "With any order" },
  { id: "fries", minScore: 450, title: "Free fries", detail: "With any main order" },
  { id: "discount", minScore: 700, title: "10% off", detail: "One order" },
] as const;

export function rewardForScore(score: number) {
  return [...rewardTiers].reverse().find((tier) => score >= tier.minScore) ?? null;
}

export function nextRewardForScore(score: number) {
  return rewardTiers.find((tier) => score < tier.minScore) ?? null;
}
