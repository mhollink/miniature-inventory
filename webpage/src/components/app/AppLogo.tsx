import useTheme from "@mui/material/styles/useTheme";
import { FunctionComponent } from "react";

type AppLogoProps = {
  large?: boolean;
};

export const AppLogo: FunctionComponent<AppLogoProps> = ({ large }) => {
  const theme = useTheme();
  return (
    <img
      src={"icons/icon.png"}
      alt="MESBG List Builder"
      style={
        large
          ? {
              maxWidth: "72px",
              padding: ".5rem",
              marginRight: "1rem",
              borderRadius: ".5rem",
              backgroundColor: theme.palette.common.white,
            }
          : {
              maxWidth: "50px",
              padding: ".2rem",
              marginRight: "1rem",
              borderRadius: ".5rem",
              backgroundColor: theme.palette.common.white,
            }
      }
    />
  );
};
