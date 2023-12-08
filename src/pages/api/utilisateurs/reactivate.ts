/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";

import { reactivateUserEndpoint } from "../../../backend/infrastructure/controllers/reactivateUserEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { checkAdminRole } from "../../../checkAdminMiddleware";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    if (request.method !== "POST") {
      response.status(405).send("Method not allowed");
    }
    const { userCode } = request.body;
    const recherche = await reactivateUserEndpoint(dependencies, userCode);
    return response.status(200).json(recherche);
  } catch (error) {
    return response.status(500);
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  //if (await checkAdminRole(req, res)) {
  await handler(req, res);
  // }
};
