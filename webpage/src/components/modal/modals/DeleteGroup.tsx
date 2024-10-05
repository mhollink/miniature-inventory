import Typography from "@mui/material/Typography";
import { DialogActions, DialogContent, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { ChangeEvent, FormEvent, useState } from "react";
import Box from "@mui/material/Box";
import { selectInventorySlice, selectModelsForGroup } from "@state/inventory";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../api/useApi.ts";
import LoadingButton from "@mui/lab/LoadingButton";
import { selectAlertSlice } from "@state/alert";
import { Alerts } from "@components/alerts/alerts.tsx";
import { logApiFailure, logKeyEvent } from "../../../firebase/analytics.ts";

export const DeleteGroupModal = () => {
  const navigate = useNavigate();
  const { closeModal, openedModalContext } = useStore(selectModalSlice);
  const { findGroup, deleteGroup } = useStore(selectInventorySlice);
  const api = useApi();
  const group = findGroup(openedModalContext.groupId);
  const models = useStore(selectModelsForGroup(openedModalContext.groupId));
  const modelCount = models
    .flatMap((models) => models.collection)
    .reduce((a, b) => a + b.amount, 0);
  const { triggerAlert } = useStore(selectAlertSlice);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setNameError(false);
    closeModal();
  };

  const handleDelete = async () => {
    if (name.toLowerCase().trim() !== group?.name.toLowerCase().trim()) {
      setNameError(true);
      return;
    }

    try {
      setLoading(true);
      await api.deleteGroup(openedModalContext.groupId);
      triggerAlert(Alerts.DELETE_GROUP_SUCCESS);
      logKeyEvent("group deleted");
      deleteGroup(openedModalContext.groupId);
      navigate("/inventory");
      handleClose();
    } catch (e) {
      triggerAlert(Alerts.DELETE_GROUP_ERROR);
      logApiFailure(e, "delete group");
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
        <LoadingButton
          loading={loading}
          variant={"contained"}
          onClick={handleDelete}
          color={"error"}
        >
          Delete group
        </LoadingButton>
      </DialogActions>
    </>
  );
};
