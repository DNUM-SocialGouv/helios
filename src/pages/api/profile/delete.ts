/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";

import { deleteProfileEndpoint } from "../../../backend/infrastructure/controllers/deleteProfileEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { checkNationalAdminRole } from "../../../checkNationalAdminMiddleware";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {
    try {
        if (request.method !== "DELETE") {
            response.status(405).send("Method not allowed");
        }
        const { profileId } = request.body;

        //we can't delete default profile
        if (profileId === 1) {
            return response.status(405).send("Method not allowed");
        }

        const EndpointResponse = await deleteProfileEndpoint(dependencies, profileId);
        if (EndpointResponse === 'profile deleted successefully')
            return response.status(200).json(EndpointResponse);
        else return response.status(500).json(EndpointResponse);
    } catch (error) {
        return response.status(500);
    }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (await checkNationalAdminRole(req, res)) {
        await handler(req, res);
    }
};
