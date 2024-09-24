import { ReactNode } from "react";

export enum ModalTypes {}

export type ModalProps = {
  children: ReactNode;
  icon: ReactNode;
  title: string;
  customModalHeader?: boolean;
};

export const modals = new Map<ModalTypes, ModalProps>([]);
