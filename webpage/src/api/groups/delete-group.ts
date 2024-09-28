import { apiUrl } from "../useApi.ts";

export const deleteGroup =
  (token: string | null) => async (groupId: string) => {
    const response = await fetch(`${apiUrl}/groups/${groupId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.ok;
  };
