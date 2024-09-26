import { AppState, Slice } from "../types.ts";
import { v4 } from "uuid";

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

  addCollection: (name: string) => void;
  findCollection: (id: string) => Collection | undefined;
  deleteCollection: (id: string) => void;

  addGroup: (collectionId: string, name: string) => void;
  findGroup: (id: string) => Group | undefined;
  deleteGroup: (id: string) => void;

  addModel: (groupId: string, name: string, collection: ModelStage[]) => void;
  findModel: (id: string) => Model | undefined;
  updateModel: (updatedModel: Model) => void;
  deleteModel: (id: string) => void;
};

const initialState = {
  collections: [
    {
      id: "2c7cbf1f-23ef-47f1-8d0e-de802de0183c",
      name: "Middle Earth - Strategy Battle Game",
      groups: ["39d70b96-66be-410a-a717-6edb34d4b365"],
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

export const inventorySlice: Slice<InventoryState> = (set, get) => ({
  ...initialState,

  addCollection: (name: string) =>
    set(
      ({ collections }) => ({
        collections: [
          ...collections,
          {
            id: v4(),
            name: name,
            groups: [],
          },
        ],
      }),
      undefined,
      "ADD_COLLECTION",
    ),
  findCollection: (id: string) =>
    get().collections.find((collection) => collection.id === id),
  deleteCollection: (id: string) =>
    set(
      ({ collections }) => ({
        collections: collections.filter((collection) => collection.id !== id),
      }),
      undefined,
      "DELETE_COLLECTION",
    ),

  addGroup: (collectionId, name) =>
    set(
      ({ collections, groups }) => {
        const newGroup: Group = {
          id: v4(),
          name: name,
          models: [],
        };
        return {
          collections: collections.map((collection) =>
            collection.id !== collectionId
              ? collection
              : {
                  ...collection,
                  groups: [...collection.groups, newGroup.id],
                },
          ),
          groups: [...groups, newGroup],
        };
      },
      undefined,
      "ADD_GROUP",
    ),
  findGroup: (id: string) => get().groups.find((group) => group.id === id),
  deleteGroup: (id: string) =>
    set(
      ({ collections, groups, models }) => {
        const group = get().groups.find((group) => group.id === id);

        if (!group) return {};

        return {
          collections: collections.map((collection) => {
            if (collection.groups.includes(id)) {
              return {
                ...collection,
                groups: collection.groups.filter((group) => group !== id),
              };
            }
            return collection;
          }),
          groups: groups.filter((group) => group.id !== id),
          models: models.filter((model) => group.models.includes(model.id)),
        };
      },
      undefined,
      "DELETE_GROUP",
    ),

  addModel: (groupId, name, collection) =>
    set(
      ({ groups, models }) => {
        const newModel: Model = {
          id: v4(),
          name: name,
          collection: collection,
        };
        return {
          groups: groups.map((group) =>
            group.id !== groupId
              ? group
              : {
                  ...group,
                  models: [...group.models, newModel.id],
                },
          ),
          models: [...models, newModel],
        };
      },
      undefined,
      "ADD_MODEL",
    ),
  findModel: (id: string) => get().models.find((model) => model.id === id),
  updateModel: (updatedModel: Model) =>
    set(
      ({ models }) => ({
        models: models.map((model) => {
          if (model.id === updatedModel.id) return updatedModel;
          return model;
        }),
      }),
      undefined,
      "UPDATE_MODEL",
    ),
  deleteModel: (id: string) =>
    set(
      ({ groups, models }) => ({
        groups: groups.map((group) => {
          if (group.models.includes(id)) {
            return {
              ...group,
              models: group.models.filter((model) => model !== id),
            };
          }
          return group;
        }),
        models: models.filter((model) => model.id !== id),
      }),
      undefined,
      "DELETE_MODEL",
    ),
});

export const selectInventorySlice = (state: AppState): InventoryState => ({
  collections: state.collections,
  groups: state.groups,
  models: state.models,

  addCollection: state.addCollection,
  findCollection: state.findCollection,
  deleteCollection: state.deleteCollection,

  addGroup: state.addGroup,
  findGroup: state.findGroup,
  deleteGroup: state.deleteGroup,

  addModel: state.addModel,
  findModel: state.findModel,
  updateModel: state.updateModel,
  deleteModel: state.deleteModel,
});

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
