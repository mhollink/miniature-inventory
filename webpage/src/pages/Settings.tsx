import Container from "@mui/material/Container";
import { FunctionComponent } from "react";
import { Helmet } from "react-helmet-async";
import Typography from "@mui/material/Typography";
import { ThemeToggle } from "@components/dark-mode/ThemeToggle.tsx";
import { Crumbs } from "@components/cumbs/Crumbs.tsx";
import Divider from "@mui/material/Divider";
import { WorkflowEditForm } from "@components/workflow/SettingsInput.tsx";
import Button from "@mui/material/Button";
import { DeleteForever } from "@mui/icons-material";

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

        <Button
          variant="outlined"
          color={"error"}
          startIcon={<DeleteForever />}
          endIcon={<DeleteForever />}
          onClick={() => {
            const sure = confirm(
              "Deleting application storage will wipe all your collections, groups and miniatures! \n\nAre you sure?!",
            );
            if (sure) {
              localStorage.clear();
              window.location.href = "/";
            }
          }}
        >
          Delete application storage
        </Button>

        <Divider textAlign={"left"}>
          <Typography variant={"h5"}>Workflow</Typography>
        </Divider>
        <WorkflowEditForm />
      </Container>
    </>
  );
};
