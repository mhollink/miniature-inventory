import { AppState, Slice } from "../types.ts";
import { ProgressColorMode } from "../../utils/colorMode.ts";

export type WorkflowState = {
  workflowStages: string[];
  workflowColors: string[];
  colorMode: ProgressColorMode;
  setWorkflowStages: (stages: string[], colors: string[]) => void;
  dismissedDefaultWorkflowAlert: boolean;
  setDismissedDefaultWorkflowAlert: (value: boolean) => void;
  setColorMode: (mode: ProgressColorMode) => void;
};

const initialState: Pick<
  WorkflowState,
  | "workflowStages"
  | "workflowColors"
  | "colorMode"
  | "dismissedDefaultWorkflowAlert"
> = {
  workflowStages: [
    "Unfinished",
    "Assembled",
    "Primed",
    "Battle Ready",
    "Parade Ready",
  ],
  workflowColors: [
    "rgb(255, 0, 0)",
    "rgb(255, 100, 0)",
    "rgb(255, 184, 0)",
    "rgb(255, 239, 0)",
    "rgb(150, 255, 0)",
  ],
  colorMode: "default",
  dismissedDefaultWorkflowAlert: false,
};

export const workflowSlice: Slice<WorkflowState> = (set) => ({
  ...initialState,

  setWorkflowStages: (stages, colors) => {
    set(
      { workflowStages: stages, workflowColors: colors },
      undefined,
      "SET_WORKFLOW",
    );
  },
  setDismissedDefaultWorkflowAlert: (value) => {
    set(
      { dismissedDefaultWorkflowAlert: value },
      undefined,
      "SET_WORKFLOW_ALERT",
    );
  },
  setColorMode: (value) => {
    set({ colorMode: value }, undefined, "SET_COLOR_MODE");
  },
});

export const selectWorkflowSlice = (state: AppState): WorkflowState => ({
  workflowStages: state.workflowStages,
  workflowColors: state.workflowColors,
  colorMode: state.colorMode,
  setWorkflowStages: state.setWorkflowStages,
  dismissedDefaultWorkflowAlert: state.dismissedDefaultWorkflowAlert,
  setDismissedDefaultWorkflowAlert: state.setDismissedDefaultWorkflowAlert,
  setColorMode: state.setColorMode,
});
