import { Link, Outlet, RouteObject } from "react-router-dom";
import { App } from "@components/app/App.tsx";
import { AppFallback } from "@components/error-boundary/AppFallback.tsx";
import { RedirectTo } from "./RedirectTo.tsx";
import { ReactNode } from "react";
import { Roadmap } from "../pages/Roadmap.tsx";
import { Settings } from "../pages/Settings.tsx";
import { Collections } from "../pages/Collections.tsx";
import Typography from "@mui/material/Typography";
import { capitalizeFirstLetter } from "../utils/string.ts";
import { Group } from "../pages/Group.tsx";
import { Home } from "../pages/Home.tsx";
import { SignUp } from "../pages/SignUp.tsx";
import { About } from "../pages/About.tsx";
import { Paints } from "../pages/Paints.tsx";

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
    crumb: () => {
      return (
        <Typography
          key={path}
          component={"span"}
          sx={{
            "& a": { color: (theme) => theme.palette.primary.main },
          }}
        >
          <Link to={"/" + path}>{capitalizeFirstLetter(path)}</Link>
        </Typography>
      );
    },
  },
});

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <AppFallback />,
    children: [
      route("/", <Home />),
      route("inventory", <Collections />),
      routeWithChildren("inventory", [route(":id", <Group />, "Group")]),
      route("paint-storage", <Paints />),
      route("roadmap", <Roadmap />),
      route("about", <About />),
      route("settings", <Settings />),
      route("sign-up", <SignUp />, "Sign up"),
      route("*", <RedirectTo path={"/"} />),
    ],
    handle: {
      crumb: () => (
        <Typography
          key={"/home"}
          component={"span"}
          sx={{
            "& a": { color: (theme) => theme.palette.primary.main },
          }}
        >
          <Link to="/">Home</Link>
        </Typography>
      ),
    },
  },
  {
    path: "/*",
    element: <RedirectTo path={"/"} />,
    errorElement: <AppFallback />,
  },
];
