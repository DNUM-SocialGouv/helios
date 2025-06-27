import { NextApiRequest, NextApiResponse } from "next";

import { rechercheAvanceeParmiLesEntitésEtÉtablissementsEndpoint } from "../../backend/infrastructure/controllers/rechercheAvanceeEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { ParametreDeRechercheAvancee } from "../../backend/métier/entities/ParametresDeRechercheAvancee";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.status(405).send("Method not allowed");
  }


  const { terme, zone, zoneD, typeZone, type, statutJuridique, categories, capaciteSMS, activiteSAN, orderBy, order, page, forExport = false } = request.body;
  const params = { terme, zone, zoneD, typeZone, type, statutJuridique, categories, capaciteSMS, activiteSAN, orderBy, order, page, forExport } as ParametreDeRechercheAvancee;
  const recherche = await rechercheAvanceeParmiLesEntitésEtÉtablissementsEndpoint(dependencies, params);
  response.status(200).json(recherche);
}
