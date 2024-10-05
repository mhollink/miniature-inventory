import { FunctionComponent, useEffect } from "react";
import Typography from "@mui/material/Typography";
import { Helmet } from "react-helmet-async";
import Container from "@mui/material/Container";
import { ExternalLink } from "@components/link/ExternalLink.tsx";
import { Crumbs } from "@components/cumbs/Crumbs.tsx";
import { useLocation } from "react-router-dom";
import { analytics } from "../firebase/firebase.ts";
import { logEvent } from "firebase/analytics";

const features = [
  {
    done: true,
    feature: "Organizing your miniatures by army/faction",
    description:
      "First things first; Saving your miniatures to the app. Its what the app is supposed to do...",
  },
  {
    done: true,
    feature: "Saving the current status of your miniatures",
    description:
      "Insight in how many of you miniatures are still on the pile-of-shame can be a great motivation to continue for that last stretch of painting. Saving how far along you are can allows us to plot that data into some nice graphs.",
  },
  {
    done: true,
    feature: "Creating your own work flow steps",
    description:
      "Each person paints in their own particular way. Do you base first then prime, or paint first and base you minis as a last step... being able to customize your workflow allows for a better insight in your current pile-of-shame.",
  },
  {
    feature: "Saving one (or multiple) paint scheme(s) per miniature",
    description:
      "Whenever you are doing little bit of painting at a time, or just wanna remember your paint scheme in half a year when you buy some new minis. It would be great to be able to recall what paints you used.",
  },
  {
    done: true,
    feature: "Personal accounts",
    description:
      "Allowing users to create accounts or log in with their social media accounts. This will allow us to save data outside of the web application and eventually enable cross platform accounts.",
  },
  {
    feature: "Allow to keep track of your current paints",
    description:
      "Whenever you are doing little bit of painting at a time, or just wanna remember your paint scheme in half a year when you buy some new minis. It would be great to be able to recall what paints you used.",
  },
  {
    feature: "And more..",
    description: "depending on request or what I think would be useful.",
  },
];

export const Roadmap: FunctionComponent = () => {
  const location = useLocation();

  useEffect(() => {
    // Send a page view event with a fixed page name
    if (!analytics) return;
    logEvent(analytics, "page_view", {
      page_title: "Roadmap",
      page_location: window.location.href,
      page_path: location.pathname,
    });
  }, [location]);

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
        <Typography variant={"h3"}>Roadmap</Typography>
        <Typography variant="body1" component={"strong"} fontWeight={"bold"}>
          First of all welcome to the Miniature inventory application. This
          application is currently under heavy development and will evolve
          overtime. Any feedback on the current application is welcome, it will
          help everyone get the best experience in the long run.
        </Typography>

        <Typography>
          This application is developed in my free time and as such I am not
          able to spend 24/7 on development. With work, my wife and kids, and my
          own hobby also on the schedule I'd expect to spend at most a few hours
          a week on the continued development of this application. The
          application is open source which allows other developer with intrest
          to provide their own bits of functionality (if approved) via{" "}
          <ExternalLink href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests">
            a pull request
          </ExternalLink>
          .
        </Typography>
        <Typography variant="body1" component={"div"}>
          As for now, the following things are on my mind for the upcoming
          releases
          <ul>
            {features.map(({ feature, description, done }) => (
              <li key={feature} style={{ margin: "1rem 0 1rem" }}>
                {done ? (
                  <Typography variant={"body2"} color={"textSecondary"}>
                    <s>
                      <strong>{feature}</strong>: {description}
                    </s>
                  </Typography>
                ) : (
                  <Typography variant={"body2"}>
                    <strong>{feature}</strong>: {description}
                  </Typography>
                )}
              </li>
            ))}
          </ul>
        </Typography>
      </Container>
    </>
  );
};
