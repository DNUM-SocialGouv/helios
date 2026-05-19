import { NextApiRequest, NextApiResponse } from "next";

import { checkToken } from "../../backend/jwtHelper";
import { requireCsrf } from "../../lib/require-csrf";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    return response.status(405).send("Method not allowed");
  }

  if (!requireCsrf(request, response)) {
    return;
  }
    
  const { token } = request.body;

  try {
    const info = checkToken(token);
    if (info?.email) {
      return response.status(200).json({ info })
    }
    return response.status(400).json({ info })
  } catch {
    return response.status(500)
  }

}
