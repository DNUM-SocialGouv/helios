
import { dependencies } from "../../backend/infrastructure/dependencies";
import { AideUseCase } from "../../backend/métier/use-cases/AideUseCase";
import type { NextApiRequest, NextApiResponse } from "next";

const useCase = new AideUseCase(dependencies.aideLoader);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const data = await useCase.recupererContenu();
      res.status(200).json({ data });
    } catch (error: any) {
      res.status(500).json({ message: error?.message ?? "Erreur lors de la lecture" });
    }
    return;
  }

  if (req.method === "POST") {
    try {
      const { data, remove } = req.body ?? {};
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        res.status(400).json({ message: "Format de données invalide" });
        return;
      }

      const contenuActuel = await useCase.recupererContenu();
      const contenuMisAJour: Record<string, unknown> = { ...contenuActuel };

      if (Array.isArray(remove)) {
        for (const item of remove) {
          if (typeof item === "string") {
            delete contenuMisAJour[item];
          }
        }
      }

      for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
        contenuMisAJour[key] = value;
      }

      await useCase.enregistrerContenu(contenuMisAJour);
      res.status(200).json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: error?.message ?? "Erreur lors de l'enregistrement" });
    }
    return;
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end("Méthode non autorisée");
}
