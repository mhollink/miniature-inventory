import Container from "@mui/material/Container";
import { FunctionComponent, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Typography from "@mui/material/Typography";
import { Crumbs } from "@components/cumbs/Crumbs.tsx";
import Divider from "@mui/material/Divider";
import { WorkflowEditForm } from "@components/workflow/SettingsInput.tsx";
import { useStore } from "@state/store.ts";
import { selectAccountSlice } from "@state/account";
import Button from "@mui/material/Button";
import { capitalizeFirstLetter } from "../utils/string.ts";
import { analytics } from "../firebase/firebase.ts";
import { logEvent } from "firebase/analytics";
import { useLocation } from "react-router-dom";
import { FaPatreon } from "react-icons/fa";

export const Settings: FunctionComponent = () => {
  const { supportTier, supporter } = useStore(selectAccountSlice);
  const location = useLocation();

  useEffect(() => {
    // Send a page view event with a fixed page name
    if (!analytics) return;
    logEvent(analytics, "page_view", {
      page_title: "Settings",
      page_location: window.location.href,
      page_path: location.pathname,
    });
  }, [location]);

  return (
    <>
      <Helmet title="Settings" />
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Crumbs />
        <Typography variant={"h3"}>Settings</Typography>
        <Divider textAlign={"left"}>
          <Typography variant={"h5"}>Account</Typography>
        </Divider>
        <Typography>
          <strong>Current support status:</strong>
          <Typography
            color={supporter ? "secondary" : "textSecondary"}
            component={"span"}
            sx={{
              mx: 1,
            }}
          >
            {capitalizeFirstLetter(supportTier)}
          </Typography>
        </Typography>
        {!supporter && (
          <Button
            onClick={() =>
              window.open("https://www.patreon.com/c/mininventory", "_blank")
            }
            sx={{
              backgroundColor: "rgb(249, 104, 84)",
              color: (theme) => theme.palette.common.black,
              fontWeight: "bold",
              padding: (theme) => theme.spacing(2),
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "rgb(249, 104, 84)",
              },
            }}
            startIcon={<FaPatreon fontSize={"large"} />}
          >
            Become a Patreon
          </Button>
        )}
        <Divider textAlign={"left"}>
          <Typography variant={"h5"}>Workflow</Typography>
        </Divider>
        <WorkflowEditForm />
      </Container>
    </>
  );
};
