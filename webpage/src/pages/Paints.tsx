import { Helmet } from "react-helmet-async";
import { Crumbs } from "@components/cumbs/Crumbs.tsx";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import { PaintCollectionTable } from "@components/paints/PaintCollectionTable.tsx";

export const Paints = () => {
  return (
    <>
      <Helmet title="Roadmap" />
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          pb: 4,
        }}
      >
        <Crumbs />
        <Typography variant={"h3"}>Paint storage</Typography>
        <Typography>
          Whether you're a seasoned hobbyist or just getting started, this tool
          helps you keep track of your paint collection. Organize your paints,
          check what you have at a glance, and never buy duplicates again.
        </Typography>
        <PaintCollectionTable />
      </Container>
    </>
  );
};
