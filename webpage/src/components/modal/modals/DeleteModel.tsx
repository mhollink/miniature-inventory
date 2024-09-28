import Typography from "@mui/material/Typography";
import { DialogActions, DialogContent, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { ChangeEvent, FormEvent, useState } from "react";
import Box from "@mui/material/Box";
import { selectInventorySlice } from "@state/inventory";
import Alert from "@mui/material/Alert";
import { ModalTypes } from "@components/modal/modals.tsx";
import { useApi } from "../../../api/useApi.ts";
import LoadingButton from "@mui/lab/LoadingButton";

export const DeleteModelModal = () => {
  const { closeModal, openModal, openedModalContext } =
    useStore(selectModalSlice);
  const { findModel, deleteModel } = useStore(selectInventorySlice);
  const api = useApi();

  const model = findModel(openedModalContext.modelId);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = (deleted: boolean) => {
    setNameError(false);
    if (deleted) closeModal();
    else
      openModal(ModalTypes.EDIT_MODEL, {
        modelId: openedModalContext.modelId,
      });
  };

  const handleDelete = async () => {
    if (name.toLowerCase().trim() !== model?.name.toLowerCase().trim()) {
      setNameError(true);
      return;
    }
    setLoading(true);
    await api.deleteModel(openedModalContext.modelId);
    deleteModel(openedModalContext.modelId);
    handleClose(true);
    setLoading(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleDelete();
  };

  return (
    <>
      <DialogContent>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Alert severity={"warning"} variant={"filled"} sx={{ mb: 2 }}>
            You are about to delete "{model?.name}" from the group.
          </Alert>
          <Typography>
            Please confirm, please type "{model?.name}" in the box below{" "}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              error={nameError}
              id="delete-model-name-input"
              label="Model name"
              value={name}
              autoFocus
              autoComplete="off"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setNameError(false);
                setName(event.target.value);
              }}
              helperText={
                nameError ? "The name must be a match to the model name!" : ""
              }
              fullWidth
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)}>Cancel</Button>
        <LoadingButton
          loading={loading}
          variant={"contained"}
          onClick={handleDelete}
          color={"error"}
        >
          Delete model
        </LoadingButton>
      </DialogActions>
    </>
  );
};
