import Container from "@mui/material/Container";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet-async";
import Typography from "@mui/material/Typography";
import { ThemeToggle } from "@components/dark-mode/ThemeToggle.tsx";

export const Settings: FunctionComponent = () => {
  return (
    <>
      <Helmet title="Settings" />
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant={"h3"}>Settings</Typography>
        <ThemeToggle />
      </Container>
    </>
  );
};
