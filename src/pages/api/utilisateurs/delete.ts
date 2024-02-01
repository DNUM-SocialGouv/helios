/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";

import { deleteUserEndpoint } from "../../../backend/infrastructure/controllers/deleteUserEndpoint";
import { getUserByCodeEndpoint } from "../../../backend/infrastructure/controllers/getUserByCodeEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { checkAdminRole } from "../../../checkAdminMiddleware";
import { getUserSessionBack } from "../../../frontend/utils/getUserSessionBack";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    if (request.method !== "DELETE") {
      response.status(405).send("Method not allowed");
    }
    const { userCode } = request.body;

    const userBeforeChange = await getUserByCodeEndpoint(dependencies, userCode);

    const userSession = await getUserSessionBack(request);

    //no one can delete itself
    if (userSession?.user.idUser === userCode) {
      return response.status(405).send("Method not allowed");
    }
    if (!userBeforeChange) {
      response.status(405).send("User not found");
    } else {

      //only "Admin national" can update itself || Admin regional cant update, delete, reactivate to (Admin National And/or Admin Regional)
      if (
        (userSession?.user?.idUser === userCode && userSession?.user?.role !== 1) ||
        ((userSession?.user?.role as number) >= parseInt(userBeforeChange.roleId) && userSession?.user?.idUser !== userCode)
      ) {
        return response.status(405).send("Method not allowed");
      }

      const recherche = await deleteUserEndpoint(dependencies, userCode);
      return response.status(200).json(recherche);
    }
  } catch (error) {
    return response.status(500);
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (await checkAdminRole(req, res)) {
    await handler(req, res);
  }
};
