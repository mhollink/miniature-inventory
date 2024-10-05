import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export const GenericErrorMessage = ({
  action,
  type,
}: {
  action: string;
  type: string;
}) => (
  <Typography>
    Something went wrong while {action} your {type}. Please try again, and if
    the problem persists contact me at{" "}
    <Link href="mailto:support@miniature-inventory.nl">
      support@miniature-inventory.nl
    </Link>
  </Typography>
);
