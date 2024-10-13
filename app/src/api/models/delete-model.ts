import { apiUrl } from "../useApi.ts";

export const deleteModel =
  (token: string | null) => async (modelId: string) => {
    const response = await fetch(`${apiUrl}/models/${modelId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  };
