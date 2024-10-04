// DoughnutChart.tsx
import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import Box from "@mui/material/Box";
import useTheme from "@mui/material/styles/useTheme";

// Register the necessary Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartProps {
  labels: string[];
  data: number[];
  backgroundColors: string[];
  size?: string;
  options?: {
    legend: boolean;
    tooltip: boolean;
  };
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  labels,
  data,
  backgroundColors,
  size,
  options: { legend, tooltip } = {
    legend: false,
    tooltip: false,
  },
}) => {
  const theme = useTheme();
  const chartData: ChartData<"doughnut"> = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: backgroundColors,
        borderWidth: legend ? 5 : 0,
        borderColor: theme.palette.background.default,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    plugins: {
      legend: {
        display: legend,
        position: "bottom",
      },
      tooltip: {
        enabled: tooltip,
      },
    },
  };

  return (
    <Box sx={{ minWidth: size, width: size, height: size }}>
      <Doughnut data={chartData} options={options} />
    </Box>
  );
};
