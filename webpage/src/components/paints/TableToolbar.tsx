import { alpha, InputAdornment, TextField, Toolbar } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Cancel, FilterList } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { ChangeEvent, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";

interface TableToolbarProps {
  numSelected: number;
  search: (term: string) => void;
  onDelete: () => void;
  deleteInProgress?: boolean;
}

export const TableToolbar = (props: TableToolbarProps) => {
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searching) {
      props.search(searchTerm);
    } else {
      setSearchTerm("");
      props.search("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searching, searchTerm]);

  const { numSelected } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity,
            ),
        },
      ]}
    >
      {searching ? (
        <>
          <TextField
            label="Search"
            value={searchTerm}
            size={"small"}
            fullWidth
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(event.target.value);
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearching(false)}>
                      <Cancel />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </>
      ) : numSelected > 0 ? (
        <>
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
          <LoadingButton
            loading={props.deleteInProgress}
            sx={{ minWidth: "20ch" }}
            startIcon={<DeleteIcon fontSize="large" />}
            onClick={props.onDelete}
          >
            Delete
          </LoadingButton>
        </>
      ) : (
        <>
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Your paints
          </Typography>
          <Button
            sx={{ minWidth: "17ch" }}
            startIcon={<FilterList />}
            onClick={() => setSearching(true)}
          >
            Filter
          </Button>
        </>
      )}
    </Toolbar>
  );
};
