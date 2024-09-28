import { Collapse, DialogActions, DialogContent, Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import { useApi } from "../../../api/useApi.ts";
import { AppState } from "@state/types.ts";
import Alert from "@mui/material/Alert";

export const OldVersionStorageModal = () => {
  const { closeModal } = useStore(selectModalSlice);
  const [loading, setLoading] = useState(false);
  const [syncComplete, setSyncComplete] = useState(false);
  const api = useApi();

  const uploadLsToCloud = async () => {
    setLoading(true);
    const oldState = localStorage.getItem("my-mini-inventory")!;
    if (!oldState) return setLoading(false);

    const jsonState = JSON.parse(oldState);
    const {
      state: { collections, groups, models, workflowStages },
    } = jsonState as { state: AppState };

    await api.updateWorkflow({ stages: workflowStages });

    const createdCollections = await Promise.all(
      collections.map((collection) =>
        api
          .createCollection(collection.name)
          .then((cc) => ({ ...cc, oId: collection.id })),
      ),
    );
    const createdGroups = await Promise.all(
      groups.map(async (group) => {
        const oc = collections.find((collection) =>
          collection.groups.includes(group.id),
        );
        const newColId = createdCollections.find((cc) => cc.oId === oc?.id)?.id;
        if (!newColId)
          throw new Error(`Could not bind group ${group.name} to collection.`);
        const cg = await api.createGroup(newColId, group.name);
        return { ...cg, oId: group.id };
      }),
    );
    await Promise.all(
      models.map(async (model) => {
        const og = groups.find((group) => group.models.includes(model.id));
        const newColId = createdGroups.find((cg) => cg.oId === og?.id)?.id;
        if (!newColId)
          throw new Error(`Could not bind group ${model.name} to collection.`);
        const cm = await api.createModel(newColId, {
          name: model.name,
          miniatures: model.collection,
        });
        return { ...cm, oId: model.id };
      }),
    );

    setLoading(false);
    setSyncComplete(true);
    localStorage.removeItem("my-mini-inventory");
  };

  return (
    <>
      <DialogContent>
        <Typography variant={"h5"} sx={{ mt: 0 }}>
          Welcome back!
        </Typography>
        <Typography sx={{ my: 2 }}>
          It looks like there is still data in your local storage from before we
          had accounts and cloud saving. What would you like us to do with this
          data?
        </Typography>
        <Collapse in={syncComplete}>
          <Alert variant={"filled"} severity={"success"}>
            <Typography>
              Data was successfully synced with the cloud.
            </Typography>
          </Alert>
        </Collapse>
      </DialogContent>
      {syncComplete ? (
        <DialogActions>
          <Button
            variant="contained"
            color={"primary"}
            onClick={() => {
              closeModal();
            }}
          >
            Close
          </Button>
        </DialogActions>
      ) : (
        <DialogActions sx={{ flexDirection: "row-reverse", gap: 2 }}>
          <LoadingButton
            loading={loading}
            startIcon={<CloudUploadIcon />}
            variant="contained"
            color={"primary"}
            onClick={() => {
              uploadLsToCloud();
            }}
          >
            Upload it to the cloud
          </LoadingButton>
          <Tooltip
            title={
              "This will close the modal. It will reappear each time the site reloads..."
            }
          >
            <Button
              variant="text"
              color={"primary"}
              onClick={() => {
                closeModal();
              }}
            >
              Leave it for now...
            </Button>
          </Tooltip>

          <div style={{ flex: "1 0 0" }} />
          <Button
            startIcon={<LocalFireDepartmentIcon />}
            variant="outlined"
            color={"error"}
            onClick={() => {
              localStorage.removeItem("my-mini-inventory");
              closeModal();
            }}
          >
            Delete it all
          </Button>
        </DialogActions>
      )}
    </>
  );
};
