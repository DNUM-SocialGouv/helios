/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";

import { getUsersListPaginatedEndpoint } from "../../../backend/infrastructure/controllers/getUsersListPaginatedEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { checkAdminRole } from "../../../checkAdminMiddleware";
import { getUserSessionBack } from "../../../frontend/utils/getUserSessionBack";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    if (request.method !== "GET") {
      response.status(405).send("Method not allowed");
    }

    const userSession = await getUserSessionBack(request);

    //if current user is not Admin National => forced institutionId_fiter to be institutionId of current user
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
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (await checkAdminRole(req, res)) {
    await handler(req, res);
  }
};
