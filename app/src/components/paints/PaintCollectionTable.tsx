import Box from "@mui/material/Box";
import { TableToolbar } from "@components/paints/TableToolbar.tsx";
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from "@mui/material";
import { TableHeader } from "@components/paints/TableHeader.tsx";
import { useMemo, useState } from "react";
import { useTableSorting } from "@components/paints/hooks/table-sorting.ts";
import { useTableSelection } from "@components/paints/hooks/table-selection.ts";
import { usePagination } from "@components/paints/hooks/table-pagination.ts";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useStore } from "@state/store.ts";
import { selectPaintsSlice } from "@state/paints";
import { useApi } from "../../api/useApi.ts";
import { Alerts } from "@components/alerts/alerts.tsx";
import { logApiFailure, logKeyEvent } from "../../firebase/analytics.ts";
import { selectAlertSlice } from "@state/alert";

export const PaintCollectionTable = () => {
  const { ownedPaints: rows, deletePaints } = useStore(selectPaintsSlice);
  const { triggerAlert } = useStore(selectAlertSlice);
  const api = useApi();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { selected, handleSelectAllClick, handleClick, clearSelection } =
    useTableSelection();
  const { order, orderBy, handleRequestSort, getComparator } =
    useTableSorting();
  const { page, rowsPerPage, handleChangeRowsPerPage, handleChangePage } =
    usePagination();
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const visibleRows = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .filter((paint) => {
          const searchString = filter.toLowerCase().trim();
          return [paint.brand, paint.range, paint.name].some((value) =>
            value.toLowerCase().trim().includes(searchString),
          );
        })
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [rows, getComparator, order, orderBy, page, rowsPerPage, filter],
  );

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const onSearchTermChanged = (term: string) => {
    setFilter(term);
  };

  const deleteSelectedPaints = async () => {
    try {
      setLoading(true);
      await api.deletePaints({ ids: selected });
      triggerAlert(Alerts.ADD_PAINT_SUCCESS);
      logKeyEvent("delete paints", { amount: selected.length.toString() });
      deletePaints(selected);
      clearSelection();
    } catch (e) {
      triggerAlert(Alerts.ADD_PAINT_ERROR);
      logApiFailure(e, "delete paints");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <TableToolbar
        numSelected={selected.length}
        search={onSearchTermChanged}
        onDelete={deleteSelectedPaints}
        deleteInProgress={loading}
      />
      <TableContainer>
        <Table>
          <TableHeader
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={(event) =>
              handleSelectAllClick(event, rows, filter)
            }
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />

          <TableBody>
            {visibleRows.map((row, index) => {
              const isItemSelected = selected.includes(row.id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, row.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                  sx={{ cursor: "pointer" }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                    />
                  </TableCell>
                  <TableCell
                    component="th"
                    id={labelId}
                    scope="row"
                    padding="none"
                  >
                    {row.name}{" "}
                    {isMobile && (
                      <i>
                        <br />({row.range})
                      </i>
                    )}
                  </TableCell>
                  <TableCell>{row.brand}</TableCell>
                  {!isMobile && <TableCell>{row.range}</TableCell>}
                  {!isMobile && (
                    <TableCell align="center">
                      <Box
                        sx={{
                          width: 25,
                          height: 25,
                          margin: "0 auto",
                          background:
                            row.color === ""
                              ? "linear-gradient(45deg, transparent 42%, red 42%, red 58%, transparent 58%)," +
                                "linear-gradient(-45deg, transparent 42%, red 42%, red 58%, transparent 58%);"
                              : row.color === "transparent"
                                ? "linear-gradient(45deg, #DDDDDD 0%, #333333 100%)"
                                : row.color,
                          border: (theme) =>
                            "1px solid " + theme.palette.text.primary,
                          boxShadow: 5,
                        }}
                      ></Box>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53 * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};
