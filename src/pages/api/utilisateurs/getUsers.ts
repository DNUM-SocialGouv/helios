import { NextApiRequest, NextApiResponse } from "next";

import { getUsersListPaginatedEndpoint } from "../../../backend/infrastructure/controllers/getUsersListPaginatedEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

function getBasePath(request: NextApiRequest) {
  const nextRequestMeta = request[Reflect.ownKeys(request).find((s) => String(s) === "Symbol(NextRequestMeta)")];

  let protocole = "https://";
  if (nextRequestMeta.__NEXT_INIT_URL.includes("http://")) {
    protocole = "http://";
  }
  return protocole + request.headers.host;
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const basePath = getBasePath(request);

    if (request.method !== "GET") {
      response.status(405).send("Method not allowed");
    }

    const resp = await fetch(`${basePath}/api/auth/session`, {
      headers: {
        "Content-Type": "application/json",
        Cookie: request.headers.cookie,
      },

      method: "GET",
    });
    const userSession = await resp.json();

    //if current user is not Admin => forced institutionId_fiter to be institutionId of current user
    const institutionIdSession = (userSession.user.role as unknown as number) !== 1 ? userSession?.user.institutionId : 0;

    const key = request.query["key"] as string | "";
    const sort = request.query["sort"] as string | "";
    const page = request.query["page"] as unknown as number | 1;

    const institutionId = institutionIdSession || (request.query["institutionId"] as unknown as number | 0);
    const roleId = request.query["roleId"] as unknown as number | 0;
    const profilId = request.query["profileId"] as string | "";
    const etatId = request.query["etatId"] as string | "";
    const itemsPerPage = request.query["itemsPerPage"] as unknown as number;

    const users = await getUsersListPaginatedEndpoint(dependencies, key, sort, page, institutionId, roleId, profilId, etatId, itemsPerPage);

    return response.status(200).json(users);
  } catch (error) {
    return response.status(500);
  }
}
