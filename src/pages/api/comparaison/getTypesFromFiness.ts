import { NextApiRequest, NextApiResponse } from "next";

import { getTypesFromFinessEndpoint } from "../../../backend/infrastructure/controllers/getTypesFromFinessEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { requireCsrf } from "../../../lib/require-csrf";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const { numeroFiness } = request.body;

    if (numeroFiness.length > 30000) {
      return response.status(405).send("Authorized limit exceeded");
    }

    if (request.method !== "POST") {
      return response.status(405).send("Method not allowed");
    }
    if (!requireCsrf(request, response)) {
        return;
    }

    const recherche = await getTypesFromFinessEndpoint(dependencies, numeroFiness);
    return response.status(200).json(recherche);
  } catch {
    return response.status(500);
  }
}
