import { ModelStage } from "@state/inventory";

export const calculateSumForEachStage = (
  collection: ModelStage[],
): ModelStage[] => {
  return Object.values(
    collection.reduce(
      (acc, item) => {
        if (!acc[item.stage]) {
          acc[item.stage] = { stage: item.stage, amount: 0 };
        }
        acc[item.stage].amount += item.amount;
        return acc;
      },
      {} as Record<string, { amount: number; stage: number }>,
    ),
  ).sort((a, b) => a.stage - b.stage);
};
