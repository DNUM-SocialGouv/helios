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
    return response.status(400).send({ 'err': 'invalid parameter value has been detected' })
  }

  try {
    const info = await forgetPasswordEndPoint(dependencies, emailValue);
    if (info) {
      return response.status(200).json({ info })
    }
    return response.status(400).json({ info })
  } catch (error) {
    return response.status(500)
  }

}
