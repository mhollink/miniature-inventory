import { apiUrl } from "../useApi.ts";

export const updateCollection =
  (token: string | null) =>
  async (collectionId: string, updatedName: string) => {
    const response = await fetch(`${apiUrl}/collections/${collectionId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: updatedName }),
    });

    return await response.json();
  };
