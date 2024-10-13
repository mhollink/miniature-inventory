import { Helmet } from "react-helmet-async";
import { Crumbs } from "@components/cumbs/Crumbs.tsx";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import { PaintCollectionTable } from "@components/paints/PaintCollectionTable.tsx";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { analytics } from "../firebase/firebase.ts";
import { logEvent } from "firebase/analytics";
import Button from "@mui/material/Button";
import { Add } from "@mui/icons-material";
import { ModalTypes } from "@components/modal/modals.tsx";
import { selectModalSlice } from "@state/modal";
import { useStore } from "@state/store.ts";

export const Paints = () => {
  const location = useLocation();
  const modal = useStore(selectModalSlice);

  useEffect(() => {
    // Send a page view event with a fixed page name
    if (!analytics) return;
    logEvent(analytics, "page_view", {
      page_title: "Paint storage",
      page_location: window.location.href,
      page_path: location.pathname,
    });
  }, [location]);

  return (
    <>
      <Helmet title="Paints" />
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pb: 4,
        }}
      >
        <Crumbs />
        <Typography variant={"h3"}>Paint storage</Typography>
        <Typography>
          Whether you're a seasoned hobbyist or just getting started, this tool
          helps you keep track of your paint collection. Organize your paints,
          check what you have at a glance, and never buy duplicates again.
        </Typography>
        <PaintCollectionTable />
        <Button
          sx={{ minWidth: "17ch" }}
          startIcon={<Add />}
          onClick={() => modal.openModal(ModalTypes.ADD_PAINT)}
        >
          Add paint
        </Button>
      </Container>
    </>
  );
};
