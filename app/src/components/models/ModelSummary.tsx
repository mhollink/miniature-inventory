import Alert from "@mui/material/Alert";
import { Model } from "@state/inventory";
import { VerticalBarChart } from "@components/charts/BarChart.tsx";
import Typography from "@mui/material/Typography";

export const ModelSummary = ({ model }: { model: Model }) => {
  const modelCount = model.collection.reduce((a, b) => a + b.amount, 0);

  return (
    <>
      {modelCount === 0 ? (
        <>
          <Alert severity={"warning"} variant={"filled"}>
            <Typography>
              This model has currently no miniatures assigned to it.
            </Typography>
          </Alert>
        </>
      ) : (
        <VerticalBarChart
          data={[{ label: "", values: model.collection.map((a) => a.amount) }]}
        />
      )}
    </>
  );
};
