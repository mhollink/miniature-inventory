import { Model } from "@state/inventory";
import Typography from "@mui/material/Typography";
import { Paper } from "@mui/material";
import Stack from "@mui/material/Stack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Box from "@mui/material/Box";
import { useWorkflowColors } from "@hooks/useWorkflowColors.ts";
import { useStore } from "@state/store.ts";
import { selectWorkflowSlice } from "@state/workflow";

export const ModelSummary = ({ model }: { model: Model }) => {
  const { convertCollectionToGradient } = useWorkflowColors();
  const workflow = useStore(selectWorkflowSlice);

  const modelCount = model.collection.reduce((a, b) => a + b.amount, 0);
  const gradient = convertCollectionToGradient(
    model.collection,
    workflow.workflowStages.length,
  );

  return (
    <Paper elevation={5}>
      <Stack
        sx={{
          p: 2,
          cursor: "pointer",
        }}
        direction={"row"}
        alignItems={"center"}
      >
        <Typography variant={"h6"} flexGrow={1}>
          {model.name} ({modelCount})
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
  );
};
