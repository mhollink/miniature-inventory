import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";
import { useParams } from "react-router-dom";

export const ModelNotFoundMessage = () => {
  const { groupId } = useParams() as { groupId: string };

  return (
    <>
      <Typography variant={"h3"}>Group not found...</Typography>
      <Alert severity="error" variant={"filled"}>
        <Typography>
          You are currently looking for a model that does not exist. Please head
          back to the <Link href={`/inventory/${groupId}`}>Group</Link> and
          select a model from there.
        </Typography>
      </Alert>
    </>
  );
};
