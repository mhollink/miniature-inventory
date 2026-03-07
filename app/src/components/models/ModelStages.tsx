import { Model, selectInventorySlice } from "@state/inventory";
import { useStore } from "@state/store.ts";
import { selectWorkflowSlice } from "@state/workflow";
import { Paper, TableRow, TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { ModelSummary } from "@components/models/ModelSummary.tsx";
import { useDebouncedCallback } from "use-debounce";
import { useApi } from "../../api/useApi.ts";
import { Alerts } from "@components/alerts/alerts.tsx";
import { selectAlertSlice } from "@state/alert";

type TableRow = {
  id: string;
  stageName: string;
  amount: number;
};

export const ModelStages = ({ model }: { model: Model }) => {
  const { workflowStages } = useStore(selectWorkflowSlice);
  const { triggerAlert } = useStore(selectAlertSlice);
  const { updateModel } = useStore(selectInventorySlice);
  const api = useApi();
  const [rows, setRows] = useState<TableRow[]>(
    model.collection.map((row) => ({
      id: String(row.stage),
      stageName: workflowStages[row.stage],
      amount: row.amount,
      isEditMode: false,
    })),
  );

  const updateCollection = useDebouncedCallback(async (rows: TableRow[]) => {
    try {
      const response = await api.updateModel(model.id, {
        name: model.name,
        miniatures: rows.map(({ amount }, index) => ({
          amount: Number(amount),
          stage: index,
        })),
      });
      if (response.error) {
        triggerAlert(Alerts.UPDATE_MODEL_ERROR);
        return;
      }
      updateModel({
        ...model,
        collection: rows.map(({ amount }, index) => ({
          amount: Number(amount),
          stage: index,
        })),
      });
      triggerAlert(Alerts.UPDATE_MODEL_SUCCESS);
    } catch {
      triggerAlert(Alerts.UPDATE_MODEL_ERROR);
    }
  }, 1000);

  const onChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    row: TableRow,
  ) => {
    const value = e.target.value;
    const { id } = row;
    const newRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, amount: Number(value) };
      }
      return row;
    });
    setRows(newRows);
    updateCollection(newRows);
  };

  return (
    <>
      <ModelSummary
        model={{
          ...model,
          collection: model.collection.map((row) => ({
            stage: Number(row.stage),
            amount: Number(row.amount),
          })),
        }}
      />
      <Paper className="model-stages" sx={{ p: 2 }} elevation={5}>
        <Stack direction={"row"}>
          <Typography sx={{ width: "70%" }} />
          <Typography sx={{ width: "30%" }} textAlign={"center"}>
            Quantity
          </Typography>
        </Stack>
        {rows.map((row) => (
          <>
            <Stack
              direction={"row"}
              key={row.id}
              sx={{ py: 1 }}
              alignItems={"center"}
            >
              <Typography sx={{ width: "70%" }}>{row.stageName}</Typography>
              <Typography
                sx={{
                  width: "30%",
                }}
                textAlign={"center"}
              >
                <TextField
                  value={row.amount}
                  type={"number"}
                  size={"small"}
                  sx={{
                    "& input[type=number]": {
                      "-moz-appearance": "textfield",
                      textAlign: "center",
                    },
                    "& input[type=number]::-webkit-outer-spin-button": {
                      "-webkit-appearance": "none",
                      margin: 0,
                    },
                    "& input[type=number]::-webkit-inner-spin-button": {
                      "-webkit-appearance": "none",
                      margin: 0,
                    },
                  }}
                  slotProps={{
                    htmlInput: { min: 0 },
                  }}
                  onChange={(e) => onChange(e, row)}
                />
              </Typography>
            </Stack>
          </>
        ))}
        <Divider />
        <Stack direction={"row"} sx={{ mt: 1, py: 1 }} alignItems={"center"}>
          <Typography sx={{ width: "70%", pr: 3 }} textAlign={"right"}>
            Total:
          </Typography>
          <Typography sx={{ width: "30%" }} textAlign={"center"}>
            {rows.reduce((a, b) => a + Number(b.amount), 0)}
          </Typography>
        </Stack>
      </Paper>
    </>
  );
};
