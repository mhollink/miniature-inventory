import { AppHeader } from "@components/app/AppHeader.tsx";
import { AppFooter } from "@components/app/AppFooter.tsx";
import { AppContent } from "@components/app/AppContent.tsx";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { Helmet } from "react-helmet-async";
import { darkTheme, theme } from "../../theme.ts";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { useStore } from "@state/store.ts";
import { selectDarkModeSlice } from "@state/dark-mode";
import { InitialLoad } from "@components/initial-load/InitialLoad.tsx";

export const App = () => {
  const { darkMode } = useStore(selectDarkModeSlice);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : theme}>
      <InitialLoad>
        <Stack sx={{ height: "100vh" }}>
          <Helmet
            defaultTitle="Miniature Inventory"
            titleTemplate={`%s | Miniature Inventory`}
          />
          <>
            <Box
              flexGrow={1}
              sx={{
                backgroundColor: (theme) => theme.palette.background.default,
                color: (theme) => theme.palette.text.primary,
              }}
            >
              <AppHeader />
              <AppContent />
            </Box>
            <Box>
              <AppFooter />
            </Box>
          </>
        </Stack>
      </InitialLoad>
    </ThemeProvider>
  );
};
