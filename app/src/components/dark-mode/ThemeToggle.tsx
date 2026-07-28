import { FormControlLabel, Switch } from "@mui/material";
import { useStore } from "@state/store.ts";
import { selectDarkModeSlice } from "@state/dark-mode";
import { selectWorkflowSlice } from "@state/workflow";
import { useWorkflowColors } from "@hooks/useWorkflowColors.ts";
import { useColorTheme } from "@hooks/useColorTheme.ts";

export const ThemeToggle = () => {
  const state = useStore(selectDarkModeSlice);
  const { workflowStages: stages, setWorkflowStages } =
    useStore(selectWorkflowSlice);
  const colors = useWorkflowColors();

  const colorModes = useColorTheme();

  return (
    <FormControlLabel
      control={
        <Switch
          color={"secondary"}
          checked={state.darkMode}
          onChange={() => {
            state.setDarkMode(!state.darkMode);

            setWorkflowStages(
              stages,
              colors.generateRangeOfColors(
                stages.length,
                !state.darkMode ? colorModes.dark : colorModes.light,
              ),
            );
          }}
        />
      }
      sx={{ mx: 2 }}
      labelPlacement={"start"}
      label="Dark Mode"
    />
  );
};
