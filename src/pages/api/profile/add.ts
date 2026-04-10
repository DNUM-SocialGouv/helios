/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { addProfileEndpoint } from "../../../backend/infrastructure/controllers/addProfileEndpoint";
import { getAllProfilesEndpoint } from "../../../backend/infrastructure/controllers/getAllProfilesEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { checkNationalAdminRole } from "../../../checkNationalAdminMiddleware";
import { authOptions } from "../auth/[...nextauth]";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
  try {
    if (request.method !== "POST") {
      return response.status(405).send("Method not allowed");
    }
    const { label, value, userId } = request.body;
    if (!label || label.trim() === "") {
      return response.status(400).send("Bad request: label is required");
    }

    const profilesLabels = (await getAllProfilesEndpoint(dependencies)).map((profile) => profile.label.toLowerCase());
    if (profilesLabels.includes(label.toLowerCase())) {
      return response.status(400).send("Bad request: label already exists");
    }
    const recherche = await addProfileEndpoint(dependencies, label, value, userId);
    const session = await getServerSession(request, response, authOptions);
    dependencies.logger.audit(`${session?.user?.email}: Création d'un nouveau profil "${label}"`);
    return response.status(200).json(recherche);
  } catch {
    return response.status(500);
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (await checkNationalAdminRole(req, res)) {
    await handler(req, res);
  }
};
