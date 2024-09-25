import { AppState, StoreKey } from "./types.ts";
import { createJSONStorage, PersistOptions } from "zustand/middleware";

const keysToPersist: StoreKey[] = [
  "darkMode",
  "workflowStages",
  "collections",
  "groups",
  "models",
];

const getStateToPersist = (state: AppState): Partial<AppState> =>
  Object.fromEntries(
    Object.entries(state).filter((stateEntry) =>
      keysToPersist.includes(stateEntry[0] as StoreKey),
    ),
  );

export const persistOptions: PersistOptions<AppState, Partial<AppState>> = {
  name: "my-mini-inventory",
  storage: createJSONStorage(() => localStorage),
  partialize: (state: AppState) => getStateToPersist(state),
};
