import Container from "@mui/material/Container";
import { FunctionComponent } from "react";
import Typography from "@mui/material/Typography";

export const Home: FunctionComponent = () => {
  return (
    <>
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant={"h3"}>Home...</Typography>
      </Container>
    </>
  );
};
