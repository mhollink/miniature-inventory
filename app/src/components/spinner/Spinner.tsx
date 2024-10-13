import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material";
import Typography from "@mui/material/Typography";

export const Spinner = () => (
  <Box
    flexGrow={1}
    sx={{
      width: "100%",
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 4,
      backgroundColor: (theme) => theme.palette.background.default,
      color: (theme) => theme.palette.text.primary,
    }}
  >
    <CircularProgress size={70} />{" "}
    <Typography variant={"h6"}>Loading...</Typography>
  </Box>
);
