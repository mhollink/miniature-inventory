import { FunctionComponent, MouseEvent, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Crumbs } from "@components/cumbs/Crumbs.tsx";
import { useParams } from "react-router-dom";
import { useStore } from "@state/store.ts";
import {
  Group as GroupType,
  selectGroup,
  selectModelsForGroup,
} from "@state/inventory";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import { useWorkflowColors } from "@hooks/useWorkflowColors.ts";
import { selectWorkflowSlice } from "@state/workflow";
import { Helmet } from "react-helmet-async";
import Stack from "@mui/material/Stack";
import { SummaryItem } from "@components/collections/SummaryItem.tsx";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import HexagonOutlinedIcon from "@mui/icons-material/HexagonOutlined";
import { ModelSummary } from "@components/collections/ModelSummary.tsx";
import IconButton from "@mui/material/IconButton";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import { selectModalSlice } from "@state/modal";
import { ModalTypes } from "@components/modal/modals.tsx";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";
import { Menu, MenuItem, MenuList } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const Summary = ({
  miniatures,
  modelTypes,
  gradient,
}: {
  miniatures: number;
  modelTypes: number;
  gradient: string;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
        icon={<HexagonOutlinedIcon sx={{ fontSize: 40 }} />}
        label={"Models"}
        count={modelTypes}
        size={isMobile ? 100 : 50}
      />
      <SummaryItem
        icon={<CircleOutlinedIcon sx={{ fontSize: 40 }} />}
        label="Miniatures"
        count={miniatures}
        size={isMobile ? 100 : 50}
      />
    </Stack>
  );
};

const GroupActions = ({ group }: { group: GroupType }) => {
  const modals = useStore(selectModalSlice);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleUpdate = () => {
    modals.openModal(ModalTypes.UPDATE_GROUP, {
      groupId: group.id,
    });
    handleClose();
  };

  const handleDelete = () => {
    modals.openModal(ModalTypes.DELETE_GROUP, {
      groupId: group.id,
    });
    handleClose();
  };

  return (
    <>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreVert sx={{ fontSize: 30 }} />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuList>
          <MenuItem onClick={handleUpdate}>
            <ListItemIcon>
              <Edit />
            </ListItemIcon>
            <ListItemText>Update group</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <Delete />
            </ListItemIcon>
            <ListItemText>Delete group</ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  );
};

export const Group: FunctionComponent = () => {
  const { id: groupId } = useParams() as { id: string };
  const workflow = useStore(selectWorkflowSlice);
  const group = useStore(selectGroup(groupId));
  const models = useStore(selectModelsForGroup(groupId));
  const modals = useStore(selectModalSlice);
  const { convertCollectionToGradient } = useWorkflowColors();

  const totalCollection = models.flatMap((models) => models.collection);
  const modelCount = totalCollection.reduce((a, b) => a + b.amount, 0);

  const gradient = convertCollectionToGradient(
    totalCollection,
    workflow.workflowStages.length,
  );

  return (
    <>
      <Helmet title={group?.name || ""} />
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Crumbs />
        {!group ? (
          <>
            <Typography variant={"h3"}>Group not found...</Typography>
            <Alert severity="error" variant={"filled"}>
              <Typography>
                You are currently looking for a group that does not exist.
                Please head back to the{" "}
                <Link href={"/collections"}>Collections overview</Link> and
                select a group from there.
              </Typography>
            </Alert>
          </>
        ) : (
          <>
            <Stack direction="row" alignItems="center">
              <Typography variant={"h3"} flexGrow={1}>
                {group.name}
              </Typography>
              <GroupActions group={group} />
            </Stack>
            <Summary
              miniatures={modelCount}
              modelTypes={models.length}
              gradient={gradient}
            />
            <Typography variant={"h4"}>Models in this group</Typography>
            {models.length === 0 && (
              <>
                <Alert severity={"info"} variant={"filled"}>
                  This group is currently empty. You can start adding models to
                  this group using the FAB in the bottom right corner.
                </Alert>
              </>
            )}
            {models.map((model) => (
              <ModelSummary key={model.id} model={model} />
            ))}

            <Button
              sx={{ mb: 4 }}
              fullWidth
              variant={"outlined"}
              onClick={() =>
                modals.openModal(ModalTypes.ADD_MODEL, {
                  groupId: groupId,
                })
              }
            >
              Add a new Model
            </Button>
          </>
        )}
      </Container>
    </>
  );
};
