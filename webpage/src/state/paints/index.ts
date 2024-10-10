import { AppState, Slice } from "../types.ts";

export type Paint = {
  id: string;
  color: string;
  name: string;
  brand: string;
  range: string;
};

export type PaintState = {
  ownedPaints: Paint[];
  addPaints: (paints: Paint[]) => void;
  addPaint: (paint: Paint) => void;
  deletePaints: (paintIds: string[]) => void;
};

const initialModalState = {
  ownedPaints: [],
};

export const paintsSlice: Slice<PaintState> = (set) => ({
  ...initialModalState,

  addPaints: (paints) =>
    set(
      ({ ownedPaints }) => ({
        ownedPaints: [...ownedPaints, ...paints],
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
  addPaints: state.addPaints,
  deletePaints: state.deletePaints,
});
