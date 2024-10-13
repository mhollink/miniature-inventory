import { apiUrl } from "../useApi.ts";

type response = {
  id: string;
  brand: string;
  range: string;
  name: string;
  color: string;
}[];

export const getAllPaints = (token: string | null) => async () => {
  const response = await fetch(`${apiUrl}/paints`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return (await response.json()) as response;
};
