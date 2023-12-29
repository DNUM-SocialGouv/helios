/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";

import { getAllProfilesEndpoint } from "../../../backend/infrastructure/controllers/getAllProfilesEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { checkNationalAdminRole } from "../../../checkNationalAdminMiddleware";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
    try {
        if (request.method !== "GET") {
            response.status(405).send("Method not allowed");
        }

        const recherche = await getAllProfilesEndpoint(dependencies);
        return response.status(200).json({ response: recherche });

    } catch (error) {
        return response.status(500);
    }

}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (await checkNationalAdminRole(req, res)) {
        await handler(req, res);
    }
};


