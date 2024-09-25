import Container from "@mui/material/Container";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet-async";
import Typography from "@mui/material/Typography";
import { ThemeToggle } from "@components/dark-mode/ThemeToggle.tsx";
import { Crumbs } from "@components/cumbs/Crumbs.tsx";
import Divider from "@mui/material/Divider";
import { WorkflowEditForm } from "@components/workflow/SettingsInput.tsx";

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
        <Crumbs />
        <Typography variant={"h3"}>Settings</Typography>
        <Divider textAlign={"left"}>
          <Typography variant={"h5"}>Application settings</Typography>
        </Divider>
        <ThemeToggle />

        <Divider textAlign={"left"}>
          <Typography variant={"h5"}>Workflow</Typography>
        </Divider>
        <WorkflowEditForm />
      </Container>
    </>
  );
};
