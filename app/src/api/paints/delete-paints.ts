import { apiUrl } from "../useApi.ts";

type payload = {
  ids: string[];
};

export const deletePaints =
  (token: string | null) => async (paintData: payload) => {
    const response = await fetch(`${apiUrl}/paints`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paintData),
    });

    return response.ok;
  };
