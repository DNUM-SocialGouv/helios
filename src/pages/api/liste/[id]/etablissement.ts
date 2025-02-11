import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { create, deleteEtablissementFromList, getByListIdOrderedAndPaginated } from "../../../../backend/infrastructure/controllers/userListEtablissementEndpoint";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    try {
        const userSession = await getServerSession(request, response, authOptions);
        const idUser = userSession?.user.idUser;
        if (idUser) {
            if (request.method === "GET") {
                return doGetOrderedAndPaginated(request, response, idUser);
            } else if (request.method === "POST") {
                return doCreate(request, response, idUser);
            } else if (request.method === "DELETE") {
                return doDelete(request, response, idUser);
            } else {
                return response.status(405).send("Method not allowed");
            }
        } else {
            return response.status(500);
        }

    } catch (error) {
        return response.status(500);
    }
};

async function doGetOrderedAndPaginated(request: NextApiRequest, response: NextApiResponse, idUser: string) {
    const { id, order, orderBy, page, limit } = request.query;
    if (id && order && orderBy && page && limit) {
        const list = await getByListIdOrderedAndPaginated(idUser, Number(id), String(order), String(orderBy), Number(page), Number(limit));
        return response.status(200).json(list);
    } else {
        return response.status(400);
    }
}

async function doCreate(request: NextApiRequest, response: NextApiResponse, idUser: string) {
    const { id } = request.query;
    const { finessNumber, typeEtablissement } = request.body;
    await create(idUser, Number(id), finessNumber, typeEtablissement);
    return response.status(200).send(null);
}

async function doDelete(request: NextApiRequest, response: NextApiResponse, idUser: string) {
    const { id } = request.query;
    const { finessNumbers } = request.body;
    await deleteEtablissementFromList(idUser, Number(id), finessNumbers);
    return response.status(204).send(null);
}