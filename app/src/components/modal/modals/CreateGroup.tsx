import Typography from "@mui/material/Typography";
import { DialogActions, DialogContent, TextField } from "@mui/material";
import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { selectInventorySlice } from "@state/inventory";
import { ChangeEvent, FormEvent, useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useApi } from "../../../api/useApi.ts";
import LoadingButton from "@mui/lab/LoadingButton";
import { selectAlertSlice } from "@state/alert";
import { Alerts } from "@components/alerts/alerts.tsx";
import { logApiFailure, logKeyEvent } from "../../../firebase/analytics.ts";

export const CreateGroupModal = () => {
  const { closeModal, openedModalContext } = useStore(selectModalSlice);
  const { addGroup } = useStore(selectInventorySlice);
  const api = useApi();
  const { triggerAlert } = useStore(selectAlertSlice);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setNameError(false);
    closeModal();
  };

  const handleAddGroup = async () => {
    const hasName = !!name && name.trim().length !== 0;
    if (!hasName) {
      setNameError(!hasName);
      return;
    }

    try {
      setLoading(true);
      const { id } = await api.createGroup(
        openedModalContext.collectionId,
        name,
      );
      triggerAlert(Alerts.CREATE_GROUP_SUCCESS);
      logKeyEvent("group created");
      addGroup(openedModalContext.collectionId, id, name);
      handleClose();
    } catch (e) {
      triggerAlert(Alerts.CREATE_GROUP_ERROR);
      logApiFailure(e, "create group");
    } finally {
      setLoading(false);
    }
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
        <LoadingButton
          loading={loading}
          variant={"contained"}
          onClick={handleAddGroup}
        >
          Add group
        </LoadingButton>
      </DialogActions>
    </>
  );
};
