// DoughnutChart.tsx
import React from "react";
import { Doughnut, Pie } from "react-chartjs-2";
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

export const PieChart: React.FC<DoughnutChartProps> = ({
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
  const chartData: ChartData<"pie"> = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: backgroundColors,
        borderWidth: legend ? 2 : 0,
        borderColor: theme.palette.background.default,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
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
      <Pie data={chartData} options={options} />
    </Box>
  );
};
