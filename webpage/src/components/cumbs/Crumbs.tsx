import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useMatches } from "react-router-dom";
import { ReactNode } from "react";

// eslint-disable-next-line
function hasHandle(obj: unknown): obj is { handle: { [key: string]: any } } {
  return typeof obj === "object" && obj !== null && "handle" in obj;
}

function hasCrumb(
  obj: unknown,
): obj is { crumb: (data: unknown) => ReactNode } {
  return typeof obj === "object" && obj !== null && "crumb" in obj;
}

export const Crumbs = () => {
  const matches = useMatches();
  const crumbs = matches
    // first get rid of any matches that don't have handle and crumb
    .filter((match) => hasHandle(match))
    .filter((match) => hasCrumb(match.handle))
    // now map them into an array of elements, passing the loader
    // data to each one
    .map((match) => match.handle.crumb(match.data));

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      {crumbs}
    </Breadcrumbs>
  );
};
