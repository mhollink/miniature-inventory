import { useStore } from "@state/store.ts";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DrawerTypes } from "@components/drawer/drawers.tsx";
import Link from "@mui/material/Link";

export const AppFooter = () => {
  const { openDrawer } = useStore();
  return (
    <Box
      id={"footer"}
      component="footer"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.primary.main
            : theme.palette.background.paper,
        color: (theme) =>
          theme.palette.mode === "light"
            ? theme.palette.primary.contrastText
            : theme.palette.text.primary,
        p: 1,
        textAlign: "center",
        textTransform: "uppercase",

        width: "100%",
      }}
    >
      <Typography variant="body2" sx={{ m: 1 }}>
        <Typography
          sx={{
            cursor: "pointer",
            textDecoration: "underline",
          }}
          color="info"
          component="span"
          onClick={(e) => {
            e.preventDefault();
            openDrawer(DrawerTypes.CHANGELOG);
          }}
        >
          v{BUILD_VERSION}
        </Typography>{" "}
        | updated {BUILD_DATE} | Developed by{" "}
        <Link href="https://github.com/mhollink" color="info">
          mhollink
        </Link>{" "}
        | © 2024
      </Typography>
      <Typography variant="body2" sx={{ m: 1 }}></Typography>
    </Box>
  );
};
