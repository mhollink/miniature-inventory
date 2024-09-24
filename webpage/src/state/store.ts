import { AppState } from "./types.ts";
import { devtools, persist } from "zustand/middleware";
import { create } from "zustand";
import { persistOptions } from "./persistence.ts";
import { alertSlice } from "./alert";
import { modalSlice } from "./modal";
import { drawerSlice } from "./drawer";
import { darkModeSlice } from "@state/dark-mode";

export const useStore = create<
  AppState,
  [["zustand/devtools", unknown], ["zustand/persist", unknown]]
>(
  devtools(
    persist(
      (...args) => ({
        ...darkModeSlice(...args),
        ...alertSlice(...args),
        ...modalSlice(...args),
        ...drawerSlice(...args),
      }),
      persistOptions,
    ),
  ),
);
