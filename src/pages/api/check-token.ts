import { NextApiRequest, NextApiResponse } from "next";

import { checkToken } from "../../backend/jwtHelper";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.status(405).send("Method not allowed");
  }
  const { token } = request.body;

  try {
    const info = await checkToken(token);
    if (info?.email) {
      return response.status(200).json({ info })
    }
    return response.status(400).json({ info })
  } catch (error) { // NOSONAR l’erreur est gérée dans le catch via le « return ». Aucune autre action à faire ici
    return response.status(500)
  }

}
