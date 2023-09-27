import { NextApiRequest, NextApiResponse } from "next";

import { updateProfileEndpoint } from "../../../backend/infrastructure/controllers/updateProfileEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        if (request.method !== "POST") {
            response.status(405).send("Method not allowed");
        }
        const { code, value } = request.body;
        const recherche = await updateProfileEndpoint(dependencies, code, value);
        return response.status(200).json(recherche);

    } catch (error) {
        return response.status(500);
    }

}
