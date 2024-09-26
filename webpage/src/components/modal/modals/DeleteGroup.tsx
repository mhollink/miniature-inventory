import Typography from "@mui/material/Typography";
import { DialogActions, DialogContent, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { ChangeEvent, useState } from "react";
import Box from "@mui/material/Box";
import { selectInventorySlice, selectModelsForGroup } from "@state/inventory";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";

export const DeleteGroupModal = () => {
  const navigate = useNavigate();
  const { closeModal, openedModalContext } = useStore(selectModalSlice);
  const { findGroup, deleteGroup } = useStore(selectInventorySlice);
  const group = findGroup(openedModalContext.groupId);
  const models = useStore(selectModelsForGroup(openedModalContext.groupId));
  const modelCount = models
    .flatMap((models) => models.collection)
    .reduce((a, b) => a + b.amount, 0);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);

  const handleClose = () => {
    setNameError(false);
    closeModal();
  };

  const handleDelete = () => {
    if (name.toLowerCase().trim() !== group?.name.toLowerCase().trim()) {
      setNameError(true);
      return;
    }
    deleteGroup(openedModalContext.groupId);
    navigate("/collections");
    handleClose();
  };

  return (
    <>
      <DialogContent>
        <form autoComplete="off">
          <Alert severity={"warning"} variant={"filled"} sx={{ mb: 2 }}>
            You are about to delete the group "{group?.name}". This will also
            delete all the {modelCount} miniatures stored in that group!
          </Alert>
          <Typography>
            Please confirm, please type "{group?.name}" in the box below{" "}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              error={nameError}
              id="delete-group-name-input"
              label="Group name"
              autoFocus
              autoComplete="off"
              value={name}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setNameError(false);
                setName(event.target.value);
              }}
              helperText={
                nameError ? "The name must be a match to the group name!" : ""
              }
              fullWidth
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant={"contained"} onClick={handleDelete} color={"error"}>
          Delete group
        </Button>
      </DialogActions>
    </>
  );
};
