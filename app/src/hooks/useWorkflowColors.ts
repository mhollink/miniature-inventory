import { convertPercentageToColor, Stage } from "../utils/color.ts";
import useTheme from "@mui/material/styles/useTheme";
import { COLORS } from "../constants.ts";

export const useWorkflowColors = () => {
  const theme = useTheme();
  const themedColors =
    theme.palette.mode === "dark" ? COLORS.dark : COLORS.light;

  function generateRangeOfColors(
    steps: number,
    colors: typeof themedColors = themedColors,
  ): string[] {
    const stages: Stage[] = [
      { color: colors.red, stop: 0 }, // Red at 0%
      { color: colors.orange, stop: 0.33 }, // Orange at 33%
      { color: colors.yellow, stop: 0.66 }, // Yellow at 66%
      { color: colors.green, stop: 1 }, // Green at 100%
    ];

    return (
      Array
        // Create an array with keys starting from 0 to 'steps'
        .from(Array(steps).keys())
        // Convert each key into a percentage of the total steps
        .map((v, _, a) => (v / a.length) * 100)
        // Convert each step into a color (and keep the percentage in a 0 to 1 format)
        .map((percentage) => convertPercentageToColor(percentage / 100, stages))
    );
  }

  function getColorForStage(stage: number, amountOfStages: number): string {
    const gradientParts = generateRangeOfColors(amountOfStages);
    if (stage >= gradientParts.length) return "transparent";
    return gradientParts[stage];
  }

  return {
    getColorForStage,
    generateRangeOfColors,
  };
};
