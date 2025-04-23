import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useStore } from "@state/store.ts";
import { selectWorkflowSlice } from "@state/workflow";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export function VerticalBarChart({
  data,
  tooltip,
}: {
  tooltip?: boolean;
  data: { label: string; values: number[] }[];
}) {
  const { workflowColors, workflowStages } = useStore(selectWorkflowSlice);
  const maxes = data.map((value) => value.values.reduce((a, b) => a + b, 0));
  const max = Math.max(...maxes);
  const stepSize = Math.ceil(max / 20); // Adjust 5 to fit your needs

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio to control height
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: tooltip,
      },
    },
    indexAxis: "y",
    scales: {
      x: {
        max: max,
        stacked: true,
        ticks: {
          stepSize: stepSize,
        },
      },
      y: {
        stacked: true,
        ticks: {
          display: false, // This hides the x-axis labels
        },
      },
    },
  };
  const chartData: ChartData<"bar"> = {
    labels: ["progress"],
    datasets: data.flatMap(({ values }) =>
      values.flatMap((value, index) => [
        {
          label: workflowStages[index],
          data: [value],
          backgroundColor: workflowColors[index],
          barPercentage: 1.25,
          minBarLength: 1,
        },
      ]),
    ),
  };

  return (
    <div style={{ width: "100%", height: "100px", overflow: "hidden" }}>
      <Bar data={chartData} options={options} height={100} />
    </div>
  );
}
