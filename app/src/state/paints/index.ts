import { AppState, Slice } from "../types.ts";

export type Paint = {
  id: string;
  brand: string;
  range: string;
  name: string;
  color: string;
};

export type PaintState = {
  ownedPaints: Paint[];
  setPaints: (paints: Paint[]) => void;
  addPaint: (paint: Paint) => void;
  deletePaints: (paintIds: string[]) => void;
};

const initialModalState = {
  ownedPaints: [],
};

export const paintsSlice: Slice<PaintState> = (set) => ({
  ...initialModalState,

  setPaints: (paints) =>
    set(
      () => ({
        ownedPaints: [...paints],
      }),
      undefined,
      "ADD_PAINTS",
    ),

  addPaint: (paint) =>
    set(
      ({ ownedPaints }) => ({
        ownedPaints: [...ownedPaints, paint],
      }),
      undefined,
      "ADD_PAINT",
    ),

  deletePaints: (ids) =>
    set(
      ({ ownedPaints }) => ({
        ownedPaints: ownedPaints.filter((paint) => !ids.includes(paint.id)),
      }),
      undefined,
      "DELETE_PAINTS",
    ),
});

export const selectPaintsSlice = (state: AppState): PaintState => ({
  ownedPaints: state.ownedPaints,
  addPaint: state.addPaint,
  setPaints: state.setPaints,
  deletePaints: state.deletePaints,
});
