import React from "react";
import { Pie } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import Box from "@mui/material/Box";
import { useChartable } from "@components/charts/hooks.ts";

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

export type PieChartProps = {
  data: { label: string; values: number[] }[];
  size?: string;
  options?: {
    legend: boolean;
    tooltip: boolean;
  };
};

export const PieChart: React.FC<PieChartProps> = ({
  data,
  size,
  options: { legend, tooltip } = {
    legend: false,
    tooltip: false,
  },
}) => {
  const { chartData, options } = useChartable<"pie">(legend, tooltip, data);
  return (
    <Box sx={{ minWidth: size, width: size, height: size }}>
      <Pie data={chartData} options={options} />
    </Box>
  );
};
