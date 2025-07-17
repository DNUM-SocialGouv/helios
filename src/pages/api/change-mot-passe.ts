import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from "next";

import { changePasswordEndpoint } from "../../backend/infrastructure/controllers/changePasswordEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";

const validateInputs = (loginToken: string, password: string) => {
  const validToken = Joi.string().required().validate(loginToken);
  const validPassword = Joi.string().required().pattern(new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()\\-_=+{};:,<.>]).{12,}$"
  )).validate(password);

  if (validPassword.error || validToken.error) {
    return false
  } else {
    return true
  }
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    if (request.method !== "POST") {
      return response.status(405).send("Method not allowed");
    }

    const { loginToken, password } = request.body;

    if (!validateInputs(loginToken, password)) {
      return response.status(400).send({ 'err': 'invalid parameter value has been detected' })
    }

    const result = await changePasswordEndpoint(dependencies, loginToken, password);
    if (result === 'user updated') {
      return response.status(200).json(result);
    } else {
      if (result === 'same password') {
        return response.status(400).send({ 'err': 'The password must be different from the current password' })
      }
      return response.status(400).json({ 'err': 'error occured while changing password' })
    }
  } catch (error) { // NOSONAR l’erreur est gérée dans le catch via le « return ». Aucune autre action à faire ici
    return response.status(500)
  }
}
