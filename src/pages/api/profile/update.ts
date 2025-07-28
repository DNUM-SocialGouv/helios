/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";

import { updateProfileEndpoint } from "../../../backend/infrastructure/controllers/updateProfileEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { checkNationalAdminRole } from "../../../checkNationalAdminMiddleware";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    if (request.method !== "POST") {
      response.status(405).send("Method not allowed");
    }
    const { code, value, name } = request.body;
    const recherche = await updateProfileEndpoint(dependencies, code, value, name);
    return response.status(200).json(recherche);
  } catch (error) { // NOSONAR l’erreur est gérée dans le catch via le « return ». Aucune autre action à faire ici
    return response.status(500);
  }

}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (await checkNationalAdminRole(req, res)) {
    await handler(req, res);
  }
};
