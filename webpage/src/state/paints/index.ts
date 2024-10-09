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
};

const initialModalState = {
  ownedPaints: [
    {
      id: "5594fa2d-57e6-43ec-90cb-8841232a148b",
      color: "rgb(15, 61, 124)",
      brand: "Citadel",
      range: "Base",
      name: "Macragge Blue",
    },
    {
      id: "5c9bafc0-7f63-4d73-bb60-994f84053cdc",
      color: "rgb(193, 21, 25)",
      brand: "Citadel",
      range: "Contrast",
      name: "Blood Angels Red",
    },
    {
      id: "6b942a7e-40eb-4c92-8540-4b0cd3627e6a",
      color: "rgb(192, 20, 17)",
      brand: "Citadel",
      range: "Layer",
      name: "Evil Sunz Scarlet",
    },

    {
      id: "fc526edb-f9e4-4699-9ddb-b3fc7e5b703b",
      color: "rgb(24, 24, 24)",
      brand: "Citadel",
      range: "Shade",
      name: "Nuln Oil",
    },
    {
      id: "fcb1c2a4-66ec-4e64-9460-685fa9eeca0b",
      color: "rgb(255, 245, 90)",
      brand: "Citadel",
      range: "Dry",
      name: "Hexos Palesun",
    },
    {
      id: "0818504a-c9b2-4984-8e0f-8f7781e44ce1",
      color: "rgb(179, 158, 128)",
      brand: "Citadel",
      range: "Texture",
      name: "Agrellan Earth",
    },
  ],
};

export const paintsSlice: Slice<PaintState> = () => ({
  ...initialModalState,
});

export const selectPaintsSlice = (state: AppState): PaintState => ({
  ownedPaints: state.ownedPaints,
});
