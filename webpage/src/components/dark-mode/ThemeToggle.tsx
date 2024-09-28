import { FormControlLabel, Switch } from "@mui/material";
import { useStore } from "@state/store.ts";
import { selectDarkModeSlice } from "@state/dark-mode";

export const ThemeToggle = () => {
  const state = useStore(selectDarkModeSlice);
  return (
    <FormControlLabel
      control={
        <Switch
          color={"secondary"}
          checked={state.darkMode}
          onChange={() => state.setDarkMode(!state.darkMode)}
        />
      }
      sx={{ mx: 2 }}
      labelPlacement={"start"}
      label="Dark Mode"
    />
  );
};
