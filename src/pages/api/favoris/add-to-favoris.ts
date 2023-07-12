import { NextApiRequest, NextApiResponse } from "next";

import { addToFavorisEndpoint } from "../../../backend/infrastructure/controllers/addToFavorisEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method !== "POST") {
        response.status(405).send("Method not allowed");
    }

    const { finessNumber, type, idUser, } = request.body;
    const recherche = await addToFavorisEndpoint(dependencies, finessNumber, type, idUser);
    response.status(200).json(recherche);
}
