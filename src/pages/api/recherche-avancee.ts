import { NextApiRequest, NextApiResponse } from "next";

import { rechercheAvanceeParmiLesEntitésEtÉtablissementsEndpoint } from "../../backend/infrastructure/controllers/rechercheAvanceeEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method !== "POST") {
        response.status(405).send("Method not allowed");
    }

    const { terme, commune, page } = request.body;
    const recherche = await rechercheAvanceeParmiLesEntitésEtÉtablissementsEndpoint(dependencies, terme, commune, page);
    response.status(200).json(recherche);
}