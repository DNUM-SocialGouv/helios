import { NextApiRequest, NextApiResponse } from "next";

import { changePasswordEndpoint } from "../../backend/infrastructure/controllers/changePasswordEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.status(405).send("Method not allowed");
  }

  const { loginToken, password } = request.body;

  const result = await changePasswordEndpoint(dependencies,loginToken, password);
  response.status(200).json(result);
 
}
