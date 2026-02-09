import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from "next";

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

  try {
    await forgetPasswordEndPoint(dependencies, emailValue);
    return response.status(200).json({})
  } catch {
    return response.status(500)
  }
}
