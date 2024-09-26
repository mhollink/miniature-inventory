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
import { Delete } from "@mui/icons-material";
import { ModalTypes } from "@components/modal/modals.tsx";

export const EditModelModal = () => {
  const { closeModal, openedModalContext, openModal } =
    useStore(selectModalSlice);
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

  const handleUpdateModel = () => {
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
                    autoFocus={index === 0}
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
      <DialogActions sx={{ flexDirection: "row-reverse", gap: 2 }}>
        <Button variant={"contained"} onClick={handleUpdateModel}>
          Update model
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
        <div style={{ flex: "1 0 0" }} />
        <Button
          onClick={() =>
            openModal(ModalTypes.DELETE_MODEL, {
              modelId: openedModalContext.modelId,
              onClose: () => {
                if (findModel(openedModalContext.modelId)) {
                  openModal(ModalTypes.EDIT_MODEL, {
                    modelId: openedModalContext.modelId,
                  });
                }
              },
            })
          }
          endIcon={<Delete />}
          color={"error"}
        >
          Delete
        </Button>
      </DialogActions>
    </>
  );
};
