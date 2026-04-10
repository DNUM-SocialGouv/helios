/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { updateProfileEndpoint } from "../../../backend/infrastructure/controllers/updateProfileEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { checkNationalAdminRole } from "../../../checkNationalAdminMiddleware";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    if (request.method !== "POST") {
      response.status(405).send("Method not allowed");
    }
    const { code, value, name } = request.body;
    const recherche = await updateProfileEndpoint(dependencies, code, value, name);
    const session = await getServerSession(request, response, authOptions);
    dependencies.logger.audit(`${session?.user?.email}: Modification du profil "${name}"`);
    return response.status(200).json(recherche);
  } catch {
    return response.status(500);
  }

}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (await checkNationalAdminRole(req, res)) {
    await handler(req, res);
  }
};
