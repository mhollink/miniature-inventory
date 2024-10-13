import { Outlet, ScrollRestoration } from "react-router-dom";
import { ModalContainer } from "@components/modal/ModalContainer.tsx";
import { DrawerContainer } from "@components/drawer/DrawerContainer.tsx";
import { AlertContainer } from "@components/alerts/AlertContainer.tsx";
import { Container } from "@mui/material";

export const AppContent = () => {
  return (
    <>
      <ScrollRestoration />
      <AlertContainer />
      <ModalContainer />
      <DrawerContainer />
      <Container
        maxWidth="xl"
        sx={{
          p: 2,
        }}
      >
        <Outlet />
      </Container>
    </>
  );
};
