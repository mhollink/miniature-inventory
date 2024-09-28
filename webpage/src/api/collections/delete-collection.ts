import { apiUrl } from "../useApi.ts";

export const deleteCollection =
  (token: string | null) => async (collectionId: string) => {
    const response = await fetch(`${apiUrl}/collections/${collectionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.ok;
  };
