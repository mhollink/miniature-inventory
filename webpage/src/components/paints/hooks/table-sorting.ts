import { SortOrder } from "@components/paints/TableHeader.tsx";
import { MouseEvent, useState } from "react";
import { Paint } from "@state/paints";

export const useTableSorting = () => {
  const [order, setOrder] = useState<SortOrder>("desc");
  const [orderBy, setOrderBy] = useState<keyof Paint>("brand");

  const descendingComparator = <T>(a: T, b: T, orderBy: keyof T) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const getComparator = <Key extends keyof Paint>(
    order: SortOrder,
    orderBy: Key,
  ): ((
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string },
  ) => number) =>
    order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);

  const handleRequestSort = (_: MouseEvent<unknown>, property: keyof Paint) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  return {
    getComparator,
    handleRequestSort,
    order,
    orderBy,
  };
};
