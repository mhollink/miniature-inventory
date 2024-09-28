import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { selectInventorySlice } from "@state/inventory";
import { ChangeEvent, FormEvent, useState } from "react";
import { DialogActions, DialogContent, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useApi } from "../../../api/useApi.ts";
import LoadingButton from "@mui/lab/LoadingButton";

export const CreateNewCollectionModal = () => {
  const { closeModal } = useStore(selectModalSlice);
  const { addCollection } = useStore(selectInventorySlice);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const api = useApi();
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setNameError(false);
    closeModal();
  };

  const handleAddCollection = async () => {
    if (!name || name.trim().length === 0) {
      setNameError(true);
      return;
    }

    setLoading(true);
    const { id } = await api.createCollection(name);
    addCollection(id, name);
    handleClose();
    setLoading(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAddCollection();
  };

  return (
    <>
      <DialogContent>
        <form autoComplete="off" onSubmit={handleSubmit} autoFocus={true}>
          <Typography>Choose a name for your new collection</Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              error={nameError}
              id="new-collection-name-input"
              label="Collection name"
              autoComplete="off"
              autoFocus={true}
              value={name}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setNameError(false);
                setName(event.target.value);
              }}
              helperText={
                nameError ? "The name of a collection cannot be empty!" : ""
              }
              fullWidth
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <LoadingButton
          loading={loading}
          variant={"contained"}
          onClick={handleAddCollection}
        >
          Add collection
        </LoadingButton>
      </DialogActions>
    </>
  );
};
