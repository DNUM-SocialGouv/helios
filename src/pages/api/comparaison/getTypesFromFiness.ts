import { NextApiRequest, NextApiResponse } from "next";

import { getTypesFromFinessEndpoint } from "../../../backend/infrastructure/controllers/getTypesFromFinessEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        let numeroFiness = request.query["numeroFiness"] as string[] || [];
        if (!Array.isArray(numeroFiness)) {
            numeroFiness = [numeroFiness];
        }
        if (request.method !== "GET") {
            return response.status(405).send("Method not allowed");
        }
        const recherche = await getTypesFromFinessEndpoint(dependencies, numeroFiness);
        return response.status(200).json(recherche);
    } catch (error) { // NOSONAR l’erreur est gérée dans le catch via le « return ». Aucune autre action à faire ici
        return response.status(500);
    }
}
