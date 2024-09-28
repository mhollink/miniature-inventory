import { apiUrl } from "../useApi.ts";

type response = { index: string; name: string }[];

export const getWorkflow = (token: string | null) => async () => {
  if (!token) throw Error("No token provided, user not signed in yet.");
  const response = await fetch(`${apiUrl}/workflow`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return (await response.json()) as response;
};
