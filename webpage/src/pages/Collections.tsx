import { Helmet } from "react-helmet-async";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Crumbs } from "@components/cumbs/Crumbs.tsx";
import Stack from "@mui/material/Stack";
import SquareOutlinedIcon from "@mui/icons-material/SquareOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
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

const Summary = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const inventory = useStore(selectInventorySlice);
  const workflow = useStore(selectWorkflowSlice);
  const { generateGradientInSteps } = useWorkflowColors();
  const gradient = generateGradientInSteps(workflow.workflowStages.length);
  const collections = inventory.collections.length;
  const groups = inventory.groups.length;
  const models = inventory.models
    .flatMap((models) => models.collection.map((c) => c.amount as number))
    .reduce((a, b) => a + b, 0);

  return (
    <Stack
      direction={isMobile ? "column" : "row"}
      justifyContent="space-between"
      spacing={isMobile ? 1 : 2}
      sx={{
        p: isMobile ? 1.5 : 3,
        borderRadius: 2,
        background: gradient,
      }}
    >
      <SummaryItem
        icon={<CategoryOutlinedIcon sx={{ fontSize: isMobile ? 30 : 40 }} />}
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
  );
};

export const Collections = () => {
  const inventory = useStore(selectInventorySlice);
  const modal = useStore(selectModalSlice);

  const updateGroups = ({ source, destination }: DropResult) => {
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      if (source.index === destination.index) return;

      const collection = inventory.findCollection(source.droppableId);
      if (!collection)
        return console.error(
          "Collection the item was dropped into was not... found?!",
        );

      inventory.updateCollection({
        ...collection,
        groups: moveItem(collection.groups, source.index, destination.index),
      });
      return;
    }

    const sourceCollection = inventory.findCollection(source.droppableId);
    const destinationCollection = inventory.findCollection(
      destination.droppableId,
    );

    if (!sourceCollection || !destinationCollection)
      return console.error(
        "Collection the item was picked from AND/OR dropped into was not... found?!",
      );

    const [updatedSourceGroups, updateDestinationGroups] = moveItemBetweenLists(
      sourceCollection.groups,
      source.index,
      destinationCollection.groups,
      destination.index,
    );

    inventory.updateCollection({
      ...sourceCollection,
      groups: updatedSourceGroups,
    });
    inventory.updateCollection({
      ...destinationCollection,
      groups: updateDestinationGroups,
    });
  };

  return (
    <>
      <Helmet title="My collections" />
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Crumbs />
        <Typography variant={"h3"}>Collections</Typography>
        <Summary />

        {inventory.collections.length === 0 && (
          <Alert severity="info" variant={"filled"}>
            You currently have no collections. Let's start by creating your
            first collection using the button below.
          </Alert>
        )}

        <DragDropContext onDragEnd={updateGroups}>
          {inventory.collections.map((collection) => (
            <Fragment key={collection.id}>
              <CollectionAccordion collection={collection} />
            </Fragment>
          ))}
        </DragDropContext>

        <Button
          sx={{ my: 4 }}
          fullWidth
          onClick={() => modal.openModal(ModalTypes.CREATE_COLLECTION)}
        >
          Create a new Collection
        </Button>
      </Container>
    </>
  );
};
