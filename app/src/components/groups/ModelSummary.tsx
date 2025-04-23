import { Model } from "@state/inventory";
import Typography from "@mui/material/Typography";
import { Link, Paper } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useStore } from "@state/store.ts";
import { selectWorkflowSlice } from "@state/workflow";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Draggable } from "@hello-pangea/dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { DoughnutChart } from "@components/charts/DoughnutChart.tsx";
import { useNavigate } from "react-router-dom";

export const ModelSummary = ({
  groupId,
  model,
  index,
}: {
  groupId: string;
  model: Model;
  index: number;
}) => {
  const workflow = useStore(selectWorkflowSlice);
  const navigate = useNavigate();

  const modelCount = model.collection.reduce((a, b) => a + b.amount, 0);
  const modelsInLastStage =
    model.collection[model.collection.length - 1].amount;
  const progress = Math.floor((modelsInLastStage / modelCount) * 100);

  return (
    <Draggable key={model.id} draggableId={model.id} index={index}>
      {(provided) => (
        <Paper
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          elevation={5}
        >
          <Link
            href={`/inventory/${groupId}/models/${model.id}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/inventory/${groupId}/models/${model.id}`);
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
                variant={"h6"}
                flexGrow={1}
                component={"div"}
                sx={{
                  alignItems: "center",
                }}
              >
                <Typography variant={"body1"} sx={{ display: "block" }}>
                  {model.name} {modelCount > 0 ? <>({modelCount})</> : ""}
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
                    color={"error"}
                    sx={{ display: "block" }}
                  >
                    No Miniatures.
                  </Typography>
                )}
              </Typography>
              <DoughnutChart
                data={[
                  {
                    label: "",
                    values: model.collection.map(({ amount }) => amount),
                  },
                ]}
                size={"3rem"}
              />
              <NavigateNextIcon />
            </Stack>
          </Link>
        </Paper>
      )}
    </Draggable>
  );
};
