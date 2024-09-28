import { apiUrl } from "../useApi.ts";

type response = {
  id: string;
  name: string;
};

export const createCollection =
  (token: string | null) => async (name: string) => {
    if (!token) throw Error("No token provided, user not signed in yet.");
    const response = await fetch(`${apiUrl}/collections`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    return (await response.json()) as response;
  };
