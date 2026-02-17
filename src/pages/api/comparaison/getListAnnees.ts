import { NextApiRequest, NextApiResponse } from "next";

import { getAnneesComparaisonEndpoint } from "../../../backend/infrastructure/controllers/getAnneesComparaisonEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const { numeroFiness, type } = request.body;

    if (request.method !== "POST") {
      return response.status(405).send("Method not allowed");
    }

    if (numeroFiness.length > 30000) {
      return response.status(405).send("Authorized limit exceeded");
    }
    const recherche = await getAnneesComparaisonEndpoint(dependencies, type, numeroFiness);
    return response.status(200).json(recherche);
  } catch {
    return response.status(500);
  }
}
