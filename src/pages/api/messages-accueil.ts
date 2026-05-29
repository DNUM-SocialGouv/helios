import { NextApiRequest, NextApiResponse } from "next";

import { dependencies } from "../../backend/infrastructure/dependencies";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const messages = await dependencies.messageAccueilLoader.getAllMessages();
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la récupération des messages." + (error instanceof Error ? ` Détails : ${error.message}` : "") });
  }
}
