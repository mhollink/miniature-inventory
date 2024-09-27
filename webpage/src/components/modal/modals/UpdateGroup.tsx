import Typography from "@mui/material/Typography";
import { DialogActions, DialogContent, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { ChangeEvent, FormEvent, useState } from "react";
import Box from "@mui/material/Box";
import { selectInventorySlice } from "@state/inventory";

export const UpdateGroupModal = () => {
  const { closeModal, openedModalContext } = useStore(selectModalSlice);
  const { findGroup, updateGroup } = useStore(selectInventorySlice);
  const group = findGroup(openedModalContext.groupId);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);

  const handleClose = () => {
    setNameError(false);
    closeModal();
  };

  const handleDelete = () => {
    if (!name || name.trim().length === 0) {
      setNameError(true);
      return;
    }

    if (!group) return;

    updateGroup({
      ...group,
      name: name,
    });
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
          <Typography>
            Choose a new name for your <strong>{group?.name}</strong> group
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              error={nameError}
              id="update-group-name-input"
              label="Group name"
              autoFocus
              autoComplete="off"
              value={name}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setNameError(false);
                setName(event.target.value);
              }}
              helperText={
                nameError ? "The name of a group cannot be empty!" : ""
              }
              fullWidth
            />
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant={"contained"} onClick={handleDelete}>
          Update group
        </Button>
      </DialogActions>
    </>
  );
};
