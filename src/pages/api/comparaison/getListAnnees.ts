import { NextApiRequest, NextApiResponse } from "next";

import { getAnneesComparaisonEndpoint } from "../../../backend/infrastructure/controllers/getAnneesComparaisonEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const type = request.query["type"] as string;
    let numeroFiness = request.query["numeroFiness"] as string[] || [];

    // Dans le cas d’une comparaison lancée depuis une page etablissement il n’y a qu’un finess et on ne reçoit donc pas d’Array. On crée donc un array.
    if (!Array.isArray(numeroFiness)) {
      numeroFiness = [numeroFiness];
    }

    if (request.method !== "GET") {
      return response.status(405).send("Method not allowed");
    }
    const recherche = await getAnneesComparaisonEndpoint(dependencies, type, numeroFiness);
    return response.status(200).json(recherche);
  } catch (error) { // NOSONAR l’erreur est gérée dans le catch via le « return ». Aucune autre action à faire ici
    return response.status(500);
  }
}
