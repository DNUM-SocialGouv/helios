import { NextApiRequest, NextApiResponse } from "next";

import { getAnneesComparaisonEndpoint } from "../../../backend/infrastructure/controllers/getAnneesComparaisonEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        const type = request.query["type"] as string;
        const numeroFiness = request.query["numeroFiness"] as string[] || [];

        if (request.method !== "GET") {
            return response.status(405).send("Method not allowed");
        }
        const recherche = await getAnneesComparaisonEndpoint(dependencies, type, numeroFiness);
        return response.status(200).json(recherche);
    } catch (error) { // NOSONAR l’erreur est gérée dans le catch via le « return ». Aucune autre action à faire ici
        return response.status(500);
    }
}
