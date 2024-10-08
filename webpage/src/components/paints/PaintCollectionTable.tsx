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
import { useMemo } from "react";
import { Data } from "@components/paints/PaintType.ts";
import { useTableSorting } from "@components/paints/hooks/table-sorting.ts";
import { useTableSelection } from "@components/paints/hooks/table-selection.ts";
import { usePagination } from "@components/paints/hooks/table-pagination.ts";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";

export const PaintCollectionTable = () => {
  const rows: Data[] = [
    {
      id: "5594fa2d-57e6-43ec-90cb-8841232a148b",
      color: "rgb(15, 61, 124)",
      brand: "Citadel",
      range: "Base",
      name: "Macragge Blue",
    },
    {
      id: "5c9bafc0-7f63-4d73-bb60-994f84053cdc",
      color: "rgb(193, 21, 25)",
      brand: "Citadel",
      range: "Contrast",
      name: "Blood Angels Red",
    },
    {
      id: "6b942a7e-40eb-4c92-8540-4b0cd3627e6a",
      color: "rgb(192, 20, 17)",
      brand: "Citadel",
      range: "Layer",
      name: "Evil Sunz Scarlet",
    },

    {
      id: "fc526edb-f9e4-4699-9ddb-b3fc7e5b703b",
      color: "rgb(24, 24, 24)",
      brand: "Citadel",
      range: "Shade",
      name: "Nuln Oil",
    },
    {
      id: "fcb1c2a4-66ec-4e64-9460-685fa9eeca0b",
      color: "rgb(255, 245, 90)",
      brand: "Citadel",
      range: "Dry",
      name: "Hexos Palesun",
    },
    {
      id: "0818504a-c9b2-4984-8e0f-8f7781e44ce1",
      color: "rgb(179, 158, 128)",
      brand: "Citadel",
      range: "Texture",
      name: "Agrellan Earth",
    },
  ];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { selected, handleSelectAllClick, handleClick } = useTableSelection();
  const { order, orderBy, handleRequestSort, getComparator } =
    useTableSorting();
  const { page, rowsPerPage, handleChangeRowsPerPage, handleChangePage } =
    usePagination();

  const visibleRows = useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, getComparator],
  );

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <Box>
      <TableToolbar numSelected={selected.length} />
      <TableContainer>
        <Table>
          <TableHeader
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onSelectAllClick={(event) => handleSelectAllClick(event, rows)}
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
                    {row.name}
                  </TableCell>
                  <TableCell>{row.brand}</TableCell>
                  <TableCell>{row.range}</TableCell>
                  {!isMobile && (
                    <TableCell align="center">
                      <Box
                        sx={{
                          width: 25,
                          height: 25,
                          margin: "0 auto",
                          backgroundColor: row.color,
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
        rowsPerPageOptions={[5, 10, 25]}
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
