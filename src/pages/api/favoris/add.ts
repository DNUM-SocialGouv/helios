import { NextApiRequest, NextApiResponse } from "next";

import { addToFavorisEndpoint } from "../../../backend/infrastructure/controllers/addToFavorisEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        if (request.method !== "POST") {
            return response.status(405).send("Method not allowed");
        }

        const { finessNumber, type, idUser, commune, departement, socialReason } = request.body;
        const recherche = await addToFavorisEndpoint(dependencies, finessNumber, type, idUser, commune, departement, socialReason);
        return response.status(200).json(recherche);
    } catch (error) {
        return response.status(500);
    }

}
