import { NextApiRequest } from "next";

function getBasePath(request: NextApiRequest) {
  // const nextRequestMeta = request[Reflect.ownKeys(request).find((s) => String(s) === "Symbol(NextRequestMeta)")];

  // let protocole = "https://";
  // if (nextRequestMeta.__NEXT_INIT_URL.includes("http://")) {
  //   protocole = "http://";
  // }
  const protocole = "https://";
  return protocole + request.headers.host;
}

export const getUserSessionBack = async (request: NextApiRequest) => {
  const basePath = getBasePath(request);
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Cookie", request.headers.cookie || '');

  const resp = await fetch(`${basePath}/api/auth/session`, {
    headers: headers,

    method: "GET",
  });
  return await resp.json();
};
