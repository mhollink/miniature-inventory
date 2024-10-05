import Container from "@mui/material/Container";
import {
  FunctionComponent,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import Typography from "@mui/material/Typography";
import { Paper, Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { LoginForm } from "@components/sign-in/LoginForm.tsx";
import { useAuth } from "../firebase/FirebaseAuthContext.tsx";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useApi } from "../api/useApi.ts";
import { useLocation } from "react-router-dom";
import { analytics } from "../firebase/firebase.ts";
import { logEvent } from "firebase/analytics";

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Paper sx={{ mt: 1, p: 1 }} elevation={4}>
          {children}
        </Paper>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

const ScreenshotTabs = () => {
  const theme = useTheme();
  const mode = theme.palette.mode;
  const [value, setValue] = useState(0);

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="screenshot-tab"
        variant={"fullWidth"}
      >
        <Tab label="Decide your workflow" {...a11yProps(0)} />
        <Tab label="Create collections and groups" {...a11yProps(1)} />
        <Tab label="Organize Models in groups" {...a11yProps(2)} />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        <img
          src={`/assets/images/screenshots/${mode}/workflow.png`}
          alt={"Screenshot of workflow settings"}
          style={{ width: "100%" }}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <img
          src={`/assets/images/screenshots/${mode}/collections.png`}
          alt={"Screenshot of a collection with groups"}
          style={{ width: "100%" }}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <img
          src={`/assets/images/screenshots/${mode}/group.png`}
          alt={"Screenshot of models in a group"}
          style={{ width: "100%" }}
        />
      </CustomTabPanel>
    </Box>
  );
};

export const Home: FunctionComponent = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [statistics, setStatistics] = useState<Record<string, number>>();
  const api = useApi();
  const location = useLocation();

  useEffect(() => {
    // Send a page view event with a fixed page name
    if (!analytics) return;
    logEvent(analytics, "page_view", {
      page_title: "Home",
      page_location: window.location.href,
      page_path: location.pathname,
    });
  }, [location]);

  useEffect(() => {
    api.getStatistics().then(setStatistics);
  }, []);

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography variant={"h4"}>Welcome to</Typography>
        <Typography variant={"h2"}>Miniature Inventory</Typography>
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={4}
          sx={{ mt: 4 }}
          justifyContent={"space-between"}
        >
          <Box sx={{ maxWidth: "72ch" }}>
            <Typography fontSize={"1.2rem"}>
              <strong>
                Miniature inventory is a tool that helps you organize your
                collection of miniatures and gives insight in how bad your pile
                of shame is.
              </strong>
            </Typography>
            <Typography sx={{ mt: 2, mb: 2 }} fontSize={"1.2rem"}>
              This tool allows you to categorize your miniatures in collections
              which consists of groups of models. Each group can consists of
              multiple types of models and their amount (broken up in stages).
              You decide your own workflow (within the settings of the tool) and
              classify where your models are in that workflow.
            </Typography>
            {statistics && (
              <Typography variant={"body2"} sx={{ mb: 4 }}>
                There are currently a total of {statistics.total_users} users
                who have created a combined total of{" "}
                {statistics.total_collections} collections,{" "}
                {statistics.total_groups} groups with a total of{" "}
                {statistics.total_models} models creating a total of{" "}
                {statistics.total_miniatures} miniatures.
              </Typography>
            )}
          </Box>
          {!user && <LoginForm />}
        </Stack>
        <ScreenshotTabs />
      </Container>
    </>
  );
};
