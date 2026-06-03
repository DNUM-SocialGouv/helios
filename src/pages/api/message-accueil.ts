import { NextApiRequest, NextApiResponse } from "next";

import { dependencies } from "../../backend/infrastructure/dependencies";
import { MessageAccueilUseCase } from "../../backend/métier/use-cases/MessageAccueilUseCase";

const useCase = new MessageAccueilUseCase(dependencies.messageAccueilLoader);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const message = await dependencies.messageAccueilLoader.getLastMessage();
      return res.status(200).json(message);
    } catch (error) {
      return res.status(500).json({ message: "Erreur lors de la récupération du message." + (error instanceof Error ? ` Détails : ${error.message}` : "") });
    }
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { contenu, dateDebut, dateFin, badgeType, badgeLibelle, lienUrl, lienLibelle, forcerEnregistrement, desactiverIds } = req.body;

    if (!contenu || !dateDebut || !dateFin) {
      return res.status(400).json({ message: "Le message, la date de début et la date de fin sont obligatoires." });
    }


    if (!forcerEnregistrement) {
      const chevauchements = await useCase.verifierChevauchements(dateDebut, dateFin);
      if (chevauchements.length > 0) {
        return res.status(409).json({
          chevauchements,
          message: "Chevauchement détecté.",
        });
      }
    }

    if (desactiverIds && Array.isArray(desactiverIds) && desactiverIds.length > 0) {
      await useCase.desactiverMessages(desactiverIds);
    }

    await useCase.execute(contenu, dateDebut, dateFin, badgeType || null, badgeLibelle || null, lienUrl || null, lienLibelle || null);
    return res.status(201).json({ message: "Message enregistré avec succès." });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de l'enregistrement du message." + (error instanceof Error ? ` Détails : ${error.message}` : "") });
  }
}
