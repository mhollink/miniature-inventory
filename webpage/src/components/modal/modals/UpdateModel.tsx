import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { selectInventorySlice } from "@state/inventory";
import { ChangeEvent, FormEvent, useState } from "react";
import {
  DialogActions,
  DialogContent,
  FormHelperText,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { selectWorkflowSlice } from "@state/workflow";
import { Delete } from "@mui/icons-material";
import { ModalTypes } from "@components/modal/modals.tsx";
import { useApi } from "../../../api/useApi.ts";
import LoadingButton from "@mui/lab/LoadingButton";

export const EditModelModal = () => {
  const { closeModal, openedModalContext, openModal } =
    useStore(selectModalSlice);
  const { findModel, updateModel } = useStore(selectInventorySlice);
  const { workflowStages } = useStore(selectWorkflowSlice);
  const api = useApi();
  const model = findModel(openedModalContext.modelId);

  const [name, setName] = useState(model?.name || "");
  const [nameError, setNameError] = useState(false);
  const [stages, setStages] = useState(
    workflowStages
      .map(
        (_, i) =>
          model?.collection.find((stage) => stage.stage === i)?.amount || 0,
      )
      .map(String),
  );

  const [stagesError, setStagesError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    closeModal();
  };

  const handleUpdateModel = async () => {
    if (!model) {
      return;
    }
    if (stages.find((stage) => Number(stage) < 0)) {
      return;
    }
    if (stages.reduce((total, current) => total + Number(current), 0) <= 0) {
      setStagesError(true);
      return;
    }

    setLoading(true);
    await api.updateModel(model.id, {
      name,
      miniatures: stages.map((amount, index) => ({
        amount: Number(amount),
        stage: index,
      })),
    });
    updateModel({
      ...model,
      name,
      collection: stages.map((amount, index) => ({
        amount: Number(amount),
        stage: index,
      })),
    });
    handleClose();
    setLoading(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleUpdateModel();
  };

  return (
    <>
      <DialogContent>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Typography>
            Below you can change the name of <strong>{model?.name}</strong>, or
            leave it the same.
          </Typography>
          <Stack spacing={1}>
            <Box sx={{ mt: 2 }}>
              <TextField
                error={nameError}
                id="new-model-name-input"
                label="Model name"
                autoComplete="off"
                autoFocus
                value={name}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setNameError(false);
                  setName(event.target.value);
                }}
                helperText={
                  nameError ? "The name of a model cannot be empty!" : ""
                }
                fullWidth
              />
            </Box>

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
                    error={Number(stages[index]) < 0 || stagesError}
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
                      setStagesError(false);
                      const newStages = [...stages];
                      newStages[index] = event.target.value;
                      setStages(newStages);
                    }}
                    fullWidth
                  />
                </Box>
              ))}
            </Stack>
            <FormHelperText
              error={stagesError}
              sx={{
                display: stagesError ? "inline-block" : "none",
              }}
            >
              Your total amount of miniatures must at least be 1
            </FormHelperText>
          </Stack>

          <Button type="submit" sx={{ display: "none" }} />
        </form>
      </DialogContent>
      <DialogActions sx={{ flexDirection: "row-reverse", gap: 2 }}>
        <LoadingButton
          loading={loading}
          variant={"contained"}
          onClick={handleUpdateModel}
        >
          Update model
        </LoadingButton>
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
