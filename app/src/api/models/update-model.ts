import { apiUrl } from "../useApi.ts";

type payload = {
  name: string;
  miniatures: { stage: number; amount: number }[];
};

export const updateModel =
  (token: string | null) => async (modelId: string, modelData: payload) => {
    const response = await fetch(`${apiUrl}/models/${modelId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modelData),
    });

    return await response.json();
  };
