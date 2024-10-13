import { Collection, selectModelsForCollection } from "@state/inventory";
import { useStore } from "@state/store.ts";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const CollectionInfo = ({ collection }: { collection: Collection }) => {
  const models = useStore(selectModelsForCollection(collection.id));
  const modelCount = models
    .flatMap((models) => models.collection.map((c) => c.amount as number))
    .reduce((a, b) => a + b, 0);
  return (
    <Stack direction="row" sx={{ width: "100%", pr: 4 }}>
      <Typography variant={"h5"} flexGrow={1}>
        {collection.name}
      </Typography>
      <Typography variant={"h5"}>{modelCount}</Typography>
    </Stack>
  );
};
