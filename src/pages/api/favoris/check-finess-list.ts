import { NextApiRequest, NextApiResponse } from "next";

import { checkFinessInDatabaseEndpoint } from "../../../backend/infrastructure/controllers/checkFinessInDatabaseEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        if (request.method !== "POST") {
            response.status(405).send("Method not allowed");
        }
        const { finessNumbers } = request.body;
        const listFineesErronnes = await checkFinessInDatabaseEndpoint(dependencies, finessNumbers);
        return response.status(200).json(listFineesErronnes);
    } catch (error) { // NOSONAR l’erreur est gérée dans le catch via le « return ». Aucune autre action à faire ici
        return response.status(500).send("Error: Error in check finess list");
    }
}
