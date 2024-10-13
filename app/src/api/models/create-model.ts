import { apiUrl } from "../useApi.ts";

type payload = {
  name: string;
  miniatures: { stage: number; amount: number }[];
};

type response = {
  id: string;
  name: string;
  miniatures: { stage: number; amount: number }[];
};

export const createModelInGroup =
  (token: string | null) => async (groupId: string, modelData: payload) => {
    const response = await fetch(`${apiUrl}/groups/${groupId}/models`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modelData),
    });

    return (await response.json()) as response;
  };
