import { PROGRESS_COLOR_PALETTES } from "../utils/colorMode.ts";
import { useStore } from "@state/store.ts";
import { selectWorkflowSlice } from "@state/workflow";

export const useColorTheme = () => {
  const { colorMode } = useStore(selectWorkflowSlice);

  return PROGRESS_COLOR_PALETTES[colorMode] ?? PROGRESS_COLOR_PALETTES.default;
};
