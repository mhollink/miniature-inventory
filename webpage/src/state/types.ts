import { StateCreator } from "zustand";
import { ModalState } from "./modal";
import { AlertState } from "./alert";
import { DrawerState } from "./drawer";
import { DarkModeState } from "@state/dark-mode";
import { InventoryState } from "@state/inventory";
import { WorkflowState } from "@state/workflow";
import { AccountState } from "@state/account";

export type AppState = DarkModeState &
  ModalState &
  AlertState &
  DrawerState &
  InventoryState &
  WorkflowState &
  AccountState;

export type StoreKey = keyof AppState;

export type Slice<T> = StateCreator<
  AppState,
  [["zustand/devtools", unknown], ["zustand/persist", unknown]],
  [],
  T
>;
