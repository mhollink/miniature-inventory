import {
  Button,
  Collapse,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { selectWorkflowSlice } from "@state/workflow";
import { useStore } from "@state/store.ts";
import Stack from "@mui/material/Stack";
import { useWorkflowColors } from "@hooks/useWorkflowColors.ts";
import PaletteIcon from "@mui/icons-material/Palette";
import Alert from "@mui/material/Alert";
import { useState } from "react";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useApi } from "../../api/useApi.ts";
import LoadingButton from "@mui/lab/LoadingButton";
import { selectInventorySlice } from "@state/inventory";

export const WorkflowEditForm = () => {
  const { workflowStages, setWorkflowStages: updateWorkflowStagesState } =
    useStore(selectWorkflowSlice);
  const { models } = useStore(selectInventorySlice);
  const { getColorForStage } = useWorkflowColors();
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [localWorkflowStages, setWorkflowStages] = useState(workflowStages);

  const potentiallyDeletedModels = models
    .flatMap((m) => m.collection)
    .filter((c) => c.stage > localWorkflowStages.length - 1)
    .reduce((t, m) => t + m.amount, 0);

  const handleInputChange = (index: number, value: string) => {
    const newStrings = [...localWorkflowStages];
    newStrings[index] = value;
    setWorkflowStages(newStrings);
  };

  const handleDelete = (index: number) => {
    const newStrings = localWorkflowStages.filter((_, i) => i !== index);
    setWorkflowStages(newStrings);
  };

  const handleAdd = () => {
    setWorkflowStages([...localWorkflowStages, ""]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await api.updateWorkflow({
      stages: localWorkflowStages,
    });
    updateWorkflowStagesState(localWorkflowStages);
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 5000);
    setLoading(false);
  };

  return (
    <Stack>
      <Alert variant="filled" severity="info" sx={{ mb: 3 }}>
        Making alterations the your workflow will mean all miniatures will be
        updated.
      </Alert>
      <Collapse
        in={
          workflowStages.length > localWorkflowStages.length &&
          potentiallyDeletedModels > 0
        }
      >
        <Alert variant="filled" severity="warning" sx={{ mb: 3 }}>
          Removing one or multiple stages from the workflow will remove all
          miniatures currently stored in that stage.{" "}
          <strong>
            <u>Deleting {workflowStages.length - localWorkflowStages.length}</u>
          </strong>{" "}
          stages will result in the{" "}
          <strong>
            <u>deletion of {potentiallyDeletedModels}</u>
          </strong>
        </Alert>
      </Collapse>

      <Collapse in={updateSuccess}>
        <Alert variant="filled" severity="success" sx={{ mb: 3 }}>
          Successfully updated workflow
        </Alert>
      </Collapse>

      {localWorkflowStages.map((stageName, index) => {
        const color = getColorForStage(index, localWorkflowStages.length).color;
        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <TextField
              label={`Stage ${index + 1}`}
              value={stageName}
              onChange={(e) => handleInputChange(index, e.target.value)}
              variant="outlined"
              size="small"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end" sx={{ cursor: "pointer" }}>
                      <Tooltip
                        title={
                          "This color is automatically generated based on the amount of stages you have."
                        }
                      >
                        <PaletteIcon
                          sx={{
                            color,
                            filter: "drop-shadow(1px 1px 0.15rem #00000077)",
                          }}
                        />
                      </Tooltip>
                    </InputAdornment>
                  ),
                },
              }}
              fullWidth
            />
            <IconButton
              onClick={() => handleDelete(index)}
              color={"error"}
              aria-label="delete"
            >
              <DeleteIcon />
            </IconButton>
          </div>
        );
      })}
      <ButtonGroup color="inherit" fullWidth>
        <Button onClick={handleAdd} sx={{ flexGrow: 1 }}>
          Add workflow stage
        </Button>
        <LoadingButton
          loading={loading}
          onClick={handleSubmit}
          color={"primary"}
          variant={"contained"}
          sx={{
            width: "32ch",
            p: 1,
          }}
        >
          Save workflow
        </LoadingButton>
      </ButtonGroup>
    </Stack>
  );
};
