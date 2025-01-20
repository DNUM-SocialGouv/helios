import { NextApiRequest, NextApiResponse } from "next";

import { create, getAll } from "../../backend/infrastructure/controllers/userListEndpoint";
import { getUserSessionBack } from "../../frontend/utils/getUserSessionBack";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        const userSession = await getUserSessionBack(request);
        const idUser = userSession.user?.idUser;

        if (request.method === "POST") {
            return doCreate(request, response, idUser);
        } else if (request.method === "GET") {
            return doGetAll(response, idUser);
        } else {
            return response.status(405).send("Method not allowed");
        }
    } catch (error) {
        return response.status(500);
    }
};

async function doCreate(request: NextApiRequest, response: NextApiResponse, idUser: string) {
    const { listName, isFavoris } = request.body;
    create(idUser, listName, isFavoris);
    return response.status(201).send("Created");
}

async function doGetAll(response: NextApiResponse, idUser: string) {
    const allList = await getAll(idUser);
    return response.status(200).json(allList);
}