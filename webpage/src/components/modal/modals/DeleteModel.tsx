import Typography from "@mui/material/Typography";
import { DialogActions, DialogContent, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { ChangeEvent, useState } from "react";
import Box from "@mui/material/Box";
import { selectInventorySlice } from "@state/inventory";
import Alert from "@mui/material/Alert";
import { ModalTypes } from "@components/modal/modals.tsx";

export const DeleteModelModal = () => {
  const { closeModal, openModal, openedModalContext } =
    useStore(selectModalSlice);
  const { findModel, deleteModel } = useStore(selectInventorySlice);

  const model = findModel(openedModalContext.modelId);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);

  const handleClose = (deleted: boolean) => {
    setNameError(false);
    if (deleted) closeModal();
    else
      openModal(ModalTypes.EDIT_MODEL, {
        modelId: openedModalContext.modelId,
      });
  };

  const handleDelete = () => {
    if (name.toLowerCase().trim() !== model?.name.toLowerCase().trim()) {
      setNameError(true);
      return;
    }
    deleteModel(openedModalContext.modelId);
    handleClose(true);
  };

  return (
    <>
      <DialogContent>
        <form autoComplete="off">
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
        <Button variant={"contained"} onClick={handleDelete} color={"error"}>
          Delete model
        </Button>
      </DialogActions>
    </>
  );
};
