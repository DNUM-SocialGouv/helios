import { NextApiRequest, NextApiResponse } from "next";

import { saveSearchHistoryEndpoint } from "../../../backend/infrastructure/controllers/saveSearchHistoryEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method !== "POST") {
        return response.status(405).send("Method not allowed");
    }

    const { title, idUser, finessNumber } = request.body;
    // eslint-disable-next-line no-console
    console.log('from pages api', idUser);
    const recherche = await saveSearchHistoryEndpoint(dependencies, title, idUser, finessNumber);

    return response.status(200).json(recherche);
}