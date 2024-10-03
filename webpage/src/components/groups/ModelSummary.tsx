import { Model } from "@state/inventory";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { useWorkflowColors } from "@hooks/useWorkflowColors.ts";
import { useStore } from "@state/store.ts";
import { selectWorkflowSlice } from "@state/workflow";
import { selectModalSlice } from "@state/modal";
import { ModalTypes } from "@components/modal/modals.tsx";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Draggable } from "@hello-pangea/dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

export const ModelSummary = ({
  model,
  index,
}: {
  model: Model;
  index: number;
}) => {
  const { convertCollectionToGradient } = useWorkflowColors();
  const workflow = useStore(selectWorkflowSlice);
  const modal = useStore(selectModalSlice);

  const modelCount = model.collection.reduce((a, b) => a + b.amount, 0);
  const gradient = convertCollectionToGradient(
    model.collection,
    workflow.workflowStages.length,
  );

  return (
    <Draggable key={model.id} draggableId={model.id} index={index}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          elevation={5}
        >
          <Stack
            sx={{
              p: 2,
              cursor: "pointer",
            }}
            direction={"row"}
            alignItems={"center"}
            onClick={() =>
              modal.openModal(ModalTypes.EDIT_MODEL, { modelId: model.id })
            }
          >
            <Typography
              variant={"h6"}
              flexGrow={1}
              sx={{
                display: "flex",
                gap: 1,
                alignItems: "center",
              }}
            >
              <DragIndicatorIcon sx={{ cursor: "grab" }} /> {model.name} (
              {modelCount})
            </Typography>
            <NavigateNextIcon />
          </Stack>
          <Box
            sx={{
              p: 0.4,
              background: gradient,
            }}
          />
        </Paper>
      )}
    </Draggable>
  );
};
