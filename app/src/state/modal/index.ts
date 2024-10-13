import { ModalTypes } from "@components/modal/modals.tsx";
import { AppState, Slice } from "../types.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModalContext = any;

export type ModalState = {
  openedModal: ModalTypes | null;
  openedModalContext?: ModalContext;
  openModal: (key: ModalTypes, context?: ModalContext) => void;
  closeModal: () => void;
};

const initialModalState = {
  openedModal: null,
  openedModalContext: null,
};

export const modalSlice: Slice<ModalState> = (set) => ({
  ...initialModalState,

  openModal: (modal, context) =>
    set(
      { openedModal: modal, openedModalContext: context },
      undefined,
      "OPEN_MODAL",
    ),
  closeModal: () =>
    set(
      {
        openedModal: null,
        openedModalContext: null,
      },
      undefined,
      "CLOSE_MODAL",
    ),
});

export const selectModalSlice = (state: AppState): ModalState => ({
  openedModal: state.openedModal,
  openedModalContext: state.openedModalContext,
  openModal: state.openModal,
  closeModal: state.closeModal,
});
