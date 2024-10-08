import { moveItem, moveItemBetweenLists } from "../utils/array.ts";
import { logApiFailure, logKeyEvent } from "../firebase/analytics.ts";
import { Alerts } from "@components/alerts/alerts.tsx";
import { DropResult } from "@hello-pangea/dnd";
import { useStore } from "@state/store.ts";
import { selectAlertSlice } from "@state/alert";
import { useApi } from "../api/useApi.ts";
import { selectInventorySlice } from "@state/inventory";

export const useCollectionSorting = () => {
  const inventory = useStore(selectInventorySlice);
  const { triggerAlert } = useStore(selectAlertSlice);
  const api = useApi();

  const reorderInsideSameCollection = async (
    collectionId: string,
    sourceIndex: number,
    destinationIndex: number,
  ) => {
    if (sourceIndex === destinationIndex) return;

    const collection = inventory.findCollection(collectionId);
    if (!collection)
      throw new Error(
        "Collection the item was dropped into was not... found?!",
      );

    const groups = moveItem(collection.groups, sourceIndex, destinationIndex);
    try {
      await api.reorderGroups({
        groups: groups.map((groupId, index) => ({
          collectionId: collection.id,
          groupId,
          index,
        })),
      });
      logKeyEvent("adjust sorting", {
        type: "Group within collection",
      });
      inventory.updateCollection({
        ...collection,
        groups: groups,
      });
    } catch (e) {
      triggerAlert(Alerts.REORDER_ERROR);
      logApiFailure(e, "move group [within collection]");
    }
  };

  const moveGroupToOtherCollection = async (
    sourceCollectionId: string,
    sourceIndex: number,
    destinationCollectionId: string,
    destinationIndex: number,
  ) => {
    const sourceCollection = inventory.findCollection(sourceCollectionId);
    const destinationCollection = inventory.findCollection(
      destinationCollectionId,
    );

    if (!sourceCollection || !destinationCollection)
      return console.error(
        "Collection the item was picked from AND/OR dropped into was not... found?!",
      );

    const [updatedSourceGroups, updateDestinationGroups] = moveItemBetweenLists(
      sourceCollection.groups,
      sourceIndex,
      destinationCollection.groups,
      destinationIndex,
    );

    try {
      await api.reorderGroups({
        groups: [
          ...updatedSourceGroups.map((groupId, index) => ({
            collectionId: sourceCollection.id,
            groupId,
            index,
          })),
          ...updateDestinationGroups.map((groupId, index) => ({
            collectionId: destinationCollection.id,
            groupId,
            index,
          })),
        ],
      });
      logKeyEvent("adjust sorting", {
        type: "Group between collections",
      });
      inventory.updateCollection({
        ...sourceCollection,
        groups: updatedSourceGroups,
      });
      inventory.updateCollection({
        ...destinationCollection,
        groups: updateDestinationGroups,
      });
    } catch (e) {
      triggerAlert(Alerts.REORDER_ERROR);
      logApiFailure(e, "move group [between collections]");
    }
  };

  return ({ source, destination }: DropResult) => {
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      return reorderInsideSameCollection(
        source.droppableId,
        source.index,
        destination.index,
      );
    } else {
      return moveGroupToOtherCollection(
        source.droppableId,
        source.index,
        destination.droppableId,
        destination.index,
      );
    }
  };
};
