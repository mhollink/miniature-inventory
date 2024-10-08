import React from "react";
import { Doughnut } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import Box from "@mui/material/Box";
import { PieChartProps } from "@components/charts/PieChart.tsx";
import { useChartable } from "@components/charts/hooks.ts"; // Register the necessary Chart.js components

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

type DoughnutChartProps = PieChartProps;

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  size,
  options: { legend, tooltip } = {
    legend: false,
    tooltip: false,
  },
}) => {
  const { chartData, options } = useChartable<"doughnut">(
    legend,
    tooltip,
    data,
  );
  return (
    <Box sx={{ minWidth: size, width: size, height: size }}>
      <Doughnut data={chartData} options={options} />
    </Box>
  );
};
