import { AppState, Slice } from "@state/types.ts";

export type DarkModeState = {
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
};

const initialState = {
  darkMode: true,
};

export const darkModeSlice: Slice<DarkModeState> = (set) => ({
  ...initialState,

  setDarkMode: (enabled: boolean) =>
    set({ darkMode: enabled }, undefined, "SET_DARK_MODE"),
});

export const selectDarkModeSlice = (state: AppState): DarkModeState => ({
  darkMode: state.darkMode,
  setDarkMode: state.setDarkMode,
});
