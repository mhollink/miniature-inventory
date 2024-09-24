import createTheme from "@mui/material/styles/createTheme";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#008080",
      light: "#4CBBBB",
      dark: "#004C4C",
      contrastText: "#FFF",
    },
    secondary: {
      main: "#A4C639",
      light: "#D7FF6B",
      dark: "#738C0A",
      contrastText: "#000",
    },
    info: {
      main: "#40E0D0",
      light: "#76FFF5",
      dark: "#00ADA0",
      contrastText: "#000",
    },
    success: {
      main: "#00C853",
      light: "#5EF294",
      dark: "#008C38",
      contrastText: "#FFF",
    },
    warning: {
      main: "#C0CA33",
      light: "#F5FF6E",
      dark: "#8C9900",
      contrastText: "#000",
    },
    error: {
      main: "#8B4513",
      light: "#BF7D45",
      dark: "#572100",
      contrastText: "#FFF",
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark", // Sets the theme to dark mode
    primary: {
      main: "#4CBBBB", // Adjusted for better contrast on dark backgrounds
      light: "#76FFF5",
      dark: "#004C4C",
      contrastText: "#FFF",
    },
    secondary: {
      main: "#D7FF6B",
      light: "#FFFFA1",
      dark: "#738C0A",
      contrastText: "#000",
    },
    info: {
      main: "#40E0D0",
      light: "#76FFF5",
      dark: "#00ADA0",
      contrastText: "#FFF", // Using white text on darker background
    },
    success: {
      main: "#00C853",
      light: "#5EF294",
      dark: "#008C38",
      contrastText: "#FFF",
    },
    warning: {
      main: "#C0CA33",
      light: "#F5FF6E",
      dark: "#8C9900",
      contrastText: "#000",
    },
    error: {
      main: "#BF7D45", // Lightened for visibility on dark backgrounds
      light: "#E29970",
      dark: "#572100",
      contrastText: "#FFF",
    },
    background: {
      default: "#121212", // Typical dark background
      paper: "#1E1E1E", // Slightly lighter for elements like cards
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#B0B0B0", // Slightly muted for secondary text
    },
  },
});
