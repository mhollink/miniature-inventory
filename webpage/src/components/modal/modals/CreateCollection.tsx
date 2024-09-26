import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { selectInventorySlice } from "@state/inventory";
import { ChangeEvent, useState } from "react";
import { DialogActions, DialogContent, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export const CreateNewCollectionModal = () => {
  const { closeModal } = useStore(selectModalSlice);
  const { addCollection } = useStore(selectInventorySlice);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);

  const handleClose = () => {
    setNameError(false);
    closeModal();
  };

  const handleAddCollection = () => {
    if (!name || name.trim().length === 0) {
      setNameError(true);
      return;
    }
    addCollection(name);
    handleClose();
  };

  return (
    <>
      <DialogContent>
        <form autoComplete="off">
          <Typography>Choose a name for your new collection</Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              error={nameError}
              id="new-collection-name-input"
              label="Collection name"
              autoComplete="off"
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
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        <Button variant={"contained"} onClick={handleAddCollection} autoFocus>
          Add collection
        </Button>
      </DialogActions>
    </>
  );
};
