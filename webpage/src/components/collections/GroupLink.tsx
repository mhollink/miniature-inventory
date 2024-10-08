import { Paper } from "@mui/material";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { FunctionComponent } from "react";
import Link from "@mui/material/Link";
import { useStore } from "@state/store.ts";
import { selectGroup, selectModelsForGroup } from "@state/inventory";
import { selectWorkflowSlice } from "@state/workflow";
import { Draggable } from "@hello-pangea/dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useNavigate } from "react-router-dom";
import { DoughnutChart } from "@components/charts/DoughnutChart.tsx";
import { calculateSumForEachStage } from "../../utils/collection.ts";

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
  const navigate = useNavigate();
  const totalCollection = models.flatMap((models) => models.collection);
  const summedStages = calculateSumForEachStage(totalCollection);
  const modelCount = totalCollection.reduce((a, b) => a + b.amount, 0);
  const modelsInLastStage = totalCollection
    .filter((c) => c.stage === workflow.workflowStages.length - 1)
    .reduce((a, b) => a + b.amount, 0);

  const progress =
    modelCount === 0 ? 100 : Math.ceil((modelsInLastStage / modelCount) * 100);

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
              href={`/inventory/${groupId}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/inventory/${groupId}`);
              }}
              color="textPrimary"
              underline={"none"}
            >
              <Stack
                sx={{
                  p: 2,
                  cursor: "pointer",
                  gap: 1,
                }}
                direction={"row"}
                alignItems={"center"}
              >
                <DragIndicatorIcon sx={{ cursor: "grab" }} />
                <Typography
                  flexGrow={1}
                  component={"div"}
                  sx={{
                    display: "block",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Typography variant={"body1"} sx={{ display: "block" }}>
                    {group.name} {modelCount > 0 ? <>({modelCount})</> : ""}
                  </Typography>
                  {modelCount > 0 ? (
                    <Typography
                      variant={"subtitle2"}
                      color={progress === 100 ? "success" : "textSecondary"}
                      sx={{ display: "block" }}
                    >
                      {progress}%{" "}
                      {
                        workflow.workflowStages[
                          workflow.workflowStages.length - 1
                        ]
                      }
                    </Typography>
                  ) : (
                    <Typography
                      variant={"subtitle2"}
                      color={"textDisabled"}
                      sx={{ display: "block" }}
                    >
                      Empty collection...
                    </Typography>
                  )}
                </Typography>
                <DoughnutChart
                  data={[
                    { values: summedStages.map((s) => s.amount), label: "" },
                  ]}
                  size={"4rem"}
                />
                <NavigateNextIcon />
              </Stack>
            </Link>
            {/*<Box*/}
            {/*  sx={{*/}
            {/*    p: 0.2,*/}
            {/*    background: gradient,*/}
            {/*  }}*/}
            {/*/>*/}
          </Paper>
        )}
      </Draggable>
    )
  );
};
