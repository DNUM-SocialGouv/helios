import { NextApiRequest, NextApiResponse } from "next";

import { comparaisonEndpoint } from "../../backend/infrastructure/controllers/comparaisonEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method !== "POST") {
        response.status(405).send("Method not allowed");
    }

    // const { type, numerosFiness, page } = request.body;

    const type = 'Médico-social';
    const numerosFiness = ['010003598', '010007961'];
    const page = 1;

    if (type !== 'Médico-social' && type !== 'Sanitaire' && type !== 'Entité juridique') {
        response.status(400).send("invalid type");
    }

    // TODO check if all numeros finess belong to the type  

    const comparaisonResult = await comparaisonEndpoint(dependencies, type, numerosFiness, page);

    response.status(200).json(comparaisonResult);
}
