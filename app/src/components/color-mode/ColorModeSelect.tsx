import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from "@mui/material";
import { useStore } from "@state/store.ts";
import { selectWorkflowSlice } from "@state/workflow";
import { ProgressColorMode } from "../../utils/colorMode.ts";

export const PROGRESS_COLOR_MODE_OPTIONS = [
  {
    value: "default",
    label: "Standard colors",
  },
  {
    value: "protanopia",
    label: "Red-green: red-sensitive palette",
  },
  {
    value: "deuteranopia",
    label: "Red-green: green-sensitive palette",
  },
  {
    value: "tritanopia",
    label: "Blue-yellow palette",
  },
  {
    value: "grayscale",
    label: "Grayscale",
  },
] as const satisfies ReadonlyArray<{
  value: ProgressColorMode;
  label: string;
}>;

export const ColorModeSelect = () => {
  const { colorMode, setColorMode } = useStore(selectWorkflowSlice);

  const handleChange = (event: SelectChangeEvent<ProgressColorMode>) => {
    setColorMode(event.target.value as ProgressColorMode);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="progress-color-palette-label">
        Progress color palette
      </InputLabel>

      <Select<ProgressColorMode>
        labelId="progress-color-palette-label"
        id="progress-color-palette"
        value={colorMode}
        label="Progress color palette"
        onChange={handleChange}
      >
        {PROGRESS_COLOR_MODE_OPTIONS.map(({ value, label }) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>

      <FormHelperText>
        Choose the progress colors that are easiest for you to distinguish.
      </FormHelperText>
    </FormControl>
  );
};
