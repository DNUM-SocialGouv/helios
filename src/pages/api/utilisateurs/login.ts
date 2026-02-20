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
    if (typeof resp !== "string") {
      delete resp.utilisateur?.password;
      return response.status(200).json(resp);
    } else {
      if (resp === 'blocked account')
        return response.status(401).json({ message: resp });
      else
        return response.status(423).json({ message: resp });
    }
  } catch {
    return response.status(500);
  }
}
