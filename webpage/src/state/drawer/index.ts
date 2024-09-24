import { DrawerTypes } from "@components/drawer/drawers.tsx";
import { AppState, Slice } from "../types.ts";

export type DrawerState = {
  openedDrawer: DrawerTypes | null;
  openDrawer: (sidebarType: DrawerTypes) => void;
  closeDrawer: () => void;
};

const initialState = {
  openedDrawer: null,
};

export const drawerSlice: Slice<DrawerState> = (set) => ({
  ...initialState,

  openDrawer: (sidebar) =>
    set({ openedDrawer: sidebar }, undefined, "OPEN_DRAWER"),
  closeDrawer: () => set({ openedDrawer: null }, undefined, "CLOSE_DRAWER"),
});

export const selectDrawerSlice = (state: AppState): DrawerState => ({
  openedDrawer: state.openedDrawer,
  openDrawer: state.openDrawer,
  closeDrawer: state.closeDrawer,
});
