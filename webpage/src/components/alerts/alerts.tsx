import { AlertColor } from "@mui/material";
import { ReactNode } from "react";

export enum Alerts {}

type AlertOptions = {
  autoHideAfter?: number;
};

export type AlertProps = {
  variant: AlertColor;
  content: ReactNode;
  options?: AlertOptions;
};

export const alertMap = new Map<Alerts, AlertProps>([]);
