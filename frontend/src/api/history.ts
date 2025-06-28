const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL;
export const getHistory = async (token: string) => {
  const res = await fetch(`${BASE_URL}/chats/history`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    if (res.status == 500) throw new Error("Internet Error");
    if (res.status == 401) throw new Error("Unauthorized");
  }
  const data = await res.json();
  return data;
};
