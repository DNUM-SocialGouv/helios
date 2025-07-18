import { NextApiRequest, NextApiResponse } from "next";

import { comparaisonEndpoint } from "../../../backend/infrastructure/controllers/comparaisonEndpoint";
import { getAnneesComparaisonEndpoint } from "../../../backend/infrastructure/controllers/getAnneesComparaisonEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { ParametresDeComparaison } from "../../../backend/métier/entities/ParametresDeComparaison";

const emptyResponse = {
  nombreDeResultats: 0,
  resultat: [],
  listAnnees: []
};

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.status(405).send("Method not allowed");
  }

  const { type, numerosFiness, annee, page, order, orderBy, forExport, codeRegion, codeProfiles, enveloppe1, enveloppe2, enveloppe3 } = request.body;

  if (type !== "Médico-social" && type !== "Sanitaire" && type !== "Entité juridique") {
    response.status(400).send("invalid type");
  }

  if (!numerosFiness || numerosFiness.length === 0) {
    return response.status(200).json(emptyResponse);
  }

  const listeAnnees = await getAnneesComparaisonEndpoint(dependencies, type, numerosFiness);
  if (!listeAnnees || listeAnnees.length === 0) {
    return response.status(200).json(emptyResponse);
  }

  let anneeARechercher = annee;
  if (!annee || !listeAnnees.some(dbAnnee => dbAnnee + "" === annee)) {
    anneeARechercher = listeAnnees[listeAnnees.length - 1];
  }
  const params = { type, numerosFiness, annee: anneeARechercher, page, order, orderBy, forExport, codeRegion, enveloppe1, enveloppe2, enveloppe3 } as ParametresDeComparaison;
  const comparaisonResult = await comparaisonEndpoint(dependencies, params, codeProfiles);

  response.status(200).json({ listeAnnees, ...comparaisonResult });
}
