import { apiUrl } from "../useApi.ts";

type response = {
  total_users: number;
  total_collections: number;
  total_groups: number;
  total_models: number;
  total_miniatures: number;
};

export const getStatistics = () => async () => {
  const response = await fetch(`${apiUrl}/statistics`, {
    method: "GET",
  });

  return (await response.json()) as response;
};
