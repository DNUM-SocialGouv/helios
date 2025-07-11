/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { getUserByCodeEndpoint } from "../../../backend/infrastructure/controllers/getUserByCodeEndpoint";
import { reactivateUserEndpoint } from "../../../backend/infrastructure/controllers/reactivateUserEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { checkAdminRole } from "../../../checkAdminMiddleware";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    if (request.method !== "POST") {
      response.status(405).send("Method not allowed");
    }
    const { userCode } = request.body;

    const userBeforeChange = await getUserByCodeEndpoint(dependencies, userCode);

    const userSession = await await getServerSession(request, response, authOptions);

    //no one can reactivate itself
    if (userSession?.user.idUser === userCode) {
      return response.status(405).send("Method not allowed");
    }

    if (!userBeforeChange) {
      response.status(405).send("User not found");
    } else {
      //only "Admin national" can update it self || Admin regional cant update, delete (Admin National)
      if (
        (userSession?.user?.idUser === userCode && userSession?.user?.role !== 1) ||
        ((userSession?.user?.role as number) > parseInt(userBeforeChange.roleId) && userSession?.user?.idUser !== userCode)
      ) {
        return response.status(405).send("Method not allowed");
      }

      const recherche = await reactivateUserEndpoint(dependencies, userCode);
      return response.status(200).json(recherche);
    }
  } catch (error) { // NOSONAR l’erreur est gérée dans le catch via le « return ». Aucune autre action à faire ici
    return response.status(500);
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (await checkAdminRole(req, res)) {
    await handler(req, res);
  }
};
