import { NextApiRequest, NextApiResponse } from "next";

import { rechercheParmiLesEntitésEtÉtablissementsEndpoint } from "../../backend/infrastructure/controllers/rechercheEndpoints";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { requireCsrf } from "../../lib/require-csrf";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    return response.status(405).send("Method not allowed");
  }

  if (!requireCsrf(request, response)) {
    return;
  }

  const { terme, page, order, orderBy, displayTable } = request.body;
  const recherche = await rechercheParmiLesEntitésEtÉtablissementsEndpoint(dependencies, terme, page, orderBy, order, displayTable);
  response.status(200).json(recherche);
}
