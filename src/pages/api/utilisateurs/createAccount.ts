import { NextApiRequest, NextApiResponse } from "next";

import { checkIfEmailExistsEndpoint } from '../../../backend/infrastructure/controllers/checkIfEmailExistsEndpoint';
import { createAccountEndpoint } from "../../../backend/infrastructure/controllers/createAccountEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method !== "POST") {
        response.status(405).send("Method not allowed");
    }
    try {
        const { firstName, lastName, email, institution } = request.body;

        if (institution === "ADMIN_CENTR") {
            const domaine = email.slice(email.indexOf('@') + 1);
            if (domaine !== 'sg.social.gouv.fr')
                return response.status(400).send({ err: "Can't use this email for this institution" })
        }

        const usedEmail = await checkIfEmailExistsEndpoint(dependencies, email);
        if (usedEmail) {
            return response.status(400).send({ err: 'Email already used' })
        }

        await createAccountEndpoint(dependencies, firstName, lastName, email, institution);

        return response.status(200).send({ message: 'user created' });
    } catch (error) {
        return response.status(500);
    }
}
