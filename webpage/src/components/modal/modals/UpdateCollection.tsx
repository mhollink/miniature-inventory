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
import { logApiFailure } from "../../../firebase/analytics.ts";
import { selectAlertSlice } from "@state/alert";
import { Alerts } from "@components/alerts/alerts.tsx";

export const UpdateCollectionModal = () => {
  const { closeModal, openedModalContext } = useStore(selectModalSlice);
  const { updateCollection, findCollection } = useStore(selectInventorySlice);
  const api = useApi();
  const collection = findCollection(openedModalContext.collectionId);
  const { triggerAlert } = useStore(selectAlertSlice);

  const [name, setName] = useState(collection?.name || "");
  const [nameError, setNameError] = useState(false);
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

    if (!collection) return;

    try {
      setLoading(true);
      await api.updateCollection(collection.id, name);
      triggerAlert(Alerts.UPDATE_COLLECTION_SUCCESS);
      updateCollection({
        ...collection,
        name: name,
      });
      handleClose();
    } catch (e) {
      triggerAlert(Alerts.UPDATE_COLLECTION_ERROR);
      logApiFailure(e, "update collection");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAddCollection();
  };

  return (
    <>
      <DialogContent>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Typography>
            Choose a new name for your <strong>{collection?.name}</strong>{" "}
            collection
          </Typography>
          <Box sx={{ mt: 2 }}>
            <TextField
              error={nameError}
              id="update-collection-name-input"
              label="Collection name"
              autoComplete="off"
              autoFocus
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
          Update collection
        </LoadingButton>
      </DialogActions>
    </>
  );
};
