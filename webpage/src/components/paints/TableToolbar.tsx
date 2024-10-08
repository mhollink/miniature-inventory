import { alpha, Toolbar } from "@mui/material";
import Typography from "@mui/material/Typography";
import { FilterList } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";

interface TableToolbarProps {
  numSelected: number;
}

export const TableToolbar = (props: TableToolbarProps) => {
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
      {numSelected > 0 ? (
        <>
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
          <Button
            sx={{ minWidth: "20ch" }}
            startIcon={<DeleteIcon fontSize="large" />}
          >
            Delete
          </Button>
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
          <Button sx={{ minWidth: "20ch" }} startIcon={<FilterList />}>
            Filter
          </Button>
        </>
      )}
    </Toolbar>
  );
};
