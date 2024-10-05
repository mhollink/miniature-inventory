import { AlertColor } from "@mui/material";
import { ReactNode } from "react";
import Typography from "@mui/material/Typography";
import { GenericErrorMessage } from "@components/alerts/GenericErrorAlert.tsx";
import Link from "@mui/material/Link";

export enum Alerts {
  CREATE_COLLECTION_SUCCESS = "CREATE_COLLECTION_SUCCESS",
  CREATE_COLLECTION_ERROR = "CREATE_COLLECTION_ERROR",
  CREATE_GROUP_SUCCESS = "CREATE_GROUP_SUCCESS",
  CREATE_GROUP_ERROR = "CREATE_GROUP_ERROR",
  CREATE_MODEL_SUCCESS = "CREATE_MODEL_SUCCESS",
  CREATE_MODEL_ERROR = "CREATE_MODEL_ERROR",
  UPDATE_COLLECTION_SUCCESS = "UPDATE_COLLECTION_SUCCESS",
  UPDATE_COLLECTION_ERROR = "UPDATE_COLLECTION_ERROR",
  UPDATE_GROUP_SUCCESS = "UPDATE_GROUP_SUCCESS",
  UPDATE_GROUP_ERROR = "UPDATE_GROUP_ERROR",
  UPDATE_MODEL_SUCCESS = "UPDATE_MODEL_SUCCESS",
  UPDATE_MODEL_ERROR = "UPDATE_MODEL_ERROR",
  DELETE_COLLECTION_SUCCESS = "DELETE_COLLECTION_SUCCESS",
  DELETE_COLLECTION_ERROR = "DELETE_COLLECTION_ERROR",
  DELETE_GROUP_SUCCESS = "DELETE_GROUP_SUCCESS",
  DELETE_GROUP_ERROR = "DELETE_GROUP_ERROR",
  DELETE_MODEL_SUCCESS = "DELETE_MODEL_SUCCESS",
  DELETE_MODEL_ERROR = "DELETE_MODEL_ERROR",
  REORDER_ERROR = "REORDER_ERROR",
}

type AlertOptions = {
  autoHideAfter?: number;
};

export type AlertProps = {
  variant: AlertColor;
  content: ReactNode;
  options?: AlertOptions;
};

export const alertMap = new Map<Alerts, AlertProps>([
  [
    Alerts.CREATE_COLLECTION_SUCCESS,
    {
      variant: "success",
      content: <Typography>Your new collection was created!</Typography>,
      options: {
        autoHideAfter: 5000,
      },
    },
  ],
  [
    Alerts.CREATE_GROUP_SUCCESS,
    {
      variant: "success",
      content: <Typography>Your new group was added!</Typography>,
      options: {
        autoHideAfter: 5000,
      },
    },
  ],
  [
    Alerts.CREATE_MODEL_SUCCESS,
    {
      variant: "success",
      content: <Typography>The model was added to the group!</Typography>,
      options: {
        autoHideAfter: 5000,
      },
    },
  ],
  [
    Alerts.CREATE_COLLECTION_SUCCESS,
    {
      variant: "success",
      content: <Typography>Your new collection was created!</Typography>,
      options: {
        autoHideAfter: 5000,
      },
    },
  ],
  [
    Alerts.CREATE_COLLECTION_ERROR,
    {
      variant: "error",
      content: <GenericErrorMessage action={"creating"} type={"collection"} />,
    },
  ],
  [
    Alerts.CREATE_GROUP_ERROR,
    {
      variant: "error",
      content: <GenericErrorMessage action={"creating"} type={"group"} />,
    },
  ],
  [
    Alerts.CREATE_MODEL_ERROR,
    {
      variant: "error",
      content: <GenericErrorMessage action={"adding"} type={"model"} />,
    },
  ],
  [
    Alerts.UPDATE_COLLECTION_ERROR,
    {
      variant: "error",
      content: <GenericErrorMessage action={"updating"} type={"collection"} />,
    },
  ],
  [
    Alerts.UPDATE_GROUP_ERROR,
    {
      variant: "error",
      content: <GenericErrorMessage action={"updating"} type={"group"} />,
    },
  ],
  [
    Alerts.UPDATE_MODEL_ERROR,
    {
      variant: "error",
      content: <GenericErrorMessage action={"updating"} type={"model"} />,
    },
  ],
  [
    Alerts.DELETE_COLLECTION_ERROR,
    {
      variant: "error",
      content: <GenericErrorMessage action={"deleting"} type={"collection"} />,
    },
  ],
  [
    Alerts.DELETE_GROUP_ERROR,
    {
      variant: "error",
      content: <GenericErrorMessage action={"deleting"} type={"group"} />,
    },
  ],
  [
    Alerts.DELETE_MODEL_ERROR,
    {
      variant: "error",
      content: <GenericErrorMessage action={"removing"} type={"model"} />,
    },
  ],

  [
    Alerts.UPDATE_COLLECTION_SUCCESS,
    {
      variant: "success",
      content: <Typography>Your collection was updated!</Typography>,
      options: {
        autoHideAfter: 5000,
      },
    },
  ],
  [
    Alerts.UPDATE_GROUP_SUCCESS,
    {
      variant: "success",
      content: <Typography>Your group was updated!</Typography>,
      options: {
        autoHideAfter: 5000,
      },
    },
  ],
  [
    Alerts.UPDATE_MODEL_SUCCESS,
    {
      variant: "success",
      content: <Typography>The model was updated!</Typography>,
      options: {
        autoHideAfter: 5000,
      },
    },
  ],

  [
    Alerts.DELETE_COLLECTION_SUCCESS,
    {
      variant: "success",
      content: <Typography>Your collection was deleted!</Typography>,
      options: {
        autoHideAfter: 5000,
      },
    },
  ],
  [
    Alerts.DELETE_GROUP_SUCCESS,
    {
      variant: "success",
      content: <Typography>Your group was deleted!</Typography>,
      options: {
        autoHideAfter: 5000,
      },
    },
  ],
  [
    Alerts.DELETE_MODEL_SUCCESS,
    {
      variant: "success",
      content: <Typography>The model was removed!</Typography>,
      options: {
        autoHideAfter: 5000,
      },
    },
  ],
  [
    Alerts.REORDER_ERROR,
    {
      variant: "error",
      content: (
        <Typography>
          Something went wrong updating the sorting. Please try again, and if
          the problem persists contact me at{" "}
          <Link href="mailto:support@miniature-inventory.nl">
            support@miniature-inventory.nl
          </Link>
        </Typography>
      ),
    },
  ],
]);
