import { NextApiRequest, NextApiResponse } from "next";

import { removeFromFavorisEndpoint } from "../../../backend/infrastructure/controllers/removeFromFavorisEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method !== "POST") {
        response.status(405).send("Method not allowed");
    }

    const { idUser, finessNumber } = request.body;
    const recherche = await removeFromFavorisEndpoint(dependencies, idUser, finessNumber);
    response.status(200).json(recherche);
}
