import Typography from "@mui/material/Typography";
import {
  Autocomplete,
  DialogActions,
  DialogContent,
  TextField,
} from "@mui/material";
import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { selectInventorySlice } from "@state/inventory";
import { ChangeEvent, useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

type CollectionOption = {
  id: string;
  label: string;
};

export const CreateGroupModal = () => {
  const { closeModal } = useStore(selectModalSlice);
  const { addGroup } = useStore(selectInventorySlice);
  const { collections } = useStore(selectInventorySlice);

  const dropdownOptions = collections.map((collection) => ({
    id: collection.id,
    label: collection.name,
  }));

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);

  const [collection, setCollection] = useState<CollectionOption | null>(null);
  const [collectionError, setCollectionError] = useState(false);

  const handleClose = () => {
    setNameError(false);
    setCollectionError(false);
    closeModal();
  };

  const handleAddGroup = () => {
    const hasCollection = !!collection;
    const hasName = !!name && name.trim().length !== 0;
    if (!hasCollection || !hasName) {
      setCollectionError(!hasCollection);
      setNameError(!hasName);
      return;
    }

    addGroup(collection.id, name);
    handleClose();
  };

  return (
    <>
      <DialogContent>
        <form autoComplete="off">
          <Stack spacing={1}>
            <Typography>
              Select the collection the new group needs to be added to
            </Typography>
            <Autocomplete
              disablePortal
              options={dropdownOptions}
              value={collection}
              onChange={(_, newValue: CollectionOption | null) => {
                setCollectionError(false);
                setCollection(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="new-group-collection-input"
                  error={collectionError}
                  autoComplete="off"
                  autoFocus
                  helperText={
                    collectionError ? "You need to select a collection!" : ""
                  }
                  label="Collection"
                />
              )}
            />
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
