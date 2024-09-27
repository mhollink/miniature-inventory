import { useStore } from "@state/store.ts";
import { selectModalSlice } from "@state/modal";
import { selectInventorySlice } from "@state/inventory";
import { ChangeEvent, FormEvent, useState } from "react";
import {
  DialogActions,
  DialogContent,
  FormHelperText,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { selectWorkflowSlice } from "@state/workflow";

export const AddModelModal = () => {
  const { closeModal, openedModalContext } = useStore(selectModalSlice);
  const { addModel, findGroup } = useStore(selectInventorySlice);
  const { workflowStages } = useStore(selectWorkflowSlice);
  const group = findGroup(openedModalContext.groupId);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);

  const [stages, setStages] = useState(workflowStages.map(() => "0"));
  const [stagesError, setStagesError] = useState(false);

  const handleClose = () => {
    setNameError(false);
    setStagesError(false);
    closeModal();
  };

  const handleAddModel = () => {
    if (!name || name.trim().length === 0) {
      setNameError(true);
      return;
    }
    if (stages.find((stage) => Number(stage) < 0)) {
      return;
    }
    if (stages.reduce((total, current) => total + Number(current), 0) <= 0) {
      setStagesError(true);
      return;
    }

    addModel(
      openedModalContext.groupId,
      name,
      stages.map((amount, index) => ({
        amount: Number(amount),
        stage: index,
      })),
    );
    handleClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAddModel();
  };

  return (
    <>
      <DialogContent>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Stack spacing={1}>
            <Typography>
              <strong>Adding a new model to the "{group?.name}"-group. </strong>
              You can just create the model and later update the amounts, or
              pre-fill the amounts right away.
            </Typography>
            <Typography>Choose a name the model</Typography>
            <Box sx={{ mt: 2 }}>
              <TextField
                error={nameError}
                id="new-model-name-input"
                label="Model name"
                autoComplete="off"
                autoFocus
                value={name}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setNameError(false);
                  setName(event.target.value);
                }}
                helperText={
                  nameError ? "The name of a collection cannot be empty!" : ""
                }
                fullWidth
              />
            </Box>
            <Typography>
              How many miniatures do you have, and how far along are they?
            </Typography>
            <Stack direction={"row"} flexWrap={"wrap"}>
              {workflowStages.map((stage, index) => (
                <Box
                  key={`stage-${index}`}
                  sx={{ width: "calc(33.3% - 10px)", m: "5px" }}
                >
                  <TextField
                    id={`new-model-${stage}-input`}
                    error={Number(stages[index]) < 0 || stagesError}
                    label={stage}
                    value={String(stages[index])}
                    autoComplete="off"
                    slotProps={{
                      input: {
                        type: "number",
                      },
                    }}
                    helperText={
                      Number(stages[index]) < 0
                        ? "Amount cannot be below 0"
                        : ""
                    }
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      setStagesError(false);
                      const newStages = [...stages];
                      newStages[index] = event.target.value;
                      setStages(newStages);
                    }}
                    fullWidth
                  />
                </Box>
              ))}
            </Stack>
            <FormHelperText
              error={stagesError}
              sx={{
                display: stagesError ? "inline-block" : "none",
              }}
            >
              Your total amount of miniatures must at least be 1
            </FormHelperText>
          </Stack>
          <Button type="submit" sx={{ display: "none" }} />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant={"contained"} onClick={handleAddModel}>
          Add collection
        </Button>
      </DialogActions>
    </>
  );
};
