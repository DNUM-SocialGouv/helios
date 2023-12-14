import { NextApiRequest } from "next";

function getBasePath(request: NextApiRequest) {
  const nextRequestMeta = request[Reflect.ownKeys(request).find((s) => String(s) === "Symbol(NextRequestMeta)")];

  let protocole = "https://";
  if (nextRequestMeta.__NEXT_INIT_URL.includes("http://")) {
    protocole = "http://";
  }
  return protocole + request.headers.host;
}

export const getUserSessionBack = async (request: NextApiRequest) => {
  const basePath = getBasePath(request);

  const resp = await fetch(`${basePath}/api/auth/session`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: request.headers.cookie,
    },

    method: "GET",
  });
  return await resp.json();
};
