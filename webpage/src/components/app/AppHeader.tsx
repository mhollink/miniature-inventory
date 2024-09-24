import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import { FaRoute } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { AppLogo } from "@components/app/AppLogo.tsx";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";

export const AppHeader = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // List of buttons
  const buttons = [
    {
      icon: <FaRoute />,
      label: "Roadmap",
      onClick: () => navigate("/roadmap"),
    },
    {
      icon: <IoMdSettings />,
      label: "Settings",
      onClick: () => navigate("/settings"),
    },
  ];

  const title = "Mini Inventory";
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box
            sx={{
              p: 1.5,
            }}
            flexGrow={1}
          >
            <Link
              href={"/"}
              underline="none"
              sx={{
                color: theme.palette.common.white,
                display: "inline-flex",
                pr: 2,
                alignItems: "center",
              }}
            >
              <AppLogo />
              <Typography
                variant={"h1"}
                component={"span"}
                sx={{ fontSize: "2rem", textAlign: "center" }}
              >
                {title}
              </Typography>
            </Link>
          </Box>

          {!isMobile && (
            <>
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  sx={{ p: 1, pt: 1, pb: 1, m: 1, minWidth: "144px" }}
                  variant="text"
                  color="inherit"
                  onClick={button.onClick}
                  size="large"
                  startIcon={button.icon}
                >
                  {button.label}
                </Button>
              ))}
            </>
          )}

          {/* Hamburger Menu for Mobile */}
          {isMobile && (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            minWidth: "42ch",
          },
        }}
      >
        <Box
          role="presentation"
          onClick={handleDrawerToggle}
          onKeyDown={handleDrawerToggle}
        >
          <List>
            <ListItem>
              <AppLogo large />
              <ListItemText
                primaryTypographyProps={{ fontSize: "2rem" }}
                primary={title}
              />
            </ListItem>
            <Divider sx={{ mx: 2 }} />
            {buttons.map((button) => (
              <ListItemButton
                onClick={button.onClick}
                key={button.label}
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light,
                  },
                }}
              >
                {button.icon && (
                  <ListItemIcon
                    sx={{
                      color: theme.palette.primary.contrastText,
                      fontSize: "1.5rem",
                    }}
                  >
                    {button.icon}
                  </ListItemIcon>
                )}
                <ListItemText
                  primaryTypographyProps={{ fontSize: "1.5rem" }}
                  primary={button.label}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};
