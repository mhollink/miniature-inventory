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

type CollectionSummaryProps = {
  groupId: string;
};

export const GroupLink: FunctionComponent<CollectionSummaryProps> = ({
  groupId,
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
      <Paper elevation={5}>
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
            <Typography variant={"h6"} flexGrow={1}>
              {group.name} ({modelCount})
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
    )
  );
};
