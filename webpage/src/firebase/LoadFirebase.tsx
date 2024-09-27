import { FunctionComponent, PropsWithChildren } from "react";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { firebaseConfig } from "./config.ts";

export const LoadFirebase: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const app = initializeApp(firebaseConfig);

  getAnalytics(app);

  return <>{children}</>;
};
