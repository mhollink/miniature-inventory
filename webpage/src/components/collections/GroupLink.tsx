import { Paper } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Box from "@mui/material/Box";
import { FunctionComponent } from "react";
import Link from "@mui/material/Link";
import { useStore } from "@state/store.ts";
import { selectGroup, selectModelsForGroup } from "@state/inventory";
import { selectWorkflowSlice } from "@state/workflow";
import { useWorkflowColors } from "@hooks/useWorkflowColors.ts";
import { Draggable } from "@hello-pangea/dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

type CollectionSummaryProps = {
  groupId: string;
  index: number;
};

export const GroupLink: FunctionComponent<CollectionSummaryProps> = ({
  groupId,
  index,
}) => {
  const group = useStore(selectGroup(groupId));
  const models = useStore(selectModelsForGroup(groupId));
  const workflow = useStore(selectWorkflowSlice);
  const { convertCollectionToGradient } = useWorkflowColors();
  const totalCollection = models.flatMap((models) => models.collection);
  const modelCount = totalCollection.reduce((a, b) => a + b.amount, 0);

  const gradient = convertCollectionToGradient(
    totalCollection,
    workflow.workflowStages.length,
  );

  return (
    group && (
      <Draggable draggableId={group.id} index={index}>
        {(provided) => (
          <Paper
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            elevation={5}
          >
            <Link
              href={`/collections/${groupId}`}
              color="textPrimary"
              underline={"none"}
            >
              <Stack
                sx={{
                  p: 2,
                  cursor: "pointer",
                }}
                direction={"row"}
                alignItems={"center"}
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
                  <DragIndicatorIcon sx={{ cursor: "grab" }} /> {group.name} (
                  {modelCount})
                </Typography>
                <NavigateNextIcon />
              </Stack>
            </Link>
            <Box
              sx={{
                p: 0.2,
                background: gradient,
              }}
            />
          </Paper>
        )}
      </Draggable>
    )
  );
};
