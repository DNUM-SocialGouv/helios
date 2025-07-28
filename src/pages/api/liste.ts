import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "./auth/[...nextauth]";
import { countLists, create, getAll } from "../../backend/infrastructure/controllers/userListEndpoint";

//Nombre max de list = 10 + favoris
const MAX_LIST = 11;

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  try {
    const userSession = await getServerSession(request, response, authOptions);
    const idUser = userSession?.user?.idUser;

    if (idUser) {
      if (request.method === "POST") {
        return doCreate(request, response, idUser);
      } else if (request.method === "GET") {
        return doGetAll(response, idUser);
      } else {
        return response.status(405).send("Method not allowed");
      }
    } else {
      return response.status(500)
    }
  } catch (error) { // NOSONAR l’erreur est gérée dans le catch via le « return ». Aucune autre action à faire ici
    return response.status(500);
  }
};

async function doCreate(request: NextApiRequest, response: NextApiResponse, idUser: string) {
  const { listName, isFavoris } = request.body;
  const listCount = await countLists(idUser);
  if (listCount >= MAX_LIST) {
    return response.status(403).send("Forbidden");
  }
  const newList = await create(idUser, listName, isFavoris);
  return response.status(201).json(newList);
}

async function doGetAll(response: NextApiResponse, idUser: string) {
  const allList = await getAll(idUser);
  return response.status(200).json(allList);
}
