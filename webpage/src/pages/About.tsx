import { FunctionComponent, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Helmet } from "react-helmet-async";
import Container from "@mui/material/Container";
import { Crumbs } from "@components/cumbs/Crumbs.tsx";
import { useLocation } from "react-router-dom";
import { analytics } from "../firebase/firebase.ts";
import { logEvent } from "firebase/analytics";
import { ExternalLink } from "@components/link/ExternalLink.tsx";

export const About: FunctionComponent = () => {
  const location = useLocation();

  useEffect(() => {
    // Send a page view event with a fixed page name
    if (!analytics) return;
    logEvent(analytics, "page_view", {
      page_title: "About",
      page_location: window.location.href,
      page_path: location.pathname,
    });
  }, [location]);

  return (
    <>
      <Helmet title="About" />
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
        <Typography variant={"h3"}>About</Typography>
        <Typography variant={"body1"}>
          Miniature Inventory is developed and hosted by Marcel Hollink, a
          collector of Middle Earth SBG miniatures. After acquiring many
          miniatures over the past 20 years I felt the need to write down what I
          have, and most importantly, how big my pile of shame has become.
          Finding an amazing app called{" "}
          <ExternalLink href={"https://warganizer.app/figure-case/"}>
            Figure Case
          </ExternalLink>{" "}
          only to find out I would be unable to use it.
        </Typography>
        <Typography>
          I started development of Miniature Inventory which is heavily inspired
          by the former mentioned Figure Case app with the intention of creating
          an device agnostic alternative. After Releasing version 1.0 I had to
          change up some things to make it not an exact copy and give it its own
          twist.
        </Typography>
        <Typography>
          This application is fully open source, available for input of anyone.
          You can find the project on{" "}
          <ExternalLink
            href={"https://github.com/mhollink/miniature-inventory"}
          >
            https://github.com/mhollink/miniature-inventory
          </ExternalLink>
          . Any ideas for improvement or new features, or any bugs you encounter
          can be mentioned on the issues page{" "}
          <ExternalLink
            href={"https://github.com/mhollink/miniature-inventory/issues"}
          >
            https://github.com/mhollink/miniature-inventory/issues{" "}
          </ExternalLink>
          .
        </Typography>
      </Container>
    </>
  );
};
