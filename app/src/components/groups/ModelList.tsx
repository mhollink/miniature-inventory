import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { SortByAlpha } from "@mui/icons-material";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { Fragment } from "react";
import { ModelSummary } from "@components/groups/ModelSummary.tsx";
import { logApiFailure, logKeyEvent } from "../../firebase/analytics.ts";
import { Alerts } from "@components/alerts/alerts.tsx";
import { moveItem } from "../../utils/array.ts";
import {
  Group,
  selectInventorySlice,
  selectModelsForGroup,
} from "@state/inventory";
import { useApi } from "../../api/useApi.ts";
import { useStore } from "@state/store.ts";
import { selectAlertSlice } from "@state/alert";

export const ModelList = ({ group }: { group: Group }) => {
  const api = useApi();
  const models = useStore(selectModelsForGroup(group.id));
  const { updateGroup } = useStore(selectInventorySlice);
  const { triggerAlert } = useStore(selectAlertSlice);

  const updateSorting = async (reorderedModels: string[], type: string) => {
    if (!group) return;
    const origSorting = [...models].map((m) => m.id);
    try {
      updateGroup({
        ...group,
        models: reorderedModels,
      });
      await api.reorderModels(group.id, {
        models: reorderedModels.map((model, index) => ({
          id: model,
          index: index,
        })),
      });
      logKeyEvent("adjust sorting", { type });
    } catch (e) {
      setTimeout(() => {
        updateGroup({
          ...group,
          models: origSorting,
        });
      });
      triggerAlert(Alerts.REORDER_ERROR);
      logApiFailure(e, "move models");
    }
  };

  const dropSort = async ({ destination, source }: DropResult) => {
    if (!destination) return;
    if (!group) return;

    const reorderedModels = moveItem(
      group.models,
      source.index,
      destination.index,
    );
    return updateSorting(reorderedModels, "move model [drop sort]");
  };

  const quickSort = async () => {
    if (!group) return;
    const reorderedModels = models
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((model) => model.id);
    return updateSorting(reorderedModels, "move model [quick sort]");
  };

  return (
    <>
      <Stack direction={"row"} alignItems={"center"}>
        <Typography variant={"h4"} flexGrow={1}>
          Models in this group
        </Typography>
        <Tooltip title="Quick sort by alphabet" onClick={quickSort}>
          <IconButton>
            <SortByAlpha sx={{ fontSize: 30 }} />
          </IconButton>
        </Tooltip>
      </Stack>
      <DragDropContext onDragEnd={dropSort}>
        <Droppable droppableId="dnd-models-container">
          {(provided) => (
            <Stack gap={1} ref={provided.innerRef} {...provided.droppableProps}>
              {models.map((model, index) => (
                <Fragment key={model.id}>
                  <ModelSummary key={model.id} model={model} index={index} />
                </Fragment>
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
