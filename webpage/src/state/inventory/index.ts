import { AppState, Slice } from "../types.ts";

export type Collection = {
  id: string;
  name: string;
  groups: string[];
};

export type Group = {
  id: string;
  name: string;
  models: string[];
};

export type ModelStage = { amount: number; stage: number };

export type Model = {
  id: string;
  name: string;
  collection: ModelStage[];
};

export type InventoryState = {
  collections: Collection[];
  groups: Group[];
  models: Model[];
};

const initialState = {
  collections: [
    {
      id: "2c7cbf1f-23ef-47f1-8d0e-de802de0183c",
      name: "Middle Earth - Strategy Battle Game",
      groups: ["39d70b96-66be-410a-a717-6edb34d4b365"],
    },
    {
      id: "d33cba13-19ea-4258-9933-4d89f27555c2",
      name: "Dungeons and Dragons",
      groups: [],
    },
    {
      id: "1cac451e-33c8-44db-b924-6f5dab6744c3",
      name: "Terrain",
      groups: [
        "67b87305-5a97-4ad6-a49c-bafd0b96274c",
        "89606eac-7c42-4a11-aae6-4994e1b46a2f",
      ],
    },
  ],
  groups: [
    {
      id: "39d70b96-66be-410a-a717-6edb34d4b365",
      name: "The Fiefdoms",
      models: [
        "1b400af5-26a8-4565-9b8d-fb048df9e2e2",
        "06dca937-661b-4a5d-b14f-a5b7a3d52468",
      ],
    },
    {
      id: "67b87305-5a97-4ad6-a49c-bafd0b96274c",
      name: "Houses",
      models: [],
    },
    {
      id: "89606eac-7c42-4a11-aae6-4994e1b46a2f",
      name: "Forest pieces",
      models: [],
    },
  ],
  models: [
    {
      id: "1b400af5-26a8-4565-9b8d-fb048df9e2e2",
      name: "Prince Imrahil",
      collection: [
        {
          amount: 1,
          stage: 3,
        },
      ],
    },
    {
      id: "06dca937-661b-4a5d-b14f-a5b7a3d52468",
      name: "Knight of Dol Amroth (mtd)",
      collection: [
        {
          amount: 2,
          stage: 0,
        },
        {
          amount: 6,
          stage: 1,
        },
        {
          amount: 2,
          stage: 3,
        },
      ],
    },
  ],
};

export const inventorySlice: Slice<InventoryState> = () => ({
  ...initialState,
});

export const selectInventorySlice = (state: AppState): InventoryState => ({
  collections: state.collections,
  groups: state.groups,
  models: state.models,
});

export const selectCollection =
  (collectionId: string) =>
  (state: AppState): Collection | undefined =>
    state.collections.find((collection) => collection.id === collectionId);

export const selectGroup =
  (groupId: string) =>
  (state: AppState): Group | undefined =>
    state.groups.find((group) => group.id === groupId);

export const selectModelsForGroup =
  (groupId: string) =>
  (state: AppState): Model[] => {
    const group = state.groups.find((group) => group.id === groupId);
    if (!group) return [];

    return group.models
      .map((modelId) => state.models.find((model) => model.id === modelId))
      .filter((value) => value !== undefined);
  };

export const selectModelsForCollection =
  (collectionId: string) =>
  (state: AppState): Model[] => {
    const collection = state.collections.find(
      (collection) => collection.id === collectionId,
    );
    if (!collection) return [];

    return collection.groups
      .map((groupId) => state.groups.find((group) => group.id === groupId))
      .flatMap((group) =>
        group?.models.map((modelId) =>
          state.models.find((model) => model.id === modelId),
        ),
      )
      .filter((value) => value !== undefined);
  };
