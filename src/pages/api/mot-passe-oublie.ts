import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from "next";

import { checkIfEmailExistsEndpoint } from '../../backend/infrastructure/controllers/checkIfEmailExistsEndpoint';
import { forgetPasswordEndPoint } from "../../backend/infrastructure/controllers/forgetPasswordEndPoint";
import { dependencies } from "../../backend/infrastructure/dependencies";

const validateInputs = (email: string) => {
  const valid = Joi.string().required().email({ tlds: { allow: false } }).validate(email);
  if (valid.error) {
    return false
  } else {
    return true
  }
}



export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== "POST") {
    response.status(405).send("Method not allowed");
  }
  const { emailValue } = request.body;

  if (!validateInputs(emailValue)) {
    return response.status(400).send({ err: 'Invalid parameter value has been detected' })
  }

  const validEmail = await checkIfEmailExistsEndpoint(dependencies, emailValue);
  if (!validEmail) {
    return response.status(400).send({ err: 'Email does not exists' })
  }

  try {
    const info = await forgetPasswordEndPoint(dependencies, emailValue);
    if (info) {
      return response.status(200).json({ info })
    }
    return response.status(400).json({ err: 'Email not sent' })
  } catch (error) { // NOSONAR l’erreur est gérée dans le catch via le « return ». Aucune autre action à faire ici
    return response.status(500)
  }

}
