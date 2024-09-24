import { AppState, StoreKey } from "./types.ts";
import { createJSONStorage, PersistOptions } from "zustand/middleware";

const keysToPersist: StoreKey[] = ["darkMode"];

const getStateToPersist = (state: AppState): Partial<AppState> =>
  Object.fromEntries(
    Object.entries(state).filter((stateEntry) =>
      keysToPersist.includes(stateEntry[0] as StoreKey),
    ),
  );

export const persistOptions: PersistOptions<AppState, Partial<AppState>> = {
  name: "mesbg-lb-storage",
  storage: createJSONStorage(() => sessionStorage),
  partialize: (state: AppState) => getStateToPersist(state),
};
