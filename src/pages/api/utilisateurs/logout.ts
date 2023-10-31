import { NextApiRequest, NextApiResponse } from "next";

import { logoutEndpoint } from "../../../backend/infrastructure/controllers/logoutEndpoint";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method !== "POST") {
        response.status(405).send("Method not allowed");
    }
    try {
        const resp = await logoutEndpoint();
        return response.status(200).json(resp);
    } catch (error) {
        return response.status(500);
    }
}
