import { FunctionComponent } from "react";
import Typography from "@mui/material/Typography";
import { Helmet } from "react-helmet-async";
import Container from "@mui/material/Container";
import { ExternalLink } from "@components/link/ExternalLink.tsx";
import { Crumbs } from "@components/cumbs/Crumbs.tsx";

const featureList = {
  "Organizing your miniatures by army/faction":
    "First things first; Saving your miniatures to the app.",
  "Saving the current status of your miniatures":
    "Insight in how many of you miniatures are still on the pile-of-shame can be a great motivation to continue for " +
    "that last stretch of painting. Saving how far along you are can allows us to plot that data into some nice graphs.",
  "Creating your own work flow steps":
    "Each person paints in their own particular way. Do you base first then prime, or paint first and base you minis " +
    "as a last step... being able to customize your workflow allows for a better insight in your current pile-of-shame.",
  "Saving one (or multiple) paint scheme(s) per miniature":
    "Whenever you are doing little bit of painting at a time, or just wanna remember your paint scheme " +
    "in half a year when you buy some new minis. It would be great to be able to recall what paints you " +
    "used.",
  "Organizing your miniatures by game system":
    "Having a big list of miniature groups can become overwhelming when you have " +
    "multiple gaming systems. Allowing to further organize these groups into sets of IE. Middle-Earth, 40K, D&D, etc. " +
    "allows for a smoother user experience",
  "Personal accounts":
    "Allowing users to create accounts or log in with their social media accounts. This will allow us to save data " +
    "outside of the web application and eventually enable cross platform accounts.",
};

export const Roadmap: FunctionComponent = () => {
  return (
    <>
      <Helmet title="Roadmap" />
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
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
        <Typography variant="body1">
          Miniature Inventory is inspired by{" "}
          <ExternalLink href="https://warganizer.app/figure-case/">
            Figure Case
          </ExternalLink>
          . Sadly this app is only available on iOS. With a market share of
          roughly 28% (
          <ExternalLink href="https://gs.statcounter.com/os-market-share/mobile/worldwide">
            source
          </ExternalLink>
          ) this means 72% of users who do not own an iOS supported device are
          out of luck. The idea of Miniature Inventory is that it is a
          progressive webapp (PWA). This means any device that has an internet
          browser is able to access the application. The PWA is installable on
          devices that support this allowing you, the user, to access your data
          whenever you have an live internet connection.
        </Typography>
        <Typography>
          This application is developed in my free time and as such I am not
          able to spend 24/7 on development. With work, my wife and kids, and my
          own hobby also on the schedule I'd expect to spend a few hours a week
          on the continued development of this application. The application will
          soon become open source, allowing others to provide their own change
          requests though{" "}
          <ExternalLink href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests">
            a pull request
          </ExternalLink>
          .
        </Typography>
        <Typography variant="body1">
          As for now, there is a lot to come before we will release the first
          1.0 version. Currently I have following features in mind:
          <ul>
            {Object.entries(featureList).map(([feature, description]) => (
              <li key={feature}>
                <strong>{feature}</strong>: {description}
              </li>
            ))}
          </ul>
        </Typography>
      </Container>
    </>
  );
};
