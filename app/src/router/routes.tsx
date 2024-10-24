import { Link, Outlet, RouteObject } from "react-router-dom";
import { App } from "@components/app/App.tsx";
import { AppFallback } from "@components/error-boundary/AppFallback.tsx";
import { RedirectTo } from "./RedirectTo.tsx";
import { ReactNode } from "react";
import { Roadmap } from "../pages/Roadmap.tsx";
import { Settings } from "../pages/Settings.tsx";
import { Collections } from "../pages/Collections.tsx";
import Typography from "@mui/material/Typography";
import { Group } from "../pages/Group.tsx";
import { Home } from "../pages/Home.tsx";
import { SignUp } from "../pages/SignUp.tsx";
import { About } from "../pages/About.tsx";
import { Paints } from "../pages/Paints.tsx";
import { AppState } from "@state/types.ts";
import { Crumb } from "@components/cumbs/Crumb.tsx";
import { Model } from "../pages/Model.tsx";

const route = (
  path: string,
  component: ReactNode,
  crumbLabelFallback?: string,
  getCrumbLabel: (
    pathParams: Record<string, string>,
  ) => (state: AppState) => string = () => () => "",
): RouteObject => ({
  path,
  element: <>{component} </>,
  errorElement: <AppFallback />,
  handle: {
    crumb: (pathParams: Record<string, string>) => (
      <Crumb
        key={path}
        path={path}
        getCrumbLabel={getCrumbLabel(pathParams)}
        crumbLabelFallback={crumbLabelFallback}
      />
    ),
  },
});

const routeWithChildren = (
  path: string,
  children: RouteObject[],
  crumbLabelFallback?: string,
  getCrumbLabel: (
    pathParams: Record<string, string>,
  ) => (state: AppState) => string = () => () => "",
  getReturnPath: (params: Record<string, string>) => string = () => path,
): RouteObject => ({
  path,
  element: <Outlet />,
  errorElement: <AppFallback />,
  children: children,
  handle: {
    crumb: (pathParams: Record<string, string>) => (
      <Crumb
        link
        key={path}
        path={getReturnPath(pathParams)}
        getCrumbLabel={getCrumbLabel(pathParams)}
        crumbLabelFallback={crumbLabelFallback}
      />
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
      route("inventory", <Collections />),
      routeWithChildren("inventory", [
        route(
          ":groupId",
          <Group />,
          "Group",
          (params) => (state) => state.findGroup(params.groupId)?.name || "",
        ),
        routeWithChildren(
          ":groupId",
          [
            route(
              "models/:modelId",
              <Model />,
              "Model",
              (params) => (state) =>
                state.findModel(params.modelId)?.name || "",
            ),
          ],
          "Group",
          (params) => (state) => state.findGroup(params.groupId)?.name || "",
          (params) => `inventory/${params.groupId}`,
        ),
      ]),
      route("paint-storage", <Paints />, "Paint storage"),
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
