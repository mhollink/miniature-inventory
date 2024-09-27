import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "@components/error-boundary/ErrorBoundary.tsx";
import { RootFallback } from "@components/error-boundary/RootFallback.tsx";
import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./router/routes.tsx";

import "./styles/index.scss";
import { LoadFirebase } from "./firebase/LoadFirebase.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary inCaseOfError={<RootFallback />}>
      <HelmetProvider>
        <LoadFirebase>
          <RouterProvider router={createBrowserRouter(routes)} />
        </LoadFirebase>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
);
