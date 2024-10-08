import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Link from "@mui/material/Link";

export const GroupNotFoundMessage = () => {
  return (
    <>
      <Typography variant={"h3"}>Group not found...</Typography>
      <Alert severity="error" variant={"filled"}>
        <Typography>
          You are currently looking for a group that does not exist. Please head
          back to the <Link href={"/collections"}>Collections overview</Link>{" "}
          and select a group from there.
        </Typography>
      </Alert>
    </>
  );
};
