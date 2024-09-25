import { AppState, Slice } from "../types.ts";

export type WorkflowState = {
  workflowStages: string[];
  setWorkflowStages: (stages: string[]) => void;
};

const initialState = {
  workflowStages: [
    "Unfinished",
    "Assembled",
    "Primed",
    "Battle Ready",
    "Parade Ready",
  ],
};

export const workflowSlice: Slice<WorkflowState> = (set) => ({
  ...initialState,

  setWorkflowStages: (stages) =>
    set({ workflowStages: stages }, undefined, "SET_WORKFLOW"),
});

export const selectWorkflowSlice = (state: AppState): WorkflowState => ({
  workflowStages: state.workflowStages,
  setWorkflowStages: state.setWorkflowStages,
});
