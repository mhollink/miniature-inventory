import { ReactNode } from "react";
import { Changelog } from "./drawers/Changelog.tsx";

export enum DrawerTypes {
  CHANGELOG = "CHANGELOG",
}

export type DrawerProps = {
  children: ReactNode;
  title: string;
};

export const drawers = new Map<DrawerTypes, DrawerProps>([
  [
    DrawerTypes.CHANGELOG,
    {
      title: "Changelog",
      children: <Changelog />,
    },
  ],
]);
