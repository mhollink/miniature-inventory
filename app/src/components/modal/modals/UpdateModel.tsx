import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { selectInventorySlice } from "@state/inventory";
import { ChangeEvent, FormEvent, useState } from "react";
import { DialogActions, DialogContent, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Delete } from "@mui/icons-material";
import { ModalTypes } from "@components/modal/modals.tsx";
import { useApi } from "../../../api/useApi.ts";
import LoadingButton from "@mui/lab/LoadingButton";
import { logApiFailure } from "../../../firebase/analytics.ts";
import { selectAlertSlice } from "@state/alert";
import { Alerts } from "@components/alerts/alerts.tsx";

export const EditModelModal = () => {
  const { closeModal, openedModalContext, openModal } =
    useStore(selectModalSlice);
  const { findModel, updateModel } = useStore(selectInventorySlice);
  const api = useApi();
  const model = findModel(openedModalContext.modelId);
  const { triggerAlert } = useStore(selectAlertSlice);

  const [name, setName] = useState(model?.name || "");
  const [nameError, setNameError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    closeModal();
  };

  const handleUpdateModel = async () => {
    if (!model) {
      return;
    }

    try {
      setLoading(true);
      await api.updateModel(model.id, {
        name,
        miniatures: model.collection.map(({ amount }, index) => ({
          amount: Number(amount),
          stage: index,
        })),
      });
      updateModel({
        ...model,
        name,
      });
      triggerAlert(Alerts.UPDATE_MODEL_SUCCESS);
      handleClose();
    } catch (e) {
      triggerAlert(Alerts.UPDATE_MODEL_ERROR);
      logApiFailure(e, "update model");
    } finally {
      setLoading(false);
    }
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
            Below you can change the name of <strong>{model?.name}</strong>.
          </Typography>
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
