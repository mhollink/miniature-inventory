import { apiUrl } from "../useApi.ts";

type payload = {
  groups: { groupId: string; collectionId: string; index: number }[];
};

export const reorderGroups =
  (token: string | null) => async (ordering: payload) => {
    const response = await fetch(`${apiUrl}/collections`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ordering),
    });

    return response.ok;
  };
