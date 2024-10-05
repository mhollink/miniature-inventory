import { AlertColor } from "@mui/material";
import { ReactNode } from "react";
import { ErrorCreatingGroup } from "@components/alerts/alerts/ErrorCreatingGroup.tsx";

export enum Alerts {
  CREATE_GROUP_ERROR = "CREATE_GROUP_ERROR",
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
    Alerts.CREATE_GROUP_ERROR,
    {
      variant: "error",
      content: <ErrorCreatingGroup />,
    },
  ],
]);
