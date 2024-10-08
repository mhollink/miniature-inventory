import { ChangeEvent, MouseEvent, useState } from "react";
import { Data } from "@components/paints/PaintType.ts";

export const useTableSelection = () => {
  const [selected, setSelected] = useState<readonly string[]>([]);

  const handleSelectAllClick = (
    event: ChangeEvent<HTMLInputElement>,
    rows: Data[],
  ) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_: MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  return {
    handleClick,
    handleSelectAllClick,
    selected,
  };
};
