import { Group as GroupType } from "@state/inventory";
import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { MouseEvent, useState } from "react";
import { ModalTypes } from "@components/modal/modals.tsx";
import IconButton from "@mui/material/IconButton";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import { Menu, MenuItem, MenuList } from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

export const GroupActions = ({ group }: { group: GroupType }) => {
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
