import { ReactNode } from "react";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import SquareOutlinedIcon from "@mui/icons-material/SquareOutlined";
import { CreateGroupModal } from "@components/modal/modals/CreateGroup.tsx";
import { CreateNewCollectionModal } from "@components/modal/modals/CreateCollection.tsx";
import { DeleteCollectionModal } from "@components/modal/modals/DeleteCollection.tsx";
import { DeleteGroupModal } from "@components/modal/modals/DeleteGroup.tsx";
import HexagonOutlinedIcon from "@mui/icons-material/HexagonOutlined";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import { AddModelModal } from "@components/modal/modals/CreateModel.tsx";
import { EditModelModal } from "@components/modal/modals/UpdateModel.tsx";
import { DeleteModelModal } from "@components/modal/modals/DeleteModel.tsx";
import { UpdateCollectionModal } from "@components/modal/modals/UpdateCollection.tsx";
import { UpdateGroupModal } from "@components/modal/modals/UpdateGroup.tsx";
import { OldVersionStorageModal } from "@components/modal/modals/OldVersionStorageModal.tsx";

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
      icon: <CategoryOutlinedIcon />,
      title: "Add a new collection",
      children: <CreateNewCollectionModal />,
    },
  ],
  [
    ModalTypes.UPDATE_COLLECTION,
    {
      icon: <CategoryOutlinedIcon />,
      title: "Update collection",
      children: <UpdateCollectionModal />,
    },
  ],
  [
    ModalTypes.DELETE_COLLECTION,
    {
      icon: <CategoryOutlinedIcon />,
      title: "Delete collection",
      children: <DeleteCollectionModal />,
    },
  ],
  [
    ModalTypes.CREATE_GROUP,
    {
      icon: <SquareOutlinedIcon />,
      title: "Add a new group",
      children: <CreateGroupModal />,
    },
  ],
  [
    ModalTypes.UPDATE_GROUP,
    {
      icon: <SquareOutlinedIcon />,
      title: "Update group",
      children: <UpdateGroupModal />,
    },
  ],
  [
    ModalTypes.DELETE_GROUP,
    {
      icon: <SquareOutlinedIcon />,
      title: "Delete group",
      children: <DeleteGroupModal />,
    },
  ],
  [
    ModalTypes.ADD_MODEL,
    {
      icon: <HexagonOutlinedIcon />,
      title: "Add new model type & miniatures",
      children: <AddModelModal />,
    },
  ],
  [
    ModalTypes.EDIT_MODEL,
    {
      icon: <HexagonOutlinedIcon />,
      title: "Update model & miniatures",
      children: <EditModelModal />,
    },
  ],
  [
    ModalTypes.DELETE_MODEL,
    {
      icon: <HexagonOutlinedIcon />,
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
