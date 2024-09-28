import { apiUrl } from "../useApi.ts";

type response = {
  id: string;
  name: string;
};

export const createGroupInCollection =
  (token: string | null) => async (collectionId: string, groupName: string) => {
    const response = await fetch(
      `${apiUrl}/collections/${collectionId}/groups`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: groupName }),
      },
    );

    return (await response.json()) as response;
  };
