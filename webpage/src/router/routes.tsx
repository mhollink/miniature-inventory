import { Outlet, RouteObject } from "react-router-dom";
import { App } from "@components/app/App.tsx";
import { AppFallback } from "@components/error-boundary/AppFallback.tsx";
import { RedirectTo } from "./RedirectTo.tsx";
import { ReactNode } from "react";
import { Roadmap } from "../pages/Roadmap.tsx";
import { Settings } from "../pages/Settings.tsx";
import { Collections } from "../pages/Collections.tsx";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { capitalizeFirstLetter } from "../utils/string.ts";
import { Group } from "../pages/Group.tsx";

const route = (
  path: string,
  component: ReactNode,
  crumbText?: string,
): RouteObject => ({
  path,
  element: <>{component} </>,
  errorElement: <AppFallback />,
  handle: {
    crumb: () => (
      <Typography key={path}>
        {crumbText || capitalizeFirstLetter(path)}
      </Typography>
    ),
  },
});

const routeWithChildren = (
  path: string,
  children: RouteObject[],
): RouteObject => ({
  path,
  element: <Outlet />,
  errorElement: <AppFallback />,
  children: children,
  handle: {
    crumb: () => (
      <Link key={path} href={"/" + path}>
        {capitalizeFirstLetter(path)}
      </Link>
    ),
  },
});

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <AppFallback />,
    children: [
      route("/", <RedirectTo path={"/collections"} />),
      route("collections", <Collections />),
      routeWithChildren("collections", [route(":id", <Group />, "Group")]),
      route("roadmap", <Roadmap />),
      route("settings", <Settings />),
      route("*", <RedirectTo path={"/collections"} />),
    ],
    handle: {
      crumb: () => (
        <Link key="/home" href="/">
          Home
        </Link>
      ),
    },
  },
  {
    path: "/privicy-policy",
    element: <RedirectTo path={"/collections"} />,
    errorElement: <AppFallback />,
  },
  {
    path: "/*",
    element: <RedirectTo path={"/collections"} />,
    errorElement: <AppFallback />,
  },
];
