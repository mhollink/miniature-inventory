import { ReactNode } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

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
}) => (
  <Box
    sx={{
      color: "white",
      backgroundColor: "rgb(0,0,0,0.3)",
      p: 2,
      width: `${size}%`,
      borderRadius: 2,
    }}
  >
    <Stack direction={"row"} justifyContent="space-between">
      {icon}
      <Typography fontWeight="bolder" fontSize={"2rem"}>
        {count}
      </Typography>
    </Stack>
    <Typography variant="h5" textAlign="end">
      {label}
    </Typography>
  </Box>
);
