import { useCallback } from "react";
import { useApi } from "../api/useApi.ts";
import { useStore } from "@state/store.ts";
import { useWorkflowColors } from "@hooks/useWorkflowColors.ts";

export const useReload = () => {
  const api = useApi();
  const colors = useWorkflowColors();
  const {
    setWorkflowStages,
    importInventory,
    setSupporter,
    setSupportTier,
    setPaints,
  } = useStore();

  const loadWorkflow = useCallback(async () => {
    const workflow = await api.fetchWorkflow();
    const stages = workflow
      .sort((a, b) => Number(a.index) - Number(b.index))
      .map((a) => a.name);
    setWorkflowStages(stages, colors.generateRangeOfColors(stages.length));
  }, [api, setWorkflowStages, colors]);

  const loadAccountInfo = useCallback(async () => {
    const account = await api.getAccountInfo();

    setSupporter(account.support !== "none");
    setSupportTier(account.support);
  }, [api, setSupporter, setSupportTier]);

  const loadCollections = useCallback(async () => {
    const [collections, groups] = await Promise.all([
      api.fetchCollections(),
      api.fetchGroups(),
    ]);

    const loadedInventory = {
      collections: collections.map((collection) => ({
        ...collection,
        groups: collection.groups
          .sort((a, b) => a.sorting - b.sorting)
          .map(({ id }) => id),
      })),
      groups: groups.map((group) => ({
        ...group,
        models: group.models
          .sort((a, b) => a.sorting - b.sorting)
          .map(({ id }) => id),
      })),
      models: groups
        .flatMap((group) => group.models)
        .map((model) => ({
          id: model.id,
          name: model.name,
          collection: model.miniatures.map((mini) => ({
            stage: Number(mini.index),
            amount: Number(mini.amount),
          })),
        })),
    };
    importInventory(loadedInventory);
  }, [api, importInventory]);

  const loadPaints = useCallback(async () => {
    const paints = await api.fetchPaints();
    setPaints(paints);
  }, [api, setPaints]);

  return {
    loadWorkflow,
    loadAccountInfo,
    loadCollections,
    loadPaints,
  };
};
