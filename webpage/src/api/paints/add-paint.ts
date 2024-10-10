import { apiUrl } from "../useApi.ts";

type payload = {
  brand: string;
  range: string;
  name: string;
  color: string;
};

type response = {
  id: string;
  brand: string;
  range: string;
  name: string;
  color: string;
};

export const addPaint =
  (token: string | null) => async (paintData: payload) => {
    const response = await fetch(`${apiUrl}/paints`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paintData),
    });

    return (await response.json()) as response;
  };
