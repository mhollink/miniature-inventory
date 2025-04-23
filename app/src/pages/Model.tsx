import { FunctionComponent, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Crumbs } from "@components/cumbs/Crumbs.tsx";
import { useLocation, useParams } from "react-router-dom";
import { useStore } from "@state/store.ts";
import { Helmet } from "react-helmet-async";
import Stack from "@mui/material/Stack";
import { analytics } from "../firebase/firebase.ts";
import { logEvent } from "firebase/analytics";
import { ModelNotFoundMessage } from "@components/models/ModelNotFoundMessage.tsx";
import { ModelActions } from "@components/models/ModelActions.tsx";
import { ModelStages } from "@components/models/ModelStages.tsx";

export const Model: FunctionComponent = () => {
  const { modelId } = useParams() as { modelId: string };
  const model = useStore((state) => state.findModel(modelId));

  const location = useLocation();

  useEffect(() => {
    // Send a page view event with a fixed page name
    if (!analytics) return;
    logEvent(analytics, "page_view", {
      page_title: "Model",
      page_location: window.location.href,
      page_path: location.pathname,
    });
  }, [location]);

  return (
    <>
      <Helmet title={model?.name || ""} />
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Crumbs />
        {!model ? (
          <ModelNotFoundMessage />
        ) : (
          <>
            <Stack direction="row" alignItems="center">
              <Typography variant={"h3"} flexGrow={1}>
                {model.name}
              </Typography>
              <ModelActions model={model} />
            </Stack>

            <ModelStages model={model} />
          </>
        )}
      </Container>
    </>
  );
};
