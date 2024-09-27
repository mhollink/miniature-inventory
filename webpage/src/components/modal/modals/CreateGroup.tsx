import Typography from "@mui/material/Typography";
import { DialogActions, DialogContent, TextField } from "@mui/material";
import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { selectInventorySlice } from "@state/inventory";
import { ChangeEvent, FormEvent, useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export const CreateGroupModal = () => {
  const { closeModal, openedModalContext } = useStore(selectModalSlice);
  const { addGroup } = useStore(selectInventorySlice);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);

  const handleClose = () => {
    setNameError(false);
    closeModal();
  };

  const handleAddGroup = () => {
    const hasName = !!name && name.trim().length !== 0;
    if (!hasName) {
      setNameError(!hasName);
      return;
    }

    addGroup(openedModalContext.collectionId, name);
    handleClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAddGroup();
  };

  return (
    <>
      <DialogContent>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Stack spacing={1}>
            <Typography>Choose a name for your new group</Typography>
            <TextField
              error={nameError}
              id="new-group-name-input"
              label="Group name"
              value={name}
              autoComplete="off"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setNameError(false);
                setName(event.target.value);
              }}
              slotProps={{
                input: {
                  type: "text",
                },
              }}
              helperText={
                nameError ? "The name of a group cannot be empty!" : ""
              }
              fullWidth
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant={"contained"} onClick={handleAddGroup}>
          Add group
        </Button>
      </DialogActions>
    </>
  );
};
