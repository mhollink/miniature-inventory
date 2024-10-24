import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { capitalizeFirstLetter } from "../../utils/string.ts";
import { AppState } from "@state/types.ts";
import { useStore } from "@state/store.ts";

export const Crumb = ({
  path,
  crumbLabelFallback,
  getCrumbLabel = () => "",
  link = false,
}: {
  path: string;
  crumbLabelFallback?: string;
  getCrumbLabel?: (state: AppState) => string;
  link?: boolean;
}) => {
  const crumbLabel =
    useStore(getCrumbLabel) ||
    crumbLabelFallback ||
    capitalizeFirstLetter(path);
  return link ? (
    <Typography
      key={path}
      component={"span"}
      sx={{
        "& a": { color: (theme) => theme.palette.primary.main },
      }}
    >
      <Link to={"/" + path}>{crumbLabel}</Link>
    </Typography>
  ) : (
    <Typography key={path}>{crumbLabel}</Typography>
  );
};
