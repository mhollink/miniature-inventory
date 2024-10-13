import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { ExternalLink } from "@components/link/ExternalLink.tsx";

export const AppFallback = () => {
  const error = useRouteError();
  let errorMessage: string;
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.stack || error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  } else {
    console.error(error);
    errorMessage = "Unknown error";
  }

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
        <Typography variant={"h3"}>Oh no!</Typography>
        <Typography variant={"subtitle1"}>
          Something went completely wrong! An error occurred on the page you
          were visiting. If the error keeps returning, dont hesitate to{" "}
          <ExternalLink
            href={"https://github.com/mhollink/Miniature-Inventory/issues/new"}
          >
            create an issue on github
          </ExternalLink>{" "}
          and let us know what happend.
        </Typography>
        <Typography variant="subtitle2">
          You can also copy & paste the error below into the created issue to
          help us help you.
        </Typography>
        <Typography
          variant={"caption"}
          component={"pre"}
          sx={{
            px: 5,
            borderLeft: 1,
          }}
        >
          {errorMessage}
        </Typography>
      </Container>
    </>
  );
};
