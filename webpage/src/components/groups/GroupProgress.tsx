import { ModelStage } from "@state/inventory";
import Stack from "@mui/material/Stack";
import { useStore } from "@state/store.ts";
import { selectWorkflowSlice } from "@state/workflow";
import { useWorkflowColors } from "@hooks/useWorkflowColors.ts";
import { PieChart } from "@components/charts/PieChart.tsx";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { calculateSumForEachStage } from "../../utils/collection.ts";
import { DoughnutChart } from "@components/charts/DoughnutChart.tsx";

export const GroupProgress = ({
  totalCollection,
  variant = "pie",
}: {
  totalCollection: ModelStage[][];
  variant?: "doughnut" | "pie";
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { generateRangeOfColors } = useWorkflowColors();
  const { workflowStages } = useStore(selectWorkflowSlice);

  return (
    <>
      <Stack
        sx={{ width: "100%", color: "grey" }}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {variant === "pie" && (
          <PieChart
            data={totalCollection.map((collection) =>
              calculateSumForEachStage(collection).map(({ amount }) => amount),
            )}
            labels={workflowStages}
            backgroundColors={generateRangeOfColors(workflowStages.length)}
            size={isMobile ? "100%" : "50%"}
            options={{
              legend: true,
              tooltip: true,
            }}
          />
        )}
        {variant === "doughnut" && (
          <DoughnutChart
            data={totalCollection.map((collection) =>
              calculateSumForEachStage(collection).map(({ amount }) => amount),
            )}
            labels={workflowStages}
            backgroundColors={generateRangeOfColors(workflowStages.length)}
            size={isMobile ? "100%" : "50%"}
            options={{
              legend: true,
              tooltip: true,
            }}
          />
        )}
      </Stack>
    </>
  );
};
