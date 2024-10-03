import { ModelStage } from "@state/inventory";
import React from "react";
import { LinearProgress } from "@mui/material";
import { useWorkflowColors } from "@hooks/useWorkflowColors.ts";
import Stack from "@mui/material/Stack";
import { useStore } from "@state/store.ts";
import { selectWorkflowSlice } from "@state/workflow";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface ProgressBarProps {
  value: number; // Progress value
  color?: string; // Optional custom color
  stageName: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = "#1a90ff",
  stageName,
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 18,
          width: "100%",
          borderRadius: 1.5,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#333" : "#e0e0e0",
          "& .MuiLinearProgress-bar": {
            backgroundColor: color, // Custom bar color
          },
        }}
      />

      <Typography
        variant="body2"
        color={"textSecondary"}
        sx={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          fontWeight: "bold",
        }}
      >
        {`${Math.round(value)}% ${stageName}`}
      </Typography>
    </Box>
  );
};

export const GroupProgress = ({
  totalCollection,
}: {
  totalCollection: ModelStage[];
}) => {
  const { getColorForStage } = useWorkflowColors();
  const { workflowStages } = useStore(selectWorkflowSlice);
  const summedStages = Object.values(
    totalCollection.reduce(
      (acc, item) => {
        if (!acc[item.stage]) {
          acc[item.stage] = { stage: item.stage, amount: 0 };
        }
        acc[item.stage].amount += item.amount;
        return acc;
      },
      {} as Record<string, { amount: number; stage: number }>,
    ),
  ).sort((a, b) => a.stage - b.stage);
  const totalModels = totalCollection.reduce(
    (total, current) => total + current.amount,
    0,
  );

  if (totalModels === 0) return <></>;
  const normalise = (value: number) => (value * 100) / totalModels;

  return (
    <>
      <Stack sx={{ width: "100%", color: "grey" }} spacing={1}>
        {summedStages
          .filter(({ amount }) => amount)
          .map(({ stage, amount }) => (
            <ProgressBar
              // color={getColorForStage(stage)}
              value={normalise(amount)}
              stageName={workflowStages[stage]}
              color={getColorForStage(stage, workflowStages.length).color}
            />
          ))}
      </Stack>
    </>
  );
};
