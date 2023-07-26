import Joi from 'joi';
import { NextApiRequest, NextApiResponse } from "next";

import { updatePasswordEndpoint } from "../../backend/infrastructure/controllers/updatePasswordEndpoint";
import { dependencies } from "../../backend/infrastructure/dependencies";

const validateInputs = (email: string, password: string, oldPassword: string) => {
    const validEmail = Joi.string().required().email({ tlds: { allow: false } }).validate(email);
    const validPassword = Joi.string().required().pattern(new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()\\-_=+{};:,<.>]).{12,}$"
    )).validate(password);
    const validOldPassword = Joi.string().required().pattern(new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()\\-_=+{};:,<.>]).{12,}$"
    )).validate(oldPassword);

    if (validPassword.error || validEmail.error || validOldPassword.error) {
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

        const { email, password, oldPassword } = request.body;

        if (!validateInputs(email, password, oldPassword)) {
            return response.status(400).send({ 'err': 'invalid parameter value has been detected' })
        }

        const result = await updatePasswordEndpoint(dependencies, email, password, oldPassword);
        if (result === 'user updated') {
            return response.status(200).json(result);
        } else {
            if (result === 'same password') {
                return response.status(400).send({ 'err': 'The password must be different from the current password' })
            }
            return response.status(400).json({ 'err': 'error occured while changing password' })
        }
    } catch (error) {
        return response.status(500)
    }
}
