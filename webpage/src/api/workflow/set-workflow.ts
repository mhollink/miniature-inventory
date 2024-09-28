import { apiUrl } from "../useApi.ts";

type payload = {
  stages: string[];
};

export const setWorkflow =
  (token: string | null) => async (workflowData: payload) => {
    const response = await fetch(`${apiUrl}/workflow`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workflowData),
    });

    return await response.json();
  };
