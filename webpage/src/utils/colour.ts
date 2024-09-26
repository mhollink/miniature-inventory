export type RGB = { r: number; g: number; b: number };
export type Stage = { color: string; stop: number };
export type GradientPart = { color: string; percentage: number };

export function convertStagesToGradient(parts: GradientPart[]) {
  const gradientSteps = parts
    // Convert each color into a gradient step (IE. "rgb(255, 0, 0) 0% 8.33%")
    .map(({ percentage, color }, i, a) => {
      const prevPercentage = i === 0 ? 0 : a[i - 1].percentage;
      const nextPercentage = i + 1 >= a.length ? 100 : percentage;
      return `${color} ${prevPercentage}% ${nextPercentage}%`;
    });
  // Finally create the gradient which can be used in CSS.
  return `linear-gradient(to right, ${gradientSteps.join(",")})`;
}

export function convertPercentageToColor(percentage: number, stages: Stage[]) {
  return interpolateMultiColor(percentage, stages);
}

function interpolateMultiColor(percentage: number, stages: Stage[]): string {
  // Ensure percentage is between 0 and 1
  percentage = Math.max(0, Math.min(1, percentage));

  // Find the two colors between which the percentage falls
  let lowerStage: Stage | undefined, upperStage: Stage | undefined;
  for (let i = 0; i < stages.length - 1; i++) {
    if (percentage >= stages[i].stop && percentage <= stages[i + 1].stop) {
      lowerStage = stages[i];
      upperStage = stages[i + 1];
      break;
    }
  }

  if (!lowerStage || !upperStage) {
    throw new Error("Invalid percentage range");
  }

  const rangePercentage =
    (percentage - lowerStage.stop) / (upperStage.stop - lowerStage.stop);

  return interpolateColor(lowerStage.color, upperStage.color, rangePercentage);
}

function interpolateColor(
  color1: string,
  color2: string,
  percentage: number,
): string {
  const color1RGB = hexToRgb(color1);
  const color2RGB = hexToRgb(color2);

  const r = Math.round(color1RGB.r + (color2RGB.r - color1RGB.r) * percentage);
  const g = Math.round(color1RGB.g + (color2RGB.g - color1RGB.g) * percentage);
  const b = Math.round(color1RGB.b + (color2RGB.b - color1RGB.b) * percentage);

  return `rgb(${r}, ${g}, ${b})`;
}

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): RGB {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}
