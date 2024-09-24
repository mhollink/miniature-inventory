import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

export const RootFallback = () => {
  return (
    <>
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          p: 2,
        }}
      >
        <Typography variant={"h3"}>Oh crap, not good!</Typography>
        <Typography variant={"subtitle1"}>
          I have no clue how you ended up here... please return to the{" "}
          <Link href={"/"}>homepage</Link>.
          <br />
          Hopefully this is a one time only thing.
        </Typography>
      </Container>
    </>
  );
};
