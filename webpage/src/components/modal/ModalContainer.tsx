import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";

import { selectModalSlice } from "@state/modal";
import { useStore } from "@state/store.ts";
import { modals } from "./modals.tsx";
import { DialogTitle } from "@mui/material";

export const ModalContainer = () => {
  const { closeModal, openedModal, openedModalContext } =
    useStore(selectModalSlice);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!openedModal || !modals.has(openedModal)) {
    // No model is shown, return...
    return null;
  }

  const currentModal = modals.get(openedModal)!;
  const { title, onClose } = openedModalContext || {};
  return (
    <Dialog
      open={true} // handled by the modal container, so this should always be true
      onClose={onClose ? onClose : () => closeModal()}
      fullScreen={isMobile}
      fullWidth={true}
      maxWidth={"md"}
    >
      <DialogTitle>
        <Typography
          variant="h4"
          component={"span"}
          flexGrow={1}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {currentModal.icon} {title || currentModal.title}
        </Typography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose ? onClose : () => closeModal()}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      {currentModal.children}
    </Dialog>
  );
};
