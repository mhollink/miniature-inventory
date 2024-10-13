import { Collection, selectInventorySlice } from "@state/inventory";
import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { selectAccountSlice } from "@state/account";
import { useRef, useState } from "react";
import { Delete, Edit } from "@mui/icons-material";
import { ModalTypes } from "@components/modal/modals.tsx";
import {
  ClickAwayListener,
  Collapse,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import { MAX_GROUPS } from "../../constants.ts";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import ButtonGroup from "@mui/material/ButtonGroup";
import Button from "@mui/material/Button";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

export const CollectionActions = ({
  collection,
}: {
  collection: Collection;
}) => {
  const modal = useStore(selectModalSlice);
  const { groups } = useStore(selectInventorySlice);
  const { supporter } = useStore(selectAccountSlice);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const extraOptions = [
    {
      label: "Edit collection",
      icon: <Edit />,
      onClick: () => {
        setOpen(false);
        modal.openModal(ModalTypes.UPDATE_COLLECTION, {
          collectionId: collection.id,
        });
      },
    },
    {
      label: "Delete collection",
      icon: <Delete />,
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
      <Collapse in={!supporter && groups.length >= MAX_GROUPS}>
        <Alert severity={"info"} variant={"filled"}>
          <Typography>
            Adding more than {MAX_GROUPS} groups is currently limited to
            supporters only.
          </Typography>
        </Alert>
      </Collapse>
      <ButtonGroup fullWidth>
        <Button
          aria-label={`Add a new group to ${collection.name}`}
          disabled={!supporter && groups.length >= MAX_GROUPS}
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
                    <MenuItem key={option.label} onClick={option.onClick}>
                      <ListItemIcon>{option.icon}</ListItemIcon>
                      <ListItemText> {option.label}</ListItemText>
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
