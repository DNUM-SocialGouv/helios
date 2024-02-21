import { NextApiRequest } from "next";

function getBasePath(request: NextApiRequest) {
  let protocole = "https://";
  if (request?.headers?.referer?.includes("http://")) {
    protocole = "http://";
  }

  return protocole + request.headers.host;
}

export const getUserSessionBack = async (request: NextApiRequest) => {
  const basePath = getBasePath(request);
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("Cookie", request.headers.cookie || "");

  const resp = await fetch(`${basePath}/api/auth/session`, {
    headers: headers,

    method: "GET",
  });
  return await resp.json();
};
