import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Stack from "@mui/material/Stack";
import { GroupLink } from "@components/collections/GroupLink.tsx";
import Alert from "@mui/material/Alert";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import { ModalTypes } from "@components/modal/modals.tsx";
import { Collection, selectModelsForCollection } from "@state/inventory";
import { useStore } from "@state/store.ts";
import Typography from "@mui/material/Typography";
import { selectModalSlice } from "@state/modal";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import { useRef, useState } from "react";

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

const CollectionActions = ({ collection }: { collection: Collection }) => {
  const modal = useStore(selectModalSlice);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const extraOptions = [
    {
      label: "Edit collection",
      onClick: () => {
        setOpen(false);
        console.log("edit clicked");
      },
      disabled: true,
    },
    {
      label: "Delete collection",
      onClick: () => {
        setOpen(false);
        modal.openModal(ModalTypes.DELETE_COLLECTION, {
          collectionId: collection.id,
        });
      },
    },
  ];

  const handleToggle = () => setOpen((prevOpen) => !prevOpen);

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup fullWidth>
        <Button
          aria-label={`Add a new group to ${collection.name}`}
          onClick={() =>
            modal.openModal(ModalTypes.CREATE_GROUP, {
              collectionId: collection.id,
            })
          }
          sx={{ flexGrow: 1 }}
        >
          Add a new group
        </Button>
        <Button
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          ref={anchorRef}
          onClick={handleToggle}
          sx={{
            width: "auto",
            p: 1,
          }}
        >
          <ArrowDropDown />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{ zIndex: 1 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {extraOptions.map((option) => (
                    <MenuItem
                      key={option.label}
                      onClick={option.onClick}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export const CollectionAccordion = ({
  collection,
}: {
  collection: Collection;
}) => {
  return (
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
          {collection.groups.map((collection) => (
            <GroupLink key={collection} groupId={collection} />
          ))}

          {collection.groups.length === 0 && (
            <Alert severity="info" variant={"filled"}>
              There are currently no groups inside this collection.
            </Alert>
          )}

          <CollectionActions collection={collection} />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
