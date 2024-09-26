import { DialogActions, DialogContent, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { selectInventorySlice } from "@state/inventory";
import { selectWorkflowSlice } from "@state/workflow";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ChangeEvent, useState } from "react";
import { AttachFileOutlined } from "@mui/icons-material";
import { useJsonValidation } from "@hooks/useJsonValidation.ts";

export const ImportStorageModal = () => {
  const { closeModal } = useStore(selectModalSlice);
  const { importInventory } = useStore(selectInventorySlice);
  const { setWorkflowStages } = useStore(selectWorkflowSlice);
  const [importData, setImportData] = useState("");
  const [importError, setImportError] = useState(false);
  const { validateKeys } = useJsonValidation();

  const handleClose = () => {
    closeModal();
  };

  const handleImport = () => {
    const importedState = JSON.parse(importData);

    const hasRequiredKeys = validateKeys(importedState, [
      "inventory",
      "inventory.collections",
      "inventory.collections[].id",
      "inventory.collections[].name",
      "inventory.collections[].groups",
      "inventory.groups",
      "inventory.groups[].id",
      "inventory.groups[].name",
      "inventory.groups[].models",
      "inventory.models[].id",
      "inventory.models[].name",
      "inventory.models[].collection",
      "inventory.models[].collection[].amount",
      "inventory.models[].collection[].stage",
      "workflow",
      "workflow.workflowStages",
    ]);

    if (!hasRequiredKeys) {
      setImportError(true);
      return;
    }

    const { inventory, workflow } = importedState;

    importInventory(inventory);
    setWorkflowStages(workflow.workflowStages);
    handleClose();
  };

  // Handler for file selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0); // Get the selected file

    if (file) {
      // Check if the file is a JSON file
      if (file.type === "application/json") {
        const reader = new FileReader();

        // Handler for when the file is successfully read
        reader.onload = () => {
          try {
            setImportData(reader.result as string);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            alert("Invalid JSON file");
          }
        };

        // Read the file as text
        reader.readAsText(file);
      } else {
        alert("Please select a JSON file");
      }
    }

    // Clear the file input value
    event.target.value = "";
  };

  const handleButtonClick = () => {
    document.getElementById("file-input")?.click();
  };

  return (
    <>
      <DialogContent>
        <form autoComplete="off">
          <Typography>
            You can import your data by manually entering the JSON data the text
            field or via a file upload.
          </Typography>

          <Box sx={{ mt: 2 }}>
            <TextField
              error={importError}
              id="import-input"
              label="Application state (JSON)"
              autoComplete="off"
              autoFocus
              value={importData}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setImportError(false);
                setImportData(event.target.value);
              }}
              helperText={
                importError
                  ? "The JSON provided is incorrect. Not all required properties are present."
                  : ""
              }
              multiline
              rows={12}
              fullWidth
            />
          </Box>
          <Box sx={{ mt: 1 }}>
            <input
              id="file-input"
              type="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Button
              variant="contained"
              onClick={handleButtonClick}
              fullWidth
              startIcon={<AttachFileOutlined />}
            >
              Select a file
            </Button>
          </Box>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant={"contained"} onClick={handleImport}>
          Import
        </Button>
      </DialogActions>
    </>
  );
};
