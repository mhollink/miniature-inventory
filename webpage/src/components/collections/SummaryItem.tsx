import { ReactNode } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";

export const SummaryItem = ({
  icon,
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
        color: "white",
        backgroundColor: "rgb(0,0,0,0.3)",
        p: isMobile ? 0.5 : 2,
        width: `${size}%`,
        borderRadius: 2,
      }}
    >
      <Stack
        direction={"row"}
        justifyContent="space-between"
        alignItems={isMobile ? "center" : "stretch"}
        flexGrow={1}
        sx={{
          pr: 2,
        }}
      >
        {icon}
        <Typography fontWeight="bolder" fontSize={"2rem"}>
          {count}
        </Typography>
      </Stack>
      <Typography variant="h5" textAlign="end">
        {label}
      </Typography>
    </Stack>
  );
};
