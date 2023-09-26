import { NextApiRequest, NextApiResponse } from "next";

import { getAllProfilesEndpoint } from "../../../backend/infrastructure/controllers/getAllProfilesEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        if (request.method !== "GET") {
            response.status(405).send("Method not allowed");
        }

        const recherche = await getAllProfilesEndpoint(dependencies);
        return response.status(200).json(recherche);

    } catch (error) {
        return response.status(500);
    }

}
