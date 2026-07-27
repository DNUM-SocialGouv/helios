import { NextApiRequest, NextApiResponse } from "next";

import { checkIfEmailExistsEndpoint } from '../../../backend/infrastructure/controllers/checkIfEmailExistsEndpoint';
import { createAccountEndpoint } from "../../../backend/infrastructure/controllers/createAccountEndpoint";
import { dependencies } from "../../../backend/infrastructure/dependencies";
import { requireCsrf } from "../../../lib/require-csrf";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    return response.status(405).send("Method not allowed");
  }

  if (!requireCsrf(request, response)) {
    return;
  }

  try {
    const { firstName, lastName, email, institution } = request.body;

    if (institution === "ADMIN_CENTR") {
      const domaine = email.slice(email.indexOf('@') + 1);
      if (domaine !== 'sg.social.gouv.fr' && domaine !== 'sante.gouv.fr' && domaine !== 'social.gouv.fr')
        return response.status(400).send({ err: "Can't use this email for this institution" })
    }

    const usedEmail = await checkIfEmailExistsEndpoint(dependencies, email);
    if (usedEmail) {
      // Si l’email existe déjà, on considère que l’utilisateur a déjà un compte et on ne crée pas de nouveau compte, mais on retourne quand même un message de succès pour éviter de révéler l’existence d’un compte à partir de l’email.
      return response.status(200).send({ message: 'user created' });
    }

    await createAccountEndpoint(dependencies, firstName, lastName, email, institution);

    return response.status(200).send({ message: 'user created' });
  } catch {
    return response.status(500);
  }
}
