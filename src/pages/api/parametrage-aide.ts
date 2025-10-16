import { diff, applyChangeset, atomizeChangeset, unatomizeChangeset, Operation, IAtomicChange } from "json-diff-ts";
import { getServerSession } from "next-auth";

import { authOptions } from "./auth/[...nextauth]";
import { dependencies } from "../../backend/infrastructure/dependencies";
import { AideUseCase } from "../../backend/métier/use-cases/AideUseCase";
import { checkNationalAdminRole } from "../../checkNationalAdminMiddleware";
import type { NextApiRequest, NextApiResponse } from "next";

const useCase = new AideUseCase(dependencies.aideLoader);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const data = await useCase.recupererContenu();
      return res.status(200).json({ data });
    } catch (error: any) {
      return res.status(500).json({ message: error?.message ?? "Erreur lors de la lecture" });
    }
  }

  if (req.method === "POST") {
    try {
      const userSession = await getServerSession(req, res, authOptions);
      const user = userSession?.user;
      const updatedBy = { id: user?.idUser, prenom: user?.firstname, nom: user?.name };

      const data = req.body ?? {};
      if (!data || typeof data !== "object" || Array.isArray(data)) {
        return res.status(400).json({ message: "Format de données invalide" });
      }

      const contenuActuel = await useCase.recupererContenu();
      // On récupère le changeset sous la forme de modifications atomique pour pouvoir filtrer
      let changes = atomizeChangeset(diff(contenuActuel, data));

      // On retire la suppression de la Faq
      // Et les changements concernant la personne responsable de la dernière MAJ
      changes = filterChanges(changes);

      // On passe à un changeset classique pour ajouter le nom de la personne ayant fait la dernière MAJ
      const filteredChanges = unatomizeChangeset(changes);

      //Si un changement est fait dans les resources d’une section alors on update le nom de l’utilisateur
      filteredChanges.forEach((sectionChange) => {
        // Seul les ajout ou MAJ de section sont consernés
        if (sectionChange.type === Operation.UPDATE) {
          sectionChange.changes?.forEach((keyChange) => {
            // Seul les changement au champ resources sont consernés
            if (keyChange.key === "resources") {
              keyChange.changes?.forEach((keyDetailChange, _i, array) => {
                // On ajoute une operation d’update de la personne ayant fait la MAJ à la fin du changeset
                array.push({ type: Operation.UPDATE, key: keyDetailChange.key, changes: [{ key: 'updatedBy', type: Operation.UPDATE, value: updatedBy }] });
              });
            }
          });
        } else if (sectionChange.type === Operation.ADD) {
          // On regarde si des resources sont ajoutées et on ajoute l’utilisateur
          sectionChange.value.resources.forEach((resource: any) => {
            resource.updatedBy = updatedBy;
          })
        }
      });

      // On applique le changeset filtré aux données de la BDD
      const contenuMisAJour = applyChangeset(contenuActuel, filteredChanges);

      await useCase.enregistrerContenu(contenuMisAJour);
      return res.status(200).json(contenuMisAJour);
    } catch (error: any) {
      return res.status(500).json({ message: error?.message ?? "Une erreur est survenue lors de l’enregistrement." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end("Méthode non autorisée");
};

const service = async (req: NextApiRequest, res: NextApiResponse) => {
  if (await checkNationalAdminRole(req, res)) {
    await handler(req, res);
  }
};

function filterChanges(changes: IAtomicChange[]): IAtomicChange[] {
  return changes.filter((change) => {
    const type = change.type;
    // La suppression de la Faq est interdite
    if (type === Operation.REMOVE && change.path === "$.foire-aux-questions") return false;
    // Le changement des info de dernière MAJ est interdit
    if (change.path.includes("updatedBy")) return false;
    return true;
  });
}

export default service;
