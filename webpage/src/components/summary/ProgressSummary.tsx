import { ModelStage } from "@state/inventory";
import Stack from "@mui/material/Stack";
import { PieChart } from "@components/charts/PieChart.tsx";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { calculateSumForEachStage } from "../../utils/collection.ts";
import { DoughnutChart } from "@components/charts/DoughnutChart.tsx";

export const ProgressSummary = ({
  totalCollection,
  variant = "pie",
}: {
  totalCollection: { label: string; values: ModelStage[] }[];
  variant?: "doughnut" | "pie";
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      <Stack
        sx={{ width: "100%", color: "grey" }}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {variant === "pie" && (
          <PieChart
            data={totalCollection.map((collection) => ({
              values: calculateSumForEachStage(collection.values).map(
                ({ amount }) => amount,
              ),
              label: collection.label,
            }))}
            size={isMobile ? "100%" : "50%"}
            options={{
              legend: true,
              tooltip: true,
            }}
          />
        )}
        {variant === "doughnut" && (
          <DoughnutChart
            data={totalCollection.map((collection) => ({
              values: calculateSumForEachStage(collection.values).map(
                ({ amount }) => amount,
              ),
              label: collection.label,
            }))}
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
