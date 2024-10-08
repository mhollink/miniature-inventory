import { ReactNode } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Paper } from "@mui/material";

export const SummaryItem = ({
  label,
  count,
  size,
}: {
  icon: ReactNode;
  label: string;
  count: number;
  size: number;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Stack
      direction={isMobile ? "row" : "column"}
      alignItems={isMobile ? "center" : "stretch"}
      justifyContent={"space-around"}
      sx={{
        width: `${size}%`,
      }}
    >
      <Paper
        sx={{
          p: 2,
          flexGrow: 1,
        }}
        elevation={5}
      >
        <Stack
          direction={"row-reverse"}
          justifyContent="space-between"
          alignItems={isMobile ? "center" : "stretch"}
          sx={{
            width: "100%",
          }}
        >
          <Typography fontWeight="bolder" variant={"h5"}>
            {count}
          </Typography>
          <Typography variant="h5">{label}</Typography>
        </Stack>
      </Paper>
    </Stack>
  );
};
