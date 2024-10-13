import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { selectDrawerSlice } from "@state/drawer";
import { useStore } from "@state/store.ts";
import { drawers } from "./drawers.tsx";

export const DrawerContainer = () => {
  const state = useStore(selectDrawerSlice);
  const theme = useTheme();

  return [...drawers.entries()].map(([type, props]) => {
    return (
      <Drawer
        anchor={"right"}
        key={type}
        open={type === state.openedDrawer}
        onClose={() => state.closeDrawer()}
        PaperProps={{
          sx: {
            maxWidth: "72ch",
          },
        }}
      >
        <Stack
          direction="row"
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            boxShadow: 5,
          }}
          justifyContent="center"
          alignItems="start"
        >
          <Box
            flexGrow={1}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }}
          >
            <Typography variant="h4">{props.title}</Typography>
          </Box>
          <IconButton
            onClick={() => state.closeDrawer()}
            sx={{
              color: theme.palette.primary.light,
              "&:hover": {
                color: theme.palette.primary.main,
                backgroundColor: theme.palette.primary.light,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
        <Box
          sx={{
            px: 2,
          }}
        >
          {props.children}
        </Box>
      </Drawer>
    );
  });
};
