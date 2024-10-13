import { apiUrl } from "../useApi.ts";

type response = {
  id: string;
  name: string;
  models: {
    id: string;
    name: string;
    sorting: number;
    miniatures: {
      index: string;
      amount: string;
    }[];
  }[];
}[];

export const getAllGroups = (token: string | null) => async () => {
  const response = await fetch(`${apiUrl}/groups`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return (await response.json()) as response;
};
