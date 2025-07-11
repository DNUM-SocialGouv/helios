import { NextApiRequest, NextApiResponse } from "next";

import { loginEndpoint } from "../../../backend/infrastructure/controllers/loginEndpoints";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    return response.status(405).send("Method not allowed");
  }
  try {
    const { email, password } = request.body;
    const resp = await loginEndpoint(dependencies, email, password);
    if (resp) {
      delete resp.utilisateur?.password;
      return response.status(200).json(resp);
    } else {
      return response.status(400).json(resp);
    }
  } catch (error) { // NOSONAR l’erreur est gérée dans le catch via le « return ». Aucune autre action à faire ici
    return response.status(500);
  }
}
