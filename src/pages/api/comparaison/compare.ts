import { NextApiRequest, NextApiResponse } from "next";

import { comparaisonEndpoint } from "../../../backend/infrastructure/controllers/comparaisonEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.status(405).send("Method not allowed");
  }

  const { type, numerosFiness, annee, page, order, orderBy, forExport } = request.body;

  if (type !== "Médico-social" && type !== "Sanitaire" && type !== "Entité juridique") {
    response.status(400).send("invalid type");
  }

  if (numerosFiness.length === 0) {
    return response.status(200).json({
      nombreDeResultats: 0,
      resultat: [],
    }); ''
  }

  // TODO check if all numeros finess belong to the type
  const comparaisonResult = await comparaisonEndpoint(dependencies, type, numerosFiness, annee, page, order, orderBy, forExport);

  response.status(200).json(comparaisonResult);
}
