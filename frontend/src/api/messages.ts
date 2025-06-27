const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL;
export const getMessages = async (chatId: string, token: string) => {
  console.log("getMessages called", `${BASE_URL}/${chatId}/messages`);

  const res = await fetch(`${BASE_URL}/${chatId}/messages`, {
    method: "GET",
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    if (res.status == 400) throw new Error("Chat not found");
    if (res.status == 500) throw new Error("Internet Error");
    if (res.status == 401) throw new Error("Unauthorized");
  }
  return res.json();
};
