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

  importInventory: (state: {
    collections: Collection[];
    groups: Group[];
    models: Model[];
  }) => void;
  clearInventory: () => void;

  addCollection: (id: string, name: string) => void;
  findCollection: (id: string) => Collection | undefined;
  updateCollection: (updatedCollection: Collection) => void;
  deleteCollection: (id: string) => void;

  addGroup: (collectionId: string, groupId: string, name: string) => void;
  findGroup: (id: string) => Group | undefined;
  updateGroup: (updatedGroup: Group) => void;
  deleteGroup: (id: string) => void;

  addModel: (
    groupId: string,
    id: string,
    name: string,
    collection: ModelStage[],
  ) => void;
  findModel: (id: string) => Model | undefined;
  updateModel: (updatedModel: Model) => void;
  deleteModel: (id: string) => void;
};

const initialState = {
  collections: [],
  groups: [],
  models: [],
};

export const inventorySlice: Slice<InventoryState> = (set, get) => ({
  ...initialState,

  importInventory: (state) => set({ ...state }, undefined, "IMPORT_STATE"),
  clearInventory: () => set({ ...initialState }, undefined, "CLEAR_STATE"),

  addCollection: (id: string, name: string) =>
    set(
      ({ collections }) => ({
        collections: [
          ...collections,
          {
            id,
            name,
            groups: [],
          },
        ],
      }),
      undefined,
      "ADD_COLLECTION",
    ),
  findCollection: (id: string) =>
    get().collections.find((collection) => collection.id === id),
  updateCollection: (updatedCollection: Collection) =>
    set(
      ({ collections }) => ({
        collections: collections.map((collection) => {
          if (collection.id === updatedCollection.id) return updatedCollection;
          else return collection;
        }),
      }),
      undefined,
      "UPDATE_COLLECTION",
    ),
  deleteCollection: (id: string) =>
    set(
      ({ collections, groups, models }) => {
        const deletedGroups =
          collections.find((c) => c.id === id)?.groups || [];
        const deletedModels = deletedGroups.flatMap(
          (group) => groups.find((g) => g.id === group)?.models || [],
        );
        return {
          collections: collections.filter((collection) => collection.id !== id),
          groups: groups.filter((group) => !deletedGroups.includes(group.id)),
          models: models.filter((model) => !deletedModels.includes(model.id)),
        };
      },
      undefined,
      "DELETE_COLLECTION",
    ),

  addGroup: (collectionId, groupId, name) =>
    set(
      ({ collections, groups }) => {
        const newGroup: Group = {
          id: groupId,
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
  updateGroup: (updatedGroup: Group) =>
    set(
      ({ groups }) => ({
        groups: groups.map((group) => {
          if (group.id === updatedGroup.id) return updatedGroup;
          else return group;
        }),
      }),
      undefined,
      "UPDATE_GROUP",
    ),
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
          models: models.filter((model) => !group.models.includes(model.id)),
        };
      },
      undefined,
      "DELETE_GROUP",
    ),

  addModel: (groupId, id, name, collection) =>
    set(
      ({ groups, models }) => {
        const newModel: Model = {
          id: id,
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

  importInventory: state.importInventory,
  clearInventory: state.clearInventory,

  addCollection: state.addCollection,
  findCollection: state.findCollection,
  updateCollection: state.updateCollection,
  deleteCollection: state.deleteCollection,

  addGroup: state.addGroup,
  findGroup: state.findGroup,
  updateGroup: state.updateGroup,
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
