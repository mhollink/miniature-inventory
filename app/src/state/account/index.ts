import { AppState, Slice } from "@state/types.ts";

export type AccountState = {
  supporter: boolean;
  setSupporter: (supporter: boolean) => void;
  supportTier: string;
  setSupportTier: (tier: string) => void;
};

const initialState = {
  supporter: false,
  supportTier: "None",
};

export const accountSlice: Slice<AccountState> = (set) => ({
  ...initialState,

  setSupporter: (supporter: boolean) =>
    set({ supporter: supporter }, undefined, "SET_SUPPORT"),
  setSupportTier: (tier: string) =>
    set({ supportTier: tier }, undefined, "SET_SUPPORT_TIER"),
});

export const selectAccountSlice = (state: AppState): AccountState => ({
  supporter: state.supporter,
  setSupporter: state.setSupporter,
  supportTier: state.supportTier,
  setSupportTier: state.setSupportTier,
});
