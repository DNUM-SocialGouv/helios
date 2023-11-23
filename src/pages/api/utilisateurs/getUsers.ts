import { NextApiRequest, NextApiResponse } from "next";

import { getUsersListPaginatedEndpoint } from "../../../backend/infrastructure/controllers/getUsersListPaginatedEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    if (request.method !== "GET") {
      response.status(405).send("Method not allowed");
    }
    const key = request.query["key"] as string | "";
    const sort = request.query["sort"] as string | "";
    const page = request.query["page"] as number | 1;

    const institutionId = request.query["institutionId"] as number | 0;
    const roleId = request.query["roleId"];
    const profilId = request.query["profileId"] as string | "";

    console.log("777777777777777---->", profilId);
    console.log("888888888888888888---->", typeof profilId);

    const users = await getUsersListPaginatedEndpoint(dependencies, key, sort, page, institutionId, roleId, profilId);

    return response.status(200).json(users);
  } catch (error) {
    return response.status(500);
  }
}
