import { logEvent } from "firebase/analytics";
import { analytics } from "./firebase.ts";

export const logApiFailure = (error: Error | unknown, endpoint: string) => {
  if (analytics) {
    if (error instanceof Error) {
      logEvent(analytics, "exception", {
        error_message: error.message,
        error_stack: error.stack,
        endpoint,
        timestamp: new Date().toISOString(),
      });
    } else {
      logEvent(analytics, "exception", {
        error_message: "An unknown error occurred",
        endpoint,
        timestamp: new Date().toISOString(),
      });
    }
  }
};

export const logKeyEvent = (
  event: string,
  payload: Record<string, string> = {},
) => {
  if (analytics) {
    logEvent(analytics, event, {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }
};
