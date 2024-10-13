import { GroupLink } from "@components/collections/GroupLink.tsx";
import Alert from "@mui/material/Alert";

export const GroupList = ({ groupIds }: { groupIds: string[] }) => {
  return (
    <>
      {groupIds.length === 0 && (
        <Alert severity="info" variant={"filled"}>
          There are currently no groups inside this collection.
        </Alert>
      )}

      {groupIds.map((groupId, index) => (
        <GroupLink key={groupId} groupId={groupId} index={index} />
      ))}
    </>
  );
};
