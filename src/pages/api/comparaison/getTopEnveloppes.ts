import { NextApiRequest, NextApiResponse } from "next";

import { getTopEnveloppesEndpoint } from "../../../backend/infrastructure/controllers/getTopEnveloppesEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        if (request.method !== "GET") {
            return response.status(405).send("Method not allowed");
        }
        const recherche = await getTopEnveloppesEndpoint(dependencies);
        return response.status(200).json(recherche);
    } catch (error) { // NOSONAR l’erreur est gérée dans le catch via le « return ». Aucune autre action à faire ici
        return response.status(500);
    }
}
