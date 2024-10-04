import { ReactNode } from "react";
import { CreateGroupModal } from "@components/modal/modals/CreateGroup.tsx";
import { CreateNewCollectionModal } from "@components/modal/modals/CreateCollection.tsx";
import { DeleteCollectionModal } from "@components/modal/modals/DeleteCollection.tsx";
import { DeleteGroupModal } from "@components/modal/modals/DeleteGroup.tsx";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import { AddModelModal } from "@components/modal/modals/CreateModel.tsx";
import { EditModelModal } from "@components/modal/modals/UpdateModel.tsx";
import { DeleteModelModal } from "@components/modal/modals/DeleteModel.tsx";
import { UpdateCollectionModal } from "@components/modal/modals/UpdateCollection.tsx";
import { UpdateGroupModal } from "@components/modal/modals/UpdateGroup.tsx";
import { OldVersionStorageModal } from "@components/modal/modals/OldVersionStorageModal.tsx";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import ViewListIcon from "@mui/icons-material/ViewList";
import ExtensionIcon from "@mui/icons-material/Extension";

export enum ModalTypes {
  CREATE_COLLECTION = "CREATE_COLLECTION",
  UPDATE_COLLECTION = "UPDATE_COLLECTION",
  DELETE_COLLECTION = "DELETE_COLLECTION",

  CREATE_GROUP = "CREATE_GROUP",
  UPDATE_GROUP = "UPDATE_GROUP",
  DELETE_GROUP = "DELETE_GROUP",

  ADD_MODEL = "ADD_MODEL",
  EDIT_MODEL = "EDIT_MODEL",
  DELETE_MODEL = "DELETE_MODEL",

  OLD_VERSION_DATA = "OLD_VERSION_DATA",
}

export type ModalProps = {
  children: ReactNode;
  icon: ReactNode;
  title: string;
};

export const modals = new Map<ModalTypes, ModalProps>([
  [
    ModalTypes.CREATE_COLLECTION,
    {
      icon: <InventoryOutlinedIcon />,
      title: "Add a new collection",
      children: <CreateNewCollectionModal />,
    },
  ],
  [
    ModalTypes.UPDATE_COLLECTION,
    {
      icon: <InventoryOutlinedIcon />,
      title: "Update collection",
      children: <UpdateCollectionModal />,
    },
  ],
  [
    ModalTypes.DELETE_COLLECTION,
    {
      icon: <InventoryOutlinedIcon />,
      title: "Delete collection",
      children: <DeleteCollectionModal />,
    },
  ],
  [
    ModalTypes.CREATE_GROUP,
    {
      icon: <ViewListIcon />,
      title: "Add a new group",
      children: <CreateGroupModal />,
    },
  ],
  [
    ModalTypes.UPDATE_GROUP,
    {
      icon: <ViewListIcon />,
      title: "Update group",
      children: <UpdateGroupModal />,
    },
  ],
  [
    ModalTypes.DELETE_GROUP,
    {
      icon: <ViewListIcon />,
      title: "Delete group",
      children: <DeleteGroupModal />,
    },
  ],
  [
    ModalTypes.ADD_MODEL,
    {
      icon: <ExtensionIcon />,
      title: "Add new model type & miniatures",
      children: <AddModelModal />,
    },
  ],
  [
    ModalTypes.EDIT_MODEL,
    {
      icon: <ExtensionIcon />,
      title: "Update model & miniatures",
      children: <EditModelModal />,
    },
  ],
  [
    ModalTypes.DELETE_MODEL,
    {
      icon: <ExtensionIcon />,
      title: "Delete model",
      children: <DeleteModelModal />,
    },
  ],
  [
    ModalTypes.OLD_VERSION_DATA,
    {
      icon: <CloudSyncIcon />,
      title: "Sync old data with cloud",
      children: <OldVersionStorageModal />,
    },
  ],
]);
