import { apiUrl } from "../useApi.ts";

type response = {
  id: string;
  name: string;
  groups: {
    id: string;
    name: string;
    sorting: number;
  }[];
}[];

export const getAllCollections = (token: string | null) => async () => {
  const response = await fetch(`${apiUrl}/collections`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return (await response.json()) as response;
};
