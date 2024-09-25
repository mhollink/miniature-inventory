import Container from "@mui/material/Container";
import { FunctionComponent } from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export const Home: FunctionComponent = () => {
  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant={"h3"}>Dashboard</Typography>
        <Link href={"/collections"}>Collections </Link>
      </Container>
    </>
  );
};
