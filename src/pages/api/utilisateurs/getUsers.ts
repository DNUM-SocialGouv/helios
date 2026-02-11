/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { getUsersListPaginatedEndpoint } from "../../../backend/infrastructure/controllers/getUsersListPaginatedEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { checkAdminRole } from "../../../checkAdminMiddleware";
import { Role } from "../../../commons/Role";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    if (request.method !== "GET") {
      response.status(405).send("Method not allowed");
    }

    const userSession = await getServerSession(request, response, authOptions);

    if (
      // Un admin central n’a aucun droit sur ce endpoint
      (userSession?.user?.role as number) === Role.ADMIN_CENTR ||
      // Un utilisateur n’a aucun droit sur ce endpoint
      (userSession?.user?.role as number) === Role.USER
    ) {
      return response.status(405).send("Method not allowed");
    }


    //if current user is not Admin National => forced institutionId_fiter to be institutionId of current user
    const institutionIdSession = (userSession?.user?.role as number) === Role.ADMIN_NAT ? 0 : userSession?.user.institutionId;

    const key = request.query["key"] as string | "";
    const orderBy = request.query["orderBy"] as string | "";
    const sortDir = request.query["sortDir"] as string | "";
    const page = request.query["page"] as unknown as number | 1;

    const institutionId = institutionIdSession || (request.query["institutionId"] as unknown as number | 0);
    const roleId = request.query["roleId"] as unknown as number | 0;
    const profilId = request.query["profileId"] as string | "";
    const etatId = request.query["etatId"] as string | "";
    const itemsPerPage = request.query["itemsPerPage"] as unknown as number;

    const users = await getUsersListPaginatedEndpoint(dependencies, key, page, institutionId, roleId, profilId, etatId, itemsPerPage, orderBy, sortDir);

    return response.status(200).json(users);
  } catch {
    return response.status(500);
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (await checkAdminRole(req, res)) {
    await handler(req, res);
  }
};
