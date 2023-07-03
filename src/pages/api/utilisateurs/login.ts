import { NextApiRequest, NextApiResponse } from "next";

import { loginEndpoint } from "../../../backend/infrastructure/controllers/loginEndpoints";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method !== "POST") {
        response.status(405).send("Method not allowed");
    }
    try {
        const { email, password } = request.body
        const user = await loginEndpoint(dependencies, email, password)
        if (user) {
            return response.status(200).json(user);
        } else {
            return response.status(400).json(user);
        }
    } catch (error) {
        return response.status(500);
    }
}
