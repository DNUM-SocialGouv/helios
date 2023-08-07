import { NextApiRequest, NextApiResponse } from "next";

import { getAllFavorisEndpoint } from "../../../backend/infrastructure/controllers/getAllFavorisEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method !== "GET") {
        response.status(405).send("Method not allowed");
    }

    const idUser = request.query["idUser"];

    if (idUser && typeof idUser === 'string') {
        const recherche = await getAllFavorisEndpoint(dependencies, idUser);
        return response.status(200).json(recherche);
    } else {
        return response.status(401).json('Invalid idUser');
    }
}