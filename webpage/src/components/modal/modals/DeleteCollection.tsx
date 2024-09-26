import Typography from "@mui/material/Typography";
import { DialogActions, DialogContent, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { ChangeEvent, FormEvent, useState } from "react";
import Box from "@mui/material/Box";
import { selectInventorySlice } from "@state/inventory";
import Alert from "@mui/material/Alert";

export const DeleteCollectionModal = () => {
  const { closeModal, openedModalContext } = useStore(selectModalSlice);
  const { findCollection, deleteCollection } = useStore(selectInventorySlice);
  const collection = findCollection(openedModalContext.collectionId);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);

  const handleClose = () => {
    setNameError(false);
    closeModal();
  };

  const handleDelete = () => {
    if (name.toLowerCase().trim() !== collection?.name.toLowerCase().trim()) {
      setNameError(true);
      return;
    }
    deleteCollection(openedModalContext.collectionId);
    handleClose();
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
            You are about to delete one of your collections
          </Alert>
          <Typography>
            Please confirm, please type "{collection?.name}" in the box below{" "}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              error={nameError}
              id="delete-collection-name-input"
              label="Collection name"
              value={name}
              autoComplete="off"
              autoFocus
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setNameError(false);
                setName(event.target.value);
              }}
              helperText={
                nameError
                  ? "The name must be a match to the collection name!"
                  : ""
              }
              fullWidth
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant={"contained"} onClick={handleDelete} color={"error"}>
          Delete collection
        </Button>
      </DialogActions>
    </>
  );
};
