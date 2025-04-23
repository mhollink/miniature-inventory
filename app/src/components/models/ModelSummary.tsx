import Alert from "@mui/material/Alert";
import { Model } from "@state/inventory";
import { VerticalBarChart } from "@components/charts/BarChart.tsx";

export const ModelSummary = ({ model }: { model: Model }) => {
  const modelCount = model.collection.reduce((a, b) => a + b.amount, 0);

  return (
    <>
      {modelCount === 0 ? (
        <>
          <Alert severity={"info"} variant={"filled"}>
            This group is currently empty. You can start adding models to this
            group using the FAB in the bottom right corner.
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
