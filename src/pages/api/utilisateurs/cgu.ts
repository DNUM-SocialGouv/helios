import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { updateCguEndpoint } from "../../../backend/infrastructure/controllers/updateCguEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    return response.status(405).send("Method not allowed");
  }

  const session = await getServerSession(request, response, authOptions);
  const userCode = session?.user?.idUser;

  if (!userCode) {
    return response.status(401).send("Unauthorized");
  }

  const { accepted } = request.body as { accepted?: boolean };
  if (typeof accepted !== "boolean") {
    return response.status(400).send("Bad request");
  }

  await updateCguEndpoint(dependencies, userCode, accepted);
  return response.status(200).json({});
}
