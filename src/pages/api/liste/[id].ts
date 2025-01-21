import { NextApiRequest, NextApiResponse } from "next";

import { deleteList, getById, updateName } from "../../../backend/infrastructure/controllers/userListEndpoint";
import { getUserSessionBack } from "../../../frontend/utils/getUserSessionBack";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        const userSession = await getUserSessionBack(request);
        const idUser = userSession.user?.idUser;

        if (request.method === "POST") {
            return doUpdate(request, response, idUser);
        } else if (request.method === "GET") {
            return doGetById(request, response, idUser);
        } else if (request.method === "DELETE") {
            return doDelete(request, response, idUser);
        } else {
            return response.status(405).send("Method not allowed");
        }
    } catch (error) {
        return response.status(500);
    }
};

async function doUpdate(request: NextApiRequest, response: NextApiResponse, idUser: string) {
    const { id } = request.query;
    const { listName } = request.body;
    const list = await updateName(idUser, Number(id), listName);
    return response.status(200).json(list);
}

async function doGetById(request: NextApiRequest, response: NextApiResponse, idUser: string) {
    const { id } = request.query;
    const list = await getById(idUser, Number(id));
    return response.status(200).json(list);
}

async function doDelete(request: NextApiRequest, response: NextApiResponse, idUser: string) {
    const { id } = request.query;
    await deleteList(idUser, Number(id));
    return response.status(204).send("No Content");
}