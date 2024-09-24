import { RouteObject } from "react-router-dom";
import { App } from "@components/app/App.tsx";
import { AppFallback } from "@components/error-boundary/AppFallback.tsx";
import { RedirectTo } from "./RedirectTo.tsx";
import { PageFallback } from "@components/error-boundary/PageFallback.tsx";
import { ReactNode } from "react";
import { Roadmap } from "../pages/Roadmap.tsx";
import { Settings } from "../pages/Settings.tsx";
import { Home } from "../pages/Home.tsx";

const route = (path: string, component: ReactNode): RouteObject => ({
  path,
  element: <>{component} </>,
  errorElement: <PageFallback />,
});

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    errorElement: <AppFallback />,
    children: [
      route("/", <Home />),
      route("roadmap", <Roadmap />),
      route("settings", <Settings />),
      route("*", <RedirectTo path={"/"} />),
    ],
  },
  {
    path: "/*",
    element: <RedirectTo path={"/home"} />,
    errorElement: <PageFallback />,
  },
];
