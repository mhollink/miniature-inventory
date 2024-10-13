import { AppState, Slice } from "../types.ts";

export type WorkflowState = {
  workflowStages: string[];
  workflowColors: string[];
  setWorkflowStages: (stages: string[], colors: string[]) => void;
  dismissedDefaultWorkflowAlert: boolean;
  setDismissedDefaultWorkflowAlert: (value: boolean) => void;
};

const initialState = {
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
});

export const selectWorkflowSlice = (state: AppState): WorkflowState => ({
  workflowStages: state.workflowStages,
  workflowColors: state.workflowColors,
  setWorkflowStages: state.setWorkflowStages,
  dismissedDefaultWorkflowAlert: state.dismissedDefaultWorkflowAlert,
  setDismissedDefaultWorkflowAlert: state.setDismissedDefaultWorkflowAlert,
});
