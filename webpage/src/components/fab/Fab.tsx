import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import { SpeedDialAction } from "@mui/material";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";

type FabProps = {
  ariaLabel: string;
  actions: {
    icon: ReactNode;
    name: string;
    callback: () => void;
    disabled?: boolean;
  }[];
};

export const Fab: FunctionComponent<FabProps> = ({ actions, ariaLabel }) => {
  const [fabBottom, setFabBottom] = useState("16px");
  const [fabOpen, setFabOpen] = useState(false);

  const updateFabBottom = () => {
    const footerTop =
      document.getElementById("footer")?.getBoundingClientRect().top ?? 0;

    setFabBottom(`${Math.max(16, window.innerHeight - footerTop + 16)}px`);
  };

  useEffect(() => {
    window.addEventListener("resize", updateFabBottom);
    window.addEventListener("scroll", updateFabBottom);
    return () => {
      window.removeEventListener("resize", updateFabBottom);
      window.removeEventListener("scroll", updateFabBottom);
    };
  }, []);

  useEffect(() => updateFabBottom());

  return (
    <SpeedDial
      ariaLabel={ariaLabel}
      sx={{ position: "fixed", bottom: fabBottom, right: 16 }}
      icon={<SpeedDialIcon />}
      open={fabOpen}
      onClick={() => setFabOpen(true)}
      onClose={() => setFabOpen(false)}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          onClick={() => {
            if (!action.disabled) action.callback();
          }}
          FabProps={{ disabled: action.disabled }}
          tooltipTitle={
            <span style={{ whiteSpace: "nowrap" }}> {action.name} </span>
          }
          tooltipOpen
        />
      ))}
    </SpeedDial>
  );
};
