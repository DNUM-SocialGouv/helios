import { NextApiRequest, NextApiResponse } from "next";

import { saveSearchHistoryEndpoint } from "../../../backend/infrastructure/controllers/saveSearchHistoryEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        if (request.method !== "POST") {
            return response.status(405).send("Method not allowed");
        }

        const { title, idUser, finessNumber, type } = request.body;
        const recherche = await saveSearchHistoryEndpoint(dependencies, title, idUser, finessNumber, type);

        return response.status(200).json(recherche);
    } catch (error) {
        return response.status(500);
    }

}