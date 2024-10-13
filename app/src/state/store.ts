import { AppState } from "./types.ts";
import { devtools, persist } from "zustand/middleware";
import { create } from "zustand";
import { persistOptions } from "./persistence.ts";
import { alertSlice } from "./alert";
import { modalSlice } from "./modal";
import { drawerSlice } from "./drawer";
import { darkModeSlice } from "@state/dark-mode";
import { inventorySlice } from "@state/inventory";
import { workflowSlice } from "@state/workflow";
import { accountSlice } from "@state/account";
import { paintsSlice } from "@state/paints";

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
        ...inventorySlice(...args),
        ...workflowSlice(...args),
        ...accountSlice(...args),
        ...paintsSlice(...args),
      }),
      persistOptions,
    ),
  ),
);
