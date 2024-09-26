import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { selectInventorySlice } from "@state/inventory";
import { ChangeEvent, useState } from "react";
import { DialogActions, DialogContent, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { selectWorkflowSlice } from "@state/workflow";

export const EditModelModal = () => {
  const { closeModal, openedModalContext } = useStore(selectModalSlice);
  const { findModel, updateModel } = useStore(selectInventorySlice);
  const { workflowStages } = useStore(selectWorkflowSlice);
  const model = findModel(openedModalContext.modelId);

  const [stages, setStages] = useState(
    workflowStages
      .map(
        (_, i) =>
          model?.collection.find((stage) => stage.stage === i)?.amount || 0,
      )
      .map(String),
  );

  const handleClose = () => {
    closeModal();
  };

  const handleAddCollection = () => {
    if (stages.find((stage) => Number(stage) < 0)) {
      return;
    }

    if (!model) {
      return;
    }

    updateModel({
      ...model,
      collection: stages.map((amount, index) => ({
        amount: Number(amount),
        stage: index,
      })),
    });

    handleClose();
  };

  return (
    <>
      <DialogContent>
        <form autoComplete="off">
          <Stack spacing={1}>
            <Typography>
              Below you can update the status of your current collection of{" "}
              <strong>{model?.name}</strong>
            </Typography>

            <Stack direction={"row"} flexWrap={"wrap"}>
              {workflowStages.map((stage, index) => (
                <Box
                  key={`stage-${index}`}
                  sx={{ width: "calc(33.3% - 10px)", m: "5px" }}
                >
                  <TextField
                    id={`new-model-${stage}-input`}
                    error={Number(stages[index]) < 0}
                    label={stage}
                    value={String(stages[index])}
                    autoComplete="off"
                    slotProps={{
                      input: {
                        type: "number",
                      },
                    }}
                    helperText={
                      Number(stages[index]) < 0
                        ? "Amount cannot be below 0"
                        : ""
                    }
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const newStages = [...stages];
                      newStages[index] = event.target.value;
                      setStages(newStages);
                    }}
                    fullWidth
                  />
                </Box>
              ))}
            </Stack>
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button variant={"contained"} onClick={handleAddCollection} autoFocus>
          Update {model?.name}
        </Button>
      </DialogActions>
    </>
  );
};
