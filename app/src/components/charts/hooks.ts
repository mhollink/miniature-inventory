import useTheme from "@mui/material/styles/useTheme";
import { ChartData, ChartOptions, ChartTypeRegistry } from "chart.js";
import { useStore } from "@state/store.ts";
import { selectWorkflowSlice } from "@state/workflow";

export const useChartable = <
  T extends keyof Pick<ChartTypeRegistry, "pie" | "doughnut">,
>(
  legend: boolean,
  tooltip: boolean,
  data: { label: string; values: number[] }[],
) => {
  const theme = useTheme();
  const { workflowColors, workflowStages } = useStore(selectWorkflowSlice);
  const chartData: ChartData<"pie" | "doughnut"> = {
    labels: workflowStages,
    datasets: data.map((set) => ({
      label: set.label,
      data: set.values,
      backgroundColor: workflowColors,
      borderWidth: legend ? 2 : 0,
      borderColor: theme.palette.background.default,
    })),
  };

  const options: ChartOptions<"pie" | "doughnut"> = {
    responsive: true,
    plugins: {
      legend: {
        display: legend,
        position: "bottom",
      },
      tooltip: {
        enabled: tooltip,
        callbacks: {
          label: function (tooltipItem) {
            const dataIndex = tooltipItem.dataIndex;
            const dataset = tooltipItem.dataset;
            const value = dataset.data[dataIndex] as number;
            const total = dataset.data.reduce(
              (acc: number, val: number) => acc + (val as number),
              0,
            );
            const percentage = ((value / total) * 100).toFixed(2);

            return [
              `\u2022 ${tooltipItem.label}`,
              `\u2022 Miniatures: ${value} (${percentage}%)`,
            ];
          },
          title: function (tooltipItems) {
            const datasetIndex = tooltipItems[0].datasetIndex;
            const dataset = tooltipItems[0].chart.data.datasets[datasetIndex];
            return dataset.label;
          },
        },
      },
    },
  };

  return {
    chartData,
    options,
  } as {
    chartData: ChartData<T>;
    options: ChartOptions<T>;
  };
};
