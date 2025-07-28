import { NextApiRequest, NextApiResponse } from "next";

import { checkUserIsNotAdminAndInactifEndpoint } from "../../../backend/infrastructure/controllers/checkUserIsNotAdminAndInactifEndpoints";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    return response.status(405).send("Method not allowed");
  }
  try {
    const { email } = request.body;
    const resp = await checkUserIsNotAdminAndInactifEndpoint(dependencies, email);

    if (resp) {
      return response.status(200).json({ status: true });
    } else {
      return response.status(401).json({ status: false });
    }
  } catch (error) { // NOSONAR l’erreur est gérée dans le catch via le « return ». Aucune autre action à faire ici
    return response.status(500);
  }
}
