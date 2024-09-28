import { apiUrl } from "../useApi.ts";

type payload = {
  models: { id: string; index: number }[];
};

export const reorderModels =
  (token: string | null) => async (groupId: string, ordering: payload) => {
    const response = await fetch(`${apiUrl}/groups/${groupId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ordering),
    });

    return response.ok;
  };
