import { FunctionComponent } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Crumbs } from "@components/cumbs/Crumbs.tsx";
import { useParams } from "react-router-dom";
import { useStore } from "@state/store.ts";
import { selectGroup, selectModelsForGroup } from "@state/inventory";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import { useWorkflowColors } from "@hooks/useWorkflowColors.ts";
import { selectWorkflowSlice } from "@state/workflow";
import { Helmet } from "react-helmet-async";
import Stack from "@mui/material/Stack";
import { SummaryItem } from "@components/collections/SummaryItem.tsx";
import SquareOutlinedIcon from "@mui/icons-material/SquareOutlined";
import HexagonOutlinedIcon from "@mui/icons-material/HexagonOutlined";
import { ModelSummary } from "@components/collections/ModelSummary.tsx";
import { Fab } from "@components/fab/Fab.tsx";
import IconButton from "@mui/material/IconButton";
import { Delete } from "@mui/icons-material";

const Summary = ({
  miniatures,
  modelTypes,
  gradient,
}: {
  miniatures: number;
  modelTypes: number;
  gradient: string;
}) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      spacing={2}
      sx={{
        p: 4,
        borderRadius: 2,
        background: gradient,
      }}
    >
      <SummaryItem
        icon={<SquareOutlinedIcon sx={{ fontSize: 40 }} />}
        label={"Models"}
        count={modelTypes}
        size={50}
      />
      <SummaryItem
        icon={<HexagonOutlinedIcon sx={{ fontSize: 40 }} />}
        label="Miniatures"
        count={miniatures}
        size={50}
      />{" "}
    </Stack>
  );
};

export const Group: FunctionComponent = () => {
  const { id: groupId } = useParams() as { id: string };
  const workflow = useStore(selectWorkflowSlice);
  const group = useStore(selectGroup(groupId));
  const models = useStore(selectModelsForGroup(groupId));
  const { convertCollectionToGradient } = useWorkflowColors();

  const totalCollection = models.flatMap((models) => models.collection);
  const modelCount = totalCollection.reduce((a, b) => a + b.amount, 0);

  const gradient = convertCollectionToGradient(
    totalCollection,
    workflow.workflowStages.length,
  );

  return (
    <>
      <Helmet title={group?.name || ""} />
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Crumbs />
        {!group ? (
          <>
            <Typography variant={"h3"}>Group not found...</Typography>
            <Alert severity="error" variant={"filled"}>
              <Typography>
                You are currently looking for a group that does not exist.
                Please head back to the{" "}
                <Link href={"/collections"}>Collections overview</Link> and
                select a group from there.
              </Typography>
            </Alert>
          </>
        ) : (
          <>
            <Stack direction="row" alignItems="center">
              <Typography variant={"h3"} flexGrow={1}>
                {group?.name}
              </Typography>
              <IconButton size={"large"} color={"error"}>
                <Delete sx={{ fontSize: 30 }} />
              </IconButton>
            </Stack>
            <Summary
              miniatures={modelCount}
              modelTypes={models.length}
              gradient={gradient}
            />
            <Typography variant={"h4"}>Models in this group</Typography>
            {models.length === 0 && (
              <>
                <Alert severity={"info"} variant={"filled"}>
                  This group is currently empty. You can start adding models to
                  this group using the FAB in the bottom right corner.
                </Alert>
              </>
            )}
            {models.map((model) => (
              <ModelSummary key={model.id} model={model} />
            ))}
          </>
        )}
      </Container>
      <Fab
        ariaLabel={"collection-actions"}
        actions={[
          {
            name: "Add a model",
            icon: <HexagonOutlinedIcon />,
            callback: () => console.log("create group invoked."),
          },
        ]}
      />
    </>
  );
};
