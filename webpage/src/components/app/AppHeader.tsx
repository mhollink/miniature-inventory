import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { MouseEvent, useState } from "react";
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
import { AppLogo } from "@components/app/AppLogo.tsx";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router-dom";
import Link from "@mui/material/Link";
import { useFirebaseAuth } from "../../firebase/useFirebaseAuth.ts";
import { User } from "firebase/auth";
import { Avatar, Menu, MenuItem, Theme, Tooltip } from "@mui/material";
import { ThemeToggle } from "@components/dark-mode/ThemeToggle.tsx";
import {
  ForkRightOutlined,
  InfoOutlined,
  Lock,
  PaletteOutlined,
  Settings,
} from "@mui/icons-material";
import CategoryOutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useAuth } from "../../firebase/FirebaseAuthContext.tsx";

function stringAvatar(name: string) {
  const names = name.split(" ");
  return {
    children:
      names.length >= 2 ? `${names[0][0]}${names[1][0]}` : `${names[0][0]}`,
    sx: {
      bgcolor: (theme: Theme) => theme.palette.primary.light,
    },
  };
}

const CurrentUser = ({ currentUser }: { currentUser: User }) => {
  const navigate = useNavigate();
  const { signOut } = useFirebaseAuth();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const settings = [
    {
      icon: <Settings />,
      label: "Settings",
      onclick: () => {
        handleCloseUserMenu();
        navigate("/settings");
      },
    },
    {
      icon: <Lock />,
      label: "Logout",
      onclick: async () => {
        handleCloseUserMenu();
        await signOut();
        navigate("/");
      },
    },
  ];

  return (
    currentUser && (
      <>
        <Tooltip title="Open settings">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar
              src={currentUser.photoURL || ""}
              {...stringAvatar(currentUser.displayName || "")}
            />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {settings.map((setting) => (
            <MenuItem key={setting.label} onClick={setting.onclick}>
              <ListItemIcon>{setting.icon}</ListItemIcon>
              <Typography sx={{ textAlign: "center" }}>
                {setting.label}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
      </>
    )
  );
};

export const AppHeader = () => {
  const { user } = useAuth();

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // List of buttons
  const buttons = [
    ...(user
      ? [
          {
            icon: <CategoryOutlinedIcon />,
            label: "Inventory",
            onClick: () => navigate("/inventory"),
            active: location.pathname === "/inventory",
          },
          {
            icon: <PaletteOutlined />,
            label: "Paint Storage",
            onClick: () => navigate("/paints"),
            disabled: true,
            active: location.pathname === "/paints",
          },
        ]
      : []),
    {
      icon: <InfoOutlined />,
      label: "About",
      onClick: () => navigate("/about"),
      active: location.pathname === "/about",
    },
    {
      icon: <ForkRightOutlined />,
      label: "Roadmap",
      onClick: () => navigate("/roadmap"),
      active: location.pathname === "/roadmap",
    },
  ];

  const title = "Mini Inventory";
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* Hamburger Menu for Mobile */}
          {isTablet && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Box
            sx={{
              p: 1.5,
              display: "inline-flex",
            }}
            flexGrow={1}
          >
            <Link
              underline="none"
              onClick={() => navigate("/")}
              sx={{
                color: theme.palette.common.white,
                display: "inline-flex",
                pr: 4,
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              {!isMobile && <AppLogo />}
              {!isMobile && (
                <Typography
                  variant={"h1"}
                  component={"span"}
                  sx={{ fontSize: "2rem", textAlign: "center" }}
                >
                  {title}
                </Typography>
              )}
            </Link>

            {!isTablet && (
              <>
                {buttons.map((button, index) => (
                  <Button
                    key={index}
                    sx={{ p: 1, pt: 1, pb: 1, m: 1, minWidth: "144px" }}
                    variant="text"
                    disabled={button.disabled}
                    color={button.active ? "primary" : "inherit"}
                    onClick={button.onClick}
                    size="large"
                    startIcon={button.icon}
                  >
                    {button.label}
                  </Button>
                ))}
              </>
            )}
          </Box>

          <ThemeToggle />
          {user && <CurrentUser currentUser={user} />}
        </Toolbar>
      </AppBar>

      <Drawer
        open={drawerOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
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
          <List sx={{ pt: 0 }}>
            <ListItem
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              }}
            >
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
                disabled={button.disabled}
                sx={{
                  color: button.active
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.light,
                  },
                }}
              >
                {button.icon && (
                  <ListItemIcon
                    sx={{
                      color: button.active
                        ? theme.palette.primary.main
                        : theme.palette.text.primary,
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
