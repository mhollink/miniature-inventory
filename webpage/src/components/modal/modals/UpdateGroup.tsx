import Typography from "@mui/material/Typography";
import { DialogActions, DialogContent, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { ChangeEvent, FormEvent, useState } from "react";
import Box from "@mui/material/Box";
import { selectInventorySlice } from "@state/inventory";
import { useApi } from "../../../api/useApi.ts";
import LoadingButton from "@mui/lab/LoadingButton";
import { logApiFailure } from "../../../firebase/firebase.ts";
import { selectAlertSlice } from "@state/alert";
import { Alerts } from "@components/alerts/alerts.tsx";

export const UpdateGroupModal = () => {
  const { closeModal, openedModalContext } = useStore(selectModalSlice);
  const { findGroup, updateGroup } = useStore(selectInventorySlice);
  const api = useApi();
  const group = findGroup(openedModalContext.groupId);
  const { triggerAlert } = useStore(selectAlertSlice);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setNameError(false);
    closeModal();
  };

  const handleDelete = async () => {
    if (!name || name.trim().length === 0) {
      setNameError(true);
      return;
    }

    if (!group) return;

    try {
      setLoading(true);
      await api.updateGroup(group.id, name);
      triggerAlert(Alerts.UPDATE_GROUP_SUCCESS);
      updateGroup({
        ...group,
        name: name,
      });
      handleClose();
    } catch (e) {
      triggerAlert(Alerts.UPDATE_GROUP_ERROR);
      logApiFailure(e, "update group");
    } finally {
      setLoading(false);
    }
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
        <LoadingButton
          loading={loading}
          variant={"contained"}
          onClick={handleDelete}
        >
          Update group
        </LoadingButton>
      </DialogActions>
    </>
  );
};
