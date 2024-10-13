import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { ProgressSummary } from "@components/summary/ProgressSummary.tsx";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Paper } from "@mui/material";
import Stack from "@mui/material/Stack";
import { SummaryItem } from "@components/summary/SummaryItem.tsx";
import HexagonOutlinedIcon from "@mui/icons-material/HexagonOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { Group, selectModelsForGroup } from "@state/inventory";
import { useStore } from "@state/store.ts";

const Summary = ({
  miniatures,
  modelTypes,
}: {
  miniatures: number;
  modelTypes: number;
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Paper
      elevation={3}
      sx={{
        p: isMobile ? 1.5 : 3,
      }}
    >
      <Stack
        direction={isMobile ? "column" : "row"}
        justifyContent="space-between"
        spacing={isMobile ? 1 : 2}
      >
        <SummaryItem
          icon={<HexagonOutlinedIcon sx={{ fontSize: 40 }} />}
          label={"Models"}
          count={modelTypes}
          size={isMobile ? 100 : 50}
        />
        <SummaryItem
          icon={<CircleOutlinedIcon sx={{ fontSize: 40 }} />}
          label="Miniatures"
          count={miniatures}
          size={isMobile ? 100 : 50}
        />
      </Stack>
    </Paper>
  );
};

export const GroupSummary = ({ group }: { group: Group }) => {
  const models = useStore(selectModelsForGroup(group.id));
  const totalCollection = models.flatMap((models) => models.collection);
  const modelCount = totalCollection.reduce((a, b) => a + b.amount, 0);

  return (
    <>
      <Summary miniatures={modelCount} modelTypes={models.length} />
      <Typography variant={"h5"} flexGrow={1}>
        Progress in this group
      </Typography>
      {models.length === 0 ? (
        <>
          <Alert severity={"info"} variant={"filled"}>
            This group is currently empty. You can start adding models to this
            group using the FAB in the bottom right corner.
          </Alert>
        </>
      ) : (
        <ProgressSummary
          totalCollection={[{ label: "", values: totalCollection }]}
        />
      )}
    </>
  );
};
