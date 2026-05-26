import { NextApiRequest, NextApiResponse } from "next";

import { removeFromFavorisEndpoint } from "../../../backend/infrastructure/controllers/removeFromFavorisEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { requireCsrf } from "../../../lib/require-csrf";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    if (request.method !== "POST") {
      return response.status(405).send("Method not allowed");
    }

    if (!requireCsrf(request, response)) {
        return;
    }

    const { idUser, finessNumber } = request.body;
    const recherche = await removeFromFavorisEndpoint(dependencies, idUser, finessNumber);
    return response.status(200).json(recherche);
  } catch {
    return response.status(500);
  }
}
