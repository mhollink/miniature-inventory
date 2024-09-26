import { Helmet } from "react-helmet-async";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Crumbs } from "@components/cumbs/Crumbs.tsx";
import Stack from "@mui/material/Stack";
import SquareOutlinedIcon from "@mui/icons-material/SquareOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import HexagonOutlinedIcon from "@mui/icons-material/HexagonOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { GroupLink } from "@components/collections/GroupLink.tsx";
import { useStore } from "@state/store.ts";
import {
  Collection,
  selectInventorySlice,
  selectModelsForCollection,
} from "@state/inventory";
import { Fab } from "@components/fab/Fab.tsx";
import { selectWorkflowSlice } from "@state/workflow";
import { useWorkflowColors } from "@hooks/useWorkflowColors.ts";
import { SummaryItem } from "@components/collections/SummaryItem";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { selectModalSlice } from "@state/modal";
import { ModalTypes } from "@components/modal/modals.tsx";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";

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
        icon={<HexagonOutlinedIcon sx={{ fontSize: isMobile ? 30 : 40 }} />}
        label={models === 1 ? "Miniature" : "Miniatures"}
        count={models}
        size={isMobile ? 100 : 33}
      />
    </Stack>
  );
};

const CollectionInfo = ({ collection }: { collection: Collection }) => {
  const models = useStore(selectModelsForCollection(collection.id));
  const modelCount = models
    .flatMap((models) => models.collection.map((c) => c.amount as number))
    .reduce((a, b) => a + b, 0);
  return (
    <Stack direction="row" sx={{ width: "100%", pr: 4 }}>
      <Typography variant={"h5"} flexGrow={1}>
        {collection.name}
      </Typography>
      <Typography variant={"h5"}>{modelCount}</Typography>
    </Stack>
  );
};

export const Collections = () => {
  const inventory = useStore(selectInventorySlice);
  const modal = useStore(selectModalSlice);
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
            You currently have no collections. Start your first collection by
            creating one using the FAB in the bottom right corner.
          </Alert>
        )}

        {inventory.collections.map((collection) => (
          <Accordion defaultExpanded key={collection.id} elevation={3}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <CollectionInfo collection={collection} />
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {collection.groups.length === 0 && (
                  <>
                    <Alert severity="info" variant={"filled"}>
                      There are currently no groups inside this collection, if
                      you wish to delete the collection, click on the delete
                      button below this message.
                    </Alert>
                    <Button
                      color={"error"}
                      startIcon={<DeleteIcon />}
                      onClick={() =>
                        modal.openModal(ModalTypes.DELETE_COLLECTION, {
                          collectionId: collection.id,
                        })
                      }
                    >
                      Delete collection
                    </Button>
                  </>
                )}

                {collection.groups.map((collection) => (
                  <GroupLink key={collection} groupId={collection} />
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
      <Fab
        ariaLabel={"collection-actions"}
        actions={[
          {
            name: "create collection",
            icon: <CategoryOutlinedIcon />,
            callback: () => modal.openModal(ModalTypes.CREATE_COLLECTION),
          },
          {
            name: "create group",
            icon: <SquareOutlinedIcon />,
            callback: () => modal.openModal(ModalTypes.CREATE_GROUP),
            disabled: inventory.collections.length === 0,
          },
        ]}
      />
    </>
  );
};
