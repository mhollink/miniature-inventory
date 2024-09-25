import {
  convertPercentageToColor,
  convertStagesToGradient,
  GradientPart,
  Stage,
} from "../utils/colour.ts";
import { ModelStage } from "@state/inventory";
import useTheme from "@mui/material/styles/useTheme";

export const useWorkflowColors = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const stages: Stage[] = [
    { color: isDarkMode ? "#ff0000" : "#ff6666", stop: 0 }, // Red at 0%
    { color: isDarkMode ? "#ffa500" : "#ffd280", stop: 0.33 }, // Orange at 33%
    { color: isDarkMode ? "#ffff00" : "#ffff99", stop: 0.66 }, // Yellow at 66%
    { color: isDarkMode ? "#00ff00" : "#66ff66", stop: 1 }, // Green at 100%
  ];

  function extracted(steps: number): GradientPart[] {
    return (
      Array
        // Create an array with keys starting from 0 to 'steps'
        .from(Array(steps).keys())
        // Convert each key into a percentage of the total steps
        .map((v, _, a) => (v / a.length) * 100)
        // Convert each step into a color (and keep the percentage in a 0 to 1 format)
        .map((percentage) => ({
          color: convertPercentageToColor(percentage / 100, stages),
          percentage: Number(percentage.toFixed(2)),
        }))
    );
  }

  function getColorForStage(stage: number, stages: number): GradientPart {
    return extracted(stages)[stage];
  }

  function generateGradientInSteps(steps: number) {
    const gradientSteps = extracted(steps)
      // Convert each color into a gradient step (IE. "rgb(255, 0, 0) 0% 8.33%")
      .map(({ percentage, color }, i, a) => {
        const nextPercentage = i + 1 >= a.length ? 100 : a[i + 1].percentage;
        return `${color} ${percentage}% ${nextPercentage}%`;
      });
    // Finally create the gradient which can be used in CSS.
    return `linear-gradient(to right, ${gradientSteps.join(",")})`;
  }

  function convertCollectionToGradient(
    collection: ModelStage[],
    totalWorkflowStages: number,
  ) {
    const summedStages = Object.values(
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

    if (summedStages.length === 0) {
      return "#00ff00";
    }

    // total amount of models in the entire collection
    const totalAmount = summedStages.reduce(
      (acc, item) => acc + item.amount,
      0,
    );
    const colors = extracted(totalWorkflowStages);

    let cumulativePercentage = 0;
    const parts = summedStages.map((item, i) => {
      const percentage = (item.amount / totalAmount) * 100;
      if (i !== 0) cumulativePercentage += percentage;
      return {
        color: colors[item.stage].color,
        percentage: Number(cumulativePercentage.toFixed(2)),
      };
    });
    return convertStagesToGradient(parts);
  }

  return {
    getColorForStage,
    generateGradientInSteps,
    convertCollectionToGradient,
  };
};
