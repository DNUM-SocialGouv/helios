import { NextApiRequest, NextApiResponse } from "next";

import { dependencies } from "../../backend/infrastructure/dependencies";
import { MessageAccueilUseCase } from "../../backend/métier/use-cases/MessageAccueilUseCase";

const useCase = new MessageAccueilUseCase(dependencies.messageAccueilLoader);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { contenu, dateDebut, dateFin, badgeType, badgeLibelle } = req.body;

    if (!contenu || !dateDebut) {
      return res.status(400).json({ message: "Le message et la date de début sont obligatoires." });
    }

    await useCase.exécute(contenu, dateDebut, dateFin || null, badgeType || null, badgeLibelle || null);
    return res.status(201).json({ message: "Message enregistré avec succès." });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de l'enregistrement du message." + (error instanceof Error ? ` Détails : ${error.message}` : "") });
  }
}
