import { RouteObject } from "react-router-dom";
import { App } from "@components/app/App.tsx";
import { AppFallback } from "@components/error-boundary/AppFallback.tsx";
import { RedirectTo } from "./RedirectTo.tsx";
import { ReactNode } from "react";
import { Roadmap } from "../pages/Roadmap.tsx";
import { Settings } from "../pages/Settings.tsx";
import { Home } from "../pages/Home.tsx";
import { Collections } from "../pages/Collections.tsx";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { capitalizeFirstLetter } from "../utils/string.ts";

const route = (path: string, component: ReactNode): RouteObject => ({
  path,
  element: <>{component} </>,
  errorElement: <AppFallback />,
  handle: {
    crumb: () => (
      <Typography key={path}>{capitalizeFirstLetter(path)}</Typography>
    ),
  },
});

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <AppFallback />,
    children: [
      route("/", <Home />),
      route("collections", <Collections />),
      route("roadmap", <Roadmap />),
      route("settings", <Settings />),
      route("*", <RedirectTo path={"/"} />),
    ],
    handle: {
      crumb: () => (
        <Link key="/home" href="/home">
          Home
        </Link>
      ),
    },
  },
  {
    path: "/*",
    element: <RedirectTo path={"/home"} />,
    errorElement: <AppFallback />,
  },
];
