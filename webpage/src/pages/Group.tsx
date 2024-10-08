import { FunctionComponent, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Crumbs } from "@components/cumbs/Crumbs.tsx";
import { useLocation, useParams } from "react-router-dom";
import { useStore } from "@state/store.ts";
import { selectGroup } from "@state/inventory";
import { Helmet } from "react-helmet-async";
import Stack from "@mui/material/Stack";
import { SportsBarOutlined } from "@mui/icons-material";
import { selectModalSlice } from "@state/modal";
import { ModalTypes } from "@components/modal/modals.tsx";
import Button from "@mui/material/Button";
import { selectAccountSlice } from "@state/account";
import { analytics } from "../firebase/firebase.ts";
import { logEvent } from "firebase/analytics";
import { GroupNotFoundMessage } from "@components/groups/GroupNotFoundMessage.tsx";
import { GroupSummary } from "@components/groups/GroupSummary.tsx";
import { GroupActions } from "@components/groups/GroupActions.tsx";
import { ModelList } from "@components/groups/ModelList.tsx";

export const Group: FunctionComponent = () => {
  const { id: groupId } = useParams() as { id: string };
  const modals = useStore(selectModalSlice);
  const group = useStore(selectGroup(groupId));
  const { supporter } = useStore(selectAccountSlice);

  const location = useLocation();

  useEffect(() => {
    // Send a page view event with a fixed page name
    if (!analytics) return;
    logEvent(analytics, "page_view", {
      page_title: "Group",
      page_location: window.location.href,
      page_path: location.pathname,
    });
  }, [location]);

  return (
    <>
      <Helmet title={group?.name || ""} />
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Crumbs />
        {!group ? (
          <GroupNotFoundMessage />
        ) : (
          <>
            <Stack direction="row" alignItems="center">
              <Typography variant={"h3"} flexGrow={1}>
                {group.name}
              </Typography>
              <GroupActions group={group} />
            </Stack>

            <GroupSummary group={group} />
            <ModelList group={group} />

            {!supporter && (
              <Button
                onClick={() =>
                  window.open("https://www.buymeacoffee.com/mhollink", "_blank")
                }
                sx={{
                  backgroundColor: "#F9C74F",
                  color: (theme) => theme.palette.common.black,
                  fontWeight: "bold",
                  padding: (theme) => theme.spacing(2),
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#F6B93A",
                  },
                }}
                startIcon={<SportsBarOutlined fontSize={"large"} />}
              >
                Support this page by buying me a beer!
              </Button>
            )}

            <Button
              sx={{ mb: 4 }}
              fullWidth
              variant={"outlined"}
              onClick={() =>
                modals.openModal(ModalTypes.ADD_MODEL, {
                  groupId: groupId,
                })
              }
            >
              Add a new Model
            </Button>
          </>
        )}
      </Container>
    </>
  );
};
