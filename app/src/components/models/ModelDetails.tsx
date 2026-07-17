import { Model, selectInventorySlice } from "@state/inventory";
import { useStore } from "@state/store.ts";
import { Paper, TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useDebouncedCallback } from "use-debounce";
import { useApi } from "../../api/useApi.ts";
import { selectAlertSlice } from "@state/alert";
import { Alerts } from "@components/alerts/alerts.tsx";

export const ModelDetails = ({ model }: { model: Model }) => {
  const { triggerAlert } = useStore(selectAlertSlice);
  const { updateModel } = useStore(selectInventorySlice);
  const api = useApi();
  const [additionalInformation, setAdditionalInformation] = useState({
    "Model Brand": "",
    "Release year": "",
    Set: "",
    "Price per Model": "",
    ...(model.additionalInformation ?? {}),
  });

  const performDebouncedUpdate = useDebouncedCallback(
    async (fields: Record<string, string>) => {
      // updateModel({
      //   ...model,
      //   additionalInformation: fields,
      // });
      console.log({ model, fields });

      triggerAlert(Alerts.UPDATE_MODEL_SUCCESS);
    },
    1000,
  );

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    const newFields = {
      ...additionalInformation,
      [name]: value,
    };

    setAdditionalInformation(newFields);
    performDebouncedUpdate(newFields);
  };

  return (
    <>
      <Paper className="model-details" sx={{ p: 2 }} elevation={5}>
        <Typography variant="h5">Additional Model information</Typography>
        {Object.entries(additionalInformation).map(([field, value], index) => (
          <>
            <Stack
              direction={"row"}
              key={index}
              sx={{ py: 1 }}
              alignItems={"center"}
            >
              <Typography sx={{ width: "40%" }}>{field}</Typography>
              <Typography sx={{ width: "60%" }} textAlign={"center"}>
                <TextField
                  size={"small"}
                  fullWidth
                  name={field}
                  value={value}
                  onChange={onChange}
                />
              </Typography>
            </Stack>
          </>
        ))}
      </Paper>
    </>
  );
};
