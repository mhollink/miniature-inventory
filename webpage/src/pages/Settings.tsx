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
import ButtonGroup from "@mui/material/ButtonGroup";
import { BiExport, BiImport } from "react-icons/bi";
import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { ModalTypes } from "@components/modal/modals.tsx";

export const Settings: FunctionComponent = () => {
  const modal = useStore(selectModalSlice);
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

        <ButtonGroup
          variant="contained"
          color="inherit"
          aria-label="Basic button group"
          fullWidth
        >
          <Button
            color="inherit"
            startIcon={<BiExport />}
            onClick={() => modal.openModal(ModalTypes.EXPORT_STATE)}
          >
            Export application storage
          </Button>
          <Button
            color="inherit"
            startIcon={<BiImport />}
            onClick={() => modal.openModal(ModalTypes.IMPORT_STATE)}
          >
            Import application storage
          </Button>
        </ButtonGroup>

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
