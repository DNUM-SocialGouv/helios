import { NextApiRequest, NextApiResponse } from "next";

import { getInstitutionsEndpoint } from "../../../backend/infrastructure/controllers/getInstitutionsEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        if (request.method !== "GET") {
            response.status(405).send("Method not allowed");
        }
        const recherche = await getInstitutionsEndpoint(dependencies);
        return response.status(200).json(recherche);
    } catch (err) {
        return response.status(500);
    }

}
