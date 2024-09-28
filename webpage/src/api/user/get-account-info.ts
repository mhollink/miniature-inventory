import { apiUrl } from "../useApi.ts";

type response = {
  support: string;
};

export const getAccountInfo = (token: string | null) => async () => {
  const response = await fetch(`${apiUrl}/profile`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return (await response.json()) as response;
};
