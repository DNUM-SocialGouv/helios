import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { getAllIdAndName } from "../../../backend/infrastructure/controllers/userListEndpoint";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    const userSession = await getServerSession(request, response, authOptions);
    const idUser = userSession?.user?.idUser;
    try {
        if (idUser) {
            if (request.method === "GET") {
                return doGetIdAndName(request, response);
            } else {
                return response.status(405).send("Method not allowed");
            }
        } else {
            return response.status(500)
        }
    } catch (error) {
        return response.status(500);
    }
};

async function doGetIdAndName(request: NextApiRequest, response: NextApiResponse) {
    const userSession = await getServerSession(request, response, authOptions);
    const idUser = userSession?.user?.idUser;
    if (idUser) {
        const listsIdAndNames = await getAllIdAndName(idUser);
        return response.status(200).json(listsIdAndNames);
    }
    else {
        return response.status(500);
    }
}