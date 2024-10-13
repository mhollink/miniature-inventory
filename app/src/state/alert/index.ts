import { Alerts } from "@components/alerts/alerts.tsx";
import { AppState, Slice } from "../types.ts";

export type AlertState = {
  activeAlert: Alerts | null;
  triggerAlert: (alert: Alerts) => void;
  dismissAlert: () => void;
};

const initialState = {
  activeAlert: null,
};

export const alertSlice: Slice<AlertState> = (set) => ({
  ...initialState,

  triggerAlert: (alert) =>
    set({ activeAlert: alert }, undefined, "TRIGGER_ALERT"),
  dismissAlert: () => set({ activeAlert: null }, undefined, "DISMISS_ALERT"),
});

export const selectAlertSlice = (state: AppState): AlertState => ({
  activeAlert: state.activeAlert,
  triggerAlert: state.triggerAlert,
  dismissAlert: state.dismissAlert,
});
