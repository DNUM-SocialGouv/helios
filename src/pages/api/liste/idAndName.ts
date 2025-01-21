import { NextApiRequest, NextApiResponse } from "next";

import { getAllIdAndName } from "../../../backend/infrastructure/controllers/userListEndpoint";
import { getUserSessionBack } from "../../../frontend/utils/getUserSessionBack";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        if (request.method === "GET") {
            return doGetIdAndName(request, response);
        } else {
            return response.status(405).send("Method not allowed");
        }
    } catch (error) {
        return response.status(500);
    }
};

async function doGetIdAndName(request: NextApiRequest, response: NextApiResponse) {
    const userSession = await getUserSessionBack(request);
    const idUser = userSession.user?.idUser;
    const listsIdAndNames = await getAllIdAndName(idUser);
    return response.status(200).json(listsIdAndNames);
}