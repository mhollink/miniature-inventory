import Typography from "@mui/material/Typography";
import { AlertTitle } from "@mui/material";

export const ErrorCreatingGroup = () => (
  <>
    <AlertTitle>Failed to create group</AlertTitle>
    <Typography>
      An error occurred while creating a group. Please try again.
    </Typography>
    <Typography>
      If the problem persist email me at support@miniature-inventory.nl{" "}
    </Typography>
  </>
);
