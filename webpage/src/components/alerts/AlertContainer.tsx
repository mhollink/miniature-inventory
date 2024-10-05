import { useEffect } from "react";
import { AlertColor, AlertTitle, Portal, Slide, Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import { useStore } from "@state/store.ts";
import { selectAlertSlice } from "@state/alert";
import { alertMap } from "./alerts.tsx";
import { capitalizeFirstLetter } from "../../utils/string.ts";
import Box from "@mui/material/Box";

export const AlertContainer = () => {
  const { activeAlert, dismissAlert } = useStore(selectAlertSlice);

  // Auto hide of alerts, if configured
  useEffect(() => {
    if (activeAlert) {
      const options = alertMap.get(activeAlert)?.options;
      if (options?.autoHideAfter) {
        const timeout = setTimeout(dismissAlert, options.autoHideAfter);
        return () => clearTimeout(timeout);
      }
    }
    return () => null;
  }, [activeAlert, dismissAlert]);

  if (!activeAlert || !alertMap.has(activeAlert)) {
    // no active alert to display
    return null;
  }

  const { variant, content } = alertMap.get(activeAlert)!;
  return (
    <Portal>
      <Snackbar
        open={true}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={Slide}
        onClose={dismissAlert}
      >
        <Alert
          onClose={dismissAlert}
          variant={"filled"}
          sx={{ width: "100%" }}
          severity={variant as AlertColor}
        >
          <AlertTitle sx={{ fontWeight: "bolder" }}>
            {capitalizeFirstLetter(variant)}
          </AlertTitle>
          <Box sx={{ width: "72ch" }}>{content}</Box>
        </Alert>
      </Snackbar>
    </Portal>
  );
};
