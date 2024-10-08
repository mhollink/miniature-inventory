import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useStore } from "@state/store.ts";
import { ModelStage, selectInventorySlice } from "@state/inventory";
import { useState } from "react";
import { calculateSumForEachStage } from "../../utils/collection.ts";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Paper,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { SummaryItem } from "@components/summary/SummaryItem.tsx";
import CategoryOutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import SquareOutlinedIcon from "@mui/icons-material/SquareOutlined";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import Typography from "@mui/material/Typography";
import { ProgressSummary } from "@components/summary/ProgressSummary.tsx";

export const Summary = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const inventory = useStore(selectInventorySlice);
  const collections = inventory.collections.length;
  const groups = inventory.groups.length;
  const models = inventory.models
    .flatMap((models) => models.collection.map((c) => c.amount as number))
    .reduce((a, b) => a + b, 0);

  const [visibleCollections, setVisibleCollections] = useState<string[]>([]);
  const handleCheckboxChange = (collectionId: string) => {
    setVisibleCollections((prev) =>
      prev.includes(collectionId)
        ? prev.filter((id) => id !== collectionId)
        : [...prev, collectionId]
            .map((c) => inventory.findCollection(c))
            .filter((c) => !!c)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((c) => c.id),
    );
  };

  const totalInventoryProgress = inventory.models.flatMap(
    (model) => model.collection,
  );
  const progressionPerCollection = inventory.collections
    .map((collection) => {
      const data = collection.groups.flatMap((group) => {
        const models = inventory.findGroup(group)?.models || [];
        return models
          .flatMap(inventory.findModel)
          .flatMap((model) => model?.collection || []);
      });
      return {
        [collection.id]: {
          label: collection.name,
          values: calculateSumForEachStage(data),
        },
      };
    })
    .reduce(
      (t, c) => ({ ...t, ...c }),
      {} as Record<string, { label: string; values: ModelStage[] }>,
    );
  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: isMobile ? 1.5 : 3,
          borderRadius: 0,
        }}
      >
        <Stack
          direction={isMobile ? "column" : "row"}
          justifyContent="space-between"
          spacing={isMobile ? 1 : 2}
        >
          <SummaryItem
            icon={
              <CategoryOutlinedIcon sx={{ fontSize: isMobile ? 30 : 40 }} />
            }
            label={collections === 1 ? "Collection" : "Collections"}
            count={collections}
            size={isMobile ? 100 : 33}
          />
          <SummaryItem
            icon={<SquareOutlinedIcon sx={{ fontSize: isMobile ? 30 : 40 }} />}
            label={groups === 1 ? "Group" : "Groups"}
            count={groups}
            size={isMobile ? 100 : 33}
          />
          <SummaryItem
            icon={<CircleOutlinedIcon sx={{ fontSize: isMobile ? 30 : 40 }} />}
            label={models === 1 ? "Miniature" : "Miniatures"}
            count={models}
            size={isMobile ? 100 : 33}
          />
        </Stack>
      </Paper>
      {totalInventoryProgress.length !== 0 && (
        <>
          <Typography variant={"h5"} flexGrow={1}>
            Total cumulative progress
          </Typography>
          <ProgressSummary
            totalCollection={
              visibleCollections.length === 0
                ? [{ label: "", values: totalInventoryProgress }]
                : visibleCollections.map((c) => ({
                    label: progressionPerCollection[c].label,
                    values: progressionPerCollection[c].values,
                  }))
            }
          />
          <FormGroup>
            <Stack direction={"row"} gap={2}>
              {inventory.collections
                .filter(
                  // removes any collection that have no models inside.
                  (collection) =>
                    progressionPerCollection[collection.id].values.length,
                )
                .sort((a, b) => a?.name.localeCompare(b.name))
                .map((collection) => (
                  <FormControlLabel
                    key={collection.id}
                    control={
                      <Checkbox
                        checked={visibleCollections.includes(collection.id)}
                        onChange={() => handleCheckboxChange(collection.id)}
                      />
                    }
                    label={collection.name}
                  />
                ))}
            </Stack>
            <FormHelperText>
              Select which collections to plot, none = entire inventory
            </FormHelperText>
          </FormGroup>
        </>
      )}
    </>
  );
};
