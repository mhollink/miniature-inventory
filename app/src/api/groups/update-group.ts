import { apiUrl } from "../useApi.ts";

export const updateGroup =
  (token: string | null) => async (groupId: string, groupName: string) => {
    const response = await fetch(`${apiUrl}/groups/${groupId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: groupName }),
    });

    return await response.json();
  };
