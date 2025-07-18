import { NextApiRequest, NextApiResponse } from "next";

import { addToFavorisEndpoint } from "../../../backend/infrastructure/controllers/addToFavorisEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    if (request.method !== "POST") {
      response.status(405).send("Method not allowed");
    }

    const { finessNumber, type, idUser, commune, departement, socialReason } = request.body;
    const recherche = await addToFavorisEndpoint(dependencies, finessNumber, type, idUser, commune, departement, socialReason);
    return response.status(200).json(recherche);
  } catch (error) { // NOSONAR l’erreur est gérée dans le catch via le « return ». Aucune autre action à faire ici
    return response.status(500).send("Error: Error in add favoris");
  }

}
