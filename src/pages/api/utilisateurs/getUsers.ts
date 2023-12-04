import { NextApiRequest, NextApiResponse } from "next";
//import { getServerSession } from "next-auth";

import { getUsersListPaginatedEndpoint } from "../../../backend/infrastructure/controllers/getUsersListPaginatedEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
//import authOptions from "../auth/[...nextauth]";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    if (request.method !== "GET") {
      response.status(405).send("Method not allowed");
    }

    // const session = await getServerSession(request, response, authOptions);

    // console.log("----session---", session);

    /*  switch (session?.user?.role as unknown as number) {
      case 1:
        userSessionRole = "Admin National";
        break;
      case 2:
        userSessionRole = "Admin Regional";
        break;
      case 3:
        userSessionRole = "Utilisateur";
        break;
      default:
        userSessionRole = "Utilisateur";
    }
*/

    const key = request.query["key"] as string | "";
    const sort = request.query["sort"] as string | "";
    const page = request.query["page"] as unknown as number | 1;

    const institutionId = request.query["institutionId"] as unknown as number | 0;
    const roleId = request.query["roleId"] as unknown as number | 0;
    const profilId = request.query["profileId"] as string | "";
    const itemsPerPage = request.query["itemsPerPage"] as unknown as number;

    const users = await getUsersListPaginatedEndpoint(dependencies, key, sort, page, institutionId, roleId, profilId, itemsPerPage);

    return response.status(200).json(users);
  } catch (error) {
    return response.status(500);
  }
}
