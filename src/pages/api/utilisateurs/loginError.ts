import { NextApiRequest, NextApiResponse } from "next";

import { loginErrorEndpoint } from "../../../backend/infrastructure/controllers/loginErrorEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    return response.status(405).send("Method not allowed");
  }
  try {
    const { email } = request.body;
    const resp = await loginErrorEndpoint(dependencies, email);

    if (resp === 'blocked account')
      return response.status(401).json({ message: resp });
    else
      return response.status(423).json({ message: resp });

  } catch {
    return response.status(500);
  }
}
