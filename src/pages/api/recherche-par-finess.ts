import { NextApiRequest, NextApiResponse } from "next";

import { rechercheParNumeroFinessEndpoint } from "../../backend/infrastructure/controllers/rechercheParNumeroFinessEndpoints";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method !== "POST") {
        response.status(405).send("Method not allowed");
    }


    const { finessNumber } = request.body;
    const etablissementList = await rechercheParNumeroFinessEndpoint(finessNumber);
    response.status(200).json(etablissementList);
}