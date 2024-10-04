import { ModelStage } from "@state/inventory";
import React from "react";
import Stack from "@mui/material/Stack";
import { useStore } from "@state/store.ts";
import { selectWorkflowSlice } from "@state/workflow";
import { useWorkflowColors } from "@hooks/useWorkflowColors.ts";
import { PieChart } from "@components/charts/PieChart.tsx";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { calculateSumForEachStage } from "../../utils/collection.ts";

export const GroupProgress = ({
  totalCollection,
}: {
  totalCollection: ModelStage[];
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { generateRangeOfColors } = useWorkflowColors();
  const { workflowStages } = useStore(selectWorkflowSlice);

  const totalModels = totalCollection.reduce((t, { amount }) => t + amount, 0);
  if (totalModels === 0) return <></>;

  return (
    <>
      <Stack
        sx={{ width: "100%", color: "grey" }}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <PieChart
          data={calculateSumForEachStage(totalCollection).map(
            ({ amount }) => amount,
          )}
          labels={workflowStages}
          backgroundColors={generateRangeOfColors(workflowStages.length)}
          size={isMobile ? "100%" : "50%"}
          options={{
            legend: true,
            tooltip: true,
          }}
        />
      </Stack>
    </>
  );
};
