import { Helmet } from "react-helmet-async";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Crumbs } from "@components/cumbs/Crumbs.tsx";
import Stack from "@mui/material/Stack";
import SquareOutlinedIcon from "@mui/icons-material/SquareOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { useStore } from "@state/store.ts";
import { selectInventorySlice } from "@state/inventory";
import { selectWorkflowSlice } from "@state/workflow";
import { useWorkflowColors } from "@hooks/useWorkflowColors.ts";
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
import { Fragment } from "react";
import { useApi } from "../api/useApi.ts";
import { SportsBarOutlined } from "@mui/icons-material";
import { selectAccountSlice } from "@state/account";
import { MAX_COLLECTIONS } from "../constants.ts";
import { Paper } from "@mui/material";
import { GroupProgress } from "@components/groups/GroupProgress.tsx";

const Summary = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const inventory = useStore(selectInventorySlice);
  const collections = inventory.collections.length;
  const groups = inventory.groups.length;
  const models = inventory.models
    .flatMap((models) => models.collection.map((c) => c.amount as number))
    .reduce((a, b) => a + b, 0);

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
        totalCollection={inventory.models.flatMap((model) => model.collection)}
      />
    </>
  );
};

export const Collections = () => {
  const inventory = useStore(selectInventorySlice);
  const { supporter } = useStore(selectAccountSlice);
  const modal = useStore(selectModalSlice);
  const api = useApi();

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
    await api.reorderGroups({
      groups: groups.map((groupId, index) => ({
        collectionId: collection.id,
        groupId,
        index,
      })),
    });
    inventory.updateCollection({
      ...collection,
      groups: groups,
    });
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

    inventory.updateCollection({
      ...sourceCollection,
      groups: updatedSourceGroups,
    });
    inventory.updateCollection({
      ...destinationCollection,
      groups: updateDestinationGroups,
    });
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
          {inventory.collections.map((collection, index) => (
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
