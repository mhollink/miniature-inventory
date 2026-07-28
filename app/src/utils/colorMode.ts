export type ProgressColorMode =
  | "default"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "grayscale";

export type ThemeMode = "dark" | "light";

export type ProgressPalette = {
  empty: string;
  low: string;
  medium: string;
  complete: string;
};

export const PROGRESS_COLOR_PALETTES = {
  default: {
    dark: {
      empty: "#ff0000",
      low: "#ffa500",
      medium: "#ffff00",
      complete: "#00ff00",
    },
    light: {
      empty: "#ff6666",
      low: "#ffd280",
      medium: "#ffff99",
      complete: "#66ff66",
    },
  },

  /*
   * Protanopia affects perception of red.
   * This palette uses a purple-blue-teal-yellow progression.
   */
  protanopia: {
    dark: {
      empty: "#7e03a8",
      low: "#2a788e",
      medium: "#22a884",
      complete: "#fde725",
    },
    light: {
      empty: "#440154",
      low: "#31688e",
      medium: "#26828e",
      complete: "#9c8c00",
    },
  },

  /*
   * Deuteranopia affects perception of green.
   * This palette uses a dark-blue-grey-yellow progression.
   */
  deuteranopia: {
    dark: {
      empty: "#5b6b8c",
      low: "#7a8499",
      medium: "#aaa77a",
      complete: "#ffea46",
    },
    light: {
      empty: "#00204c",
      low: "#414d6b",
      medium: "#7d7c78",
      complete: "#9c8500",
    },
  },

  /*
   * Tritanopia affects perception of blue and yellow.
   * Red, orange, and green provide a more useful distinction here.
   */
  tritanopia: {
    dark: {
      empty: "#ce93d8",
      low: "#ef5350",
      medium: "#ffb74d",
      complete: "#66bb6a",
    },
    light: {
      empty: "#6a1b9a",
      low: "#c62828",
      medium: "#c25d00",
      complete: "#2e7d32",
    },
  },

  grayscale: {
    dark: {
      empty: "#4b5563",
      low: "#6b7280",
      medium: "#9ca3af",
      complete: "#f3f4f6",
    },
    light: {
      empty: "#d1d5db",
      low: "#9ca3af",
      medium: "#6b7280",
      complete: "#1f2937",
    },
  },
} as const satisfies Record<
  ProgressColorMode,
  Record<ThemeMode, ProgressPalette>
>;
