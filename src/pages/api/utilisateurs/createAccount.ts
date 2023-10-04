import { NextApiRequest, NextApiResponse } from "next";

import { createAccountEndpoint } from "../../../backend/infrastructure/controllers/createAccountEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method !== "POST") {
        response.status(405).send("Method not allowed");
    }
    try {
        const { firstName, lastName, email, institution } = request.body;
        // eslint-disable-next-line no-console
        console.log('make it to api');
        const resp = await createAccountEndpoint(dependencies, firstName, lastName, email, institution);
        return response.status(200).json(resp);
    } catch (error) {
        return response.status(500);
    }
}
