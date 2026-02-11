/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { getUserByCodeEndpoint } from "../../../backend/infrastructure/controllers/getUserByCodeEndpoint";
import { reactivateUserEndpoint } from "../../../backend/infrastructure/controllers/reactivateUserEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { checkAdminRole } from "../../../checkAdminMiddleware";
import { Role } from "../../../commons/Role";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    if (request.method !== "POST") {
      response.status(405).send("Method not allowed");
    }
    const { userCode } = request.body;

    const userBeforeChange = await getUserByCodeEndpoint(dependencies, userCode);

    const userSession = await getServerSession(request, response, authOptions);

    // Aucun utilisateur ne peut se réactiver lui même
    if (userSession?.user.idUser === userCode) {
      return response.status(405).send("Method not allowed");
    }

    if (!userBeforeChange) {
      response.status(405).send("User not found");
    } else {
      if (
        // Un admin central n’a aucun droit sur ce endpoint
        (userSession?.user?.role as number) === Role.ADMIN_CENTR ||
        // Un utilisateur n’a aucun droit sur ce endpoint
        (userSession?.user?.role as number) === Role.USER ||
        // Un admin regional ne peut pas réactiver un admin national ou un admin central
        ((userSession?.user?.role as number) === Role.ADMIN_REG && (Number.parseInt(userBeforeChange.roleId) === Role.ADMIN_NAT || Number.parseInt(userBeforeChange.roleId) === Role.ADMIN_CENTR))
      ) {
        return response.status(405).send("Method not allowed");
      }

      const recherche = await reactivateUserEndpoint(dependencies, userCode);
      return response.status(200).json(recherche);
    }
  } catch {
    return response.status(500);
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (await checkAdminRole(req, res)) {
    await handler(req, res);
  }
};
