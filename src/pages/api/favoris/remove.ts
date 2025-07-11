import { NextApiRequest, NextApiResponse } from "next";

import { removeFromFavorisEndpoint } from "../../../backend/infrastructure/controllers/removeFromFavorisEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    if (request.method !== "POST") {
      return response.status(405).send("Method not allowed");
    }

    const { idUser, finessNumber } = request.body;
    const recherche = await removeFromFavorisEndpoint(dependencies, idUser, finessNumber);
    return response.status(200).json(recherche);
  } catch (error) { // NOSONAR l’erreur est gérée dans le catch via le « return ». Aucune autre action à faire ici
    return response.status(500);
  }

}
