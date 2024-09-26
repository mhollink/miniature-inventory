import { DialogActions, DialogContent } from "@mui/material";
import Button from "@mui/material/Button";
import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { selectInventorySlice } from "@state/inventory";
import { selectWorkflowSlice } from "@state/workflow";
import Typography from "@mui/material/Typography";

export const ExportStorageModal = () => {
  const { closeModal } = useStore(selectModalSlice);
  const inventory = useStore(selectInventorySlice);
  const workflow = useStore(selectWorkflowSlice);

  const handleClose = () => {
    closeModal();
  };

  const handleDownload = () => {
    download(
      JSON.stringify({ inventory, workflow }),
      "miniature-inventory.json",
      "application/json",
    );
    handleClose();
  };

  function download(content: string, fileName: string, contentType: string) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <>
      <DialogContent>
        <Typography>
          You can export your the state of your miniature inventory to a file.
          This will allow you to keep it safe and import it again when you need
          to make edits.
          <br />
          <br />
          You can also use the export/import functionality to continue editing
          on another device while cloud storage is not implemented.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant={"contained"} onClick={handleDownload}>
          Download
        </Button>
      </DialogActions>
    </>
  );
};
