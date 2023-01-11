import { NextApiRequest, NextApiResponse } from "next";

import { rechercheParmiLesEntitésEtÉtablissementsEndpoint } from "../../backend/infrastructure/controllers/rechercheEndpoints";
import { dependencies } from "../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.status(405).send("Method not allowed");
  }

  const { terme, page } = request.body;
  const recherche = await rechercheParmiLesEntitésEtÉtablissementsEndpoint(dependencies, terme, page);
  response.status(200).json(recherche);
}
