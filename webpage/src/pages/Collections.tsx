import { Helmet } from "react-helmet-async";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Crumbs } from "@components/cumbs/Crumbs.tsx";
import Stack from "@mui/material/Stack";
import SquareOutlinedIcon from "@mui/icons-material/SquareOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useStore } from "@state/store.ts";
import { ModelStage, selectInventorySlice } from "@state/inventory";
import { SummaryItem } from "@components/collections/SummaryItem";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { selectModalSlice } from "@state/modal";
import { ModalTypes } from "@components/modal/modals.tsx";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { CollectionAccordion } from "@components/collections/CollectionAccordion.tsx";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { moveItem, moveItemBetweenLists } from "../utils/array.ts";
import { Fragment, useEffect, useState } from "react";
import { useApi } from "../api/useApi.ts";
import { SportsBarOutlined } from "@mui/icons-material";
import { selectAccountSlice } from "@state/account";
import { MAX_COLLECTIONS } from "../constants.ts";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Paper,
} from "@mui/material";
import { GroupProgress } from "@components/groups/GroupProgress.tsx";
import { useLocation } from "react-router-dom";
import { analytics } from "../firebase/firebase.ts";
import { logEvent } from "firebase/analytics";
import { logApiFailure, logKeyEvent } from "../firebase/analytics.ts";
import { selectAlertSlice } from "@state/alert";
import { Alerts } from "@components/alerts/alerts.tsx";
import { calculateSumForEachStage } from "../utils/collection.ts";

const Summary = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const inventory = useStore(selectInventorySlice);
  const collections = inventory.collections.length;
  const groups = inventory.groups.length;
  const models = inventory.models
    .flatMap((models) => models.collection.map((c) => c.amount as number))
    .reduce((a, b) => a + b, 0);

  const [visibleCollections, setVisibleCollections] = useState<string[]>([]);
  const handleCheckboxChange = (collectionId: string) => {
    setVisibleCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
            .map((c) => inventory.findCollection(c))
            .filter((c) => !!c)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((c) => c.id),
    );
  };

  const progressionPerCollection = inventory.collections
    .map((collection) => {
      const data = collection.groups.flatMap((group) => {
        const models = inventory.findGroup(group)?.models || [];
        return models
          .flatMap(inventory.findModel)
          .flatMap((model) => model?.collection || []);
      });
      return {
        [collection.id]: calculateSumForEachStage(data),
      };
    })
    .reduce((t, c) => ({ ...t, ...c }), {} as Record<string, ModelStage[]>);

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: isMobile ? 1.5 : 3,
          borderRadius: 0,
        }}
      >
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent="space-between"
          spacing={isMobile ? 1 : 2}
        >
          <SummaryItem
            icon={
              <CategoryOutlinedIcon sx={{ fontSize: isMobile ? 30 : 40 }} />
            }
            label={collections === 1 ? "Collection" : "Collections"}
            count={collections}
            size={isMobile ? 100 : 33}
          />
          <SummaryItem
            icon={<SquareOutlinedIcon sx={{ fontSize: isMobile ? 30 : 40 }} />}
            label={groups === 1 ? "Group" : "Groups"}
            count={groups}
            size={isMobile ? 100 : 33}
          />
          <SummaryItem
            icon={<CircleOutlinedIcon sx={{ fontSize: isMobile ? 30 : 40 }} />}
            label={models === 1 ? "Miniature" : "Miniatures"}
            count={models}
            size={isMobile ? 100 : 33}
          />
        </Stack>
      </Paper>
      <Typography variant={"h5"} flexGrow={1}>
        Total cumulative progress
      </Typography>
      <GroupProgress
        totalCollection={
          visibleCollections.length === 0
            ? [inventory.models.flatMap((model) => model.collection)]
            : visibleCollections.map((c) => progressionPerCollection[c])
        }
      />
      <FormGroup>
        <Stack direction={"row"} gap={2}>
          {inventory.collections
            .filter(
              // removes any collection that have no models inside.
              (collection) => progressionPerCollection[collection.id].length,
            )
            .sort((a, b) => a?.name.localeCompare(b.name))
            .map((collection) => (
              <FormControlLabel
                key={collection.id}
                control={
                  <Checkbox
                    checked={visibleCollections.includes(collection.id)}
                    onChange={() => handleCheckboxChange(collection.id)}
                  />
                }
                label={collection.name}
              />
            ))}
        </Stack>
        <FormHelperText>
          Select which collections to plot, none = entire inventory
        </FormHelperText>
      </FormGroup>
    </>
  );
};

export const Collections = () => {
  const inventory = useStore(selectInventorySlice);
  const { supporter } = useStore(selectAccountSlice);
  const modal = useStore(selectModalSlice);
  const { triggerAlert } = useStore(selectAlertSlice);
  const api = useApi();
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

  const reorderInsideSameCollection = async (
    collectionId: string,
    sourceIndex: number,
    destinationIndex: number,
  ) => {
    if (sourceIndex === destinationIndex) return;

    const collection = inventory.findCollection(collectionId);
    if (!collection)
      throw new Error(
        "Collection the item was dropped into was not... found?!",
      );

    const groups = moveItem(collection.groups, sourceIndex, destinationIndex);
    try {
      await api.reorderGroups({
        groups: groups.map((groupId, index) => ({
          collectionId: collection.id,
          groupId,
          index,
        })),
      });
      logKeyEvent("adjust sorting", {
        type: "Group within collection",
      });
      inventory.updateCollection({
        ...collection,
        groups: groups,
      });
    } catch (e) {
      triggerAlert(Alerts.REORDER_ERROR);
      logApiFailure(e, "move group [within collection]");
    }
  };

  const moveGroupToOtherCollection = async (
    sourceCollectionId: string,
    sourceIndex: number,
    destinationCollectionId: string,
    destinationIndex: number,
  ) => {
    const sourceCollection = inventory.findCollection(sourceCollectionId);
    const destinationCollection = inventory.findCollection(
      destinationCollectionId,
    );

    if (!sourceCollection || !destinationCollection)
      return console.error(
        "Collection the item was picked from AND/OR dropped into was not... found?!",
      );

    const [updatedSourceGroups, updateDestinationGroups] = moveItemBetweenLists(
      sourceCollection.groups,
      sourceIndex,
      destinationCollection.groups,
      destinationIndex,
    );

    try {
      await api.reorderGroups({
        groups: [
          ...updatedSourceGroups.map((groupId, index) => ({
            collectionId: sourceCollection.id,
            groupId,
            index,
          })),
          ...updateDestinationGroups.map((groupId, index) => ({
            collectionId: destinationCollection.id,
            groupId,
            index,
          })),
        ],
      });
      logKeyEvent("adjust sorting", {
        type: "Group between collections",
      });
      inventory.updateCollection({
        ...sourceCollection,
        groups: updatedSourceGroups,
      });
      inventory.updateCollection({
        ...destinationCollection,
        groups: updateDestinationGroups,
      });
    } catch (e) {
      triggerAlert(Alerts.REORDER_ERROR);
      logApiFailure(e, "move group [between collections]");
    }
  };

  const updateGroups = ({ source, destination }: DropResult) => {
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      return reorderInsideSameCollection(
        source.droppableId,
        source.index,
        destination.index,
      );
    } else {
      return moveGroupToOtherCollection(
        source.droppableId,
        source.index,
        destination.droppableId,
        destination.index,
      );
    }
  };

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
