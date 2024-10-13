import { Helmet } from "react-helmet-async";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Crumbs } from "@components/cumbs/Crumbs.tsx";
import { useStore } from "@state/store.ts";
import { selectInventorySlice } from "@state/inventory";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { selectModalSlice } from "@state/modal";
import { ModalTypes } from "@components/modal/modals.tsx";
import { CollectionAccordion } from "@components/collections/CollectionAccordion.tsx";
import { DragDropContext } from "@hello-pangea/dnd";
import { Fragment, useEffect } from "react";
import { SportsBarOutlined } from "@mui/icons-material";
import { selectAccountSlice } from "@state/account";
import { MAX_COLLECTIONS } from "../constants.ts";
import { useLocation } from "react-router-dom";
import { analytics } from "../firebase/firebase.ts";
import { logEvent } from "firebase/analytics";
import { Summary } from "@components/collections/Summary.tsx";
import { useCollectionSorting } from "@hooks/useCollectionSorting.ts";

export const Collections = () => {
  const inventory = useStore(selectInventorySlice);
  const { supporter } = useStore(selectAccountSlice);
  const modal = useStore(selectModalSlice);
  const updateGroups = useCollectionSorting();

  const location = useLocation();

  useEffect(() => {
    // Send a page view event with a fixed page name
    if (!analytics) return;
    logEvent(analytics, "page_view", {
      page_title: "Collections",
      page_location: window.location.href,
      page_path: location.pathname,
    });
  }, [location]);

  return (
    <>
      <Helmet title="My inventory" />
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Crumbs />
        <Typography variant={"h3"}>Inventory</Typography>
        <Summary />

        {inventory.collections.length === 0 && (
          <Alert severity="info" variant={"filled"}>
            You currently have no collections. Let's start by creating your
            first collection using the button below.
          </Alert>
        )}

        <DragDropContext onDragEnd={updateGroups}>
          {inventory.collections
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((collection, index) => (
              <Fragment key={collection.id}>
                <CollectionAccordion collection={collection} />
                {!supporter && index === 0 && (
                  <Button
                    onClick={() =>
                      window.open(
                        "https://www.buymeacoffee.com/mhollink",
                        "_blank",
                      )
                    }
                    sx={{
                      backgroundColor: "#F9C74F",
                      color: (theme) => theme.palette.common.black,
                      fontWeight: "bold",
                      padding: (theme) => theme.spacing(2),
                      borderRadius: "8px",
                      "&:hover": {
                        backgroundColor: "#F6B93A",
                      },
                    }}
                    startIcon={<SportsBarOutlined fontSize={"large"} />}
                  >
                    Support this page by buying me a beer!
                  </Button>
                )}
              </Fragment>
            ))}
        </DragDropContext>

        {supporter || inventory.collections.length < MAX_COLLECTIONS ? (
          <Button
            sx={{ my: 4 }}
            fullWidth
            onClick={() => modal.openModal(ModalTypes.CREATE_COLLECTION)}
          >
            Create a new Collection
          </Button>
        ) : (
          <>
            <Alert severity={"info"}>
              <Typography>
                Creating more than {MAX_COLLECTIONS} collections is currently
                limited to supporters only.
              </Typography>
            </Alert>
            <Button sx={{ mb: 4 }} disabled fullWidth>
              Create a new Collection
            </Button>
          </>
        )}
      </Container>
    </>
  );
};
