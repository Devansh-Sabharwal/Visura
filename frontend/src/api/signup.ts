const BASE_URL = process.env.NEXT_PUBLIC_FASTAPI_URL;

export const signUp = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail);
  }
  return data;
};
