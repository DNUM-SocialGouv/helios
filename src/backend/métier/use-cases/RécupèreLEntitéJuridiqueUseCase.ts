import { EntitéJuridique } from "../entities/entité-juridique/EntitéJuridique";
import {
  Autorisation,
  AutorisationActivites,
  EntitéJuridiqueAutorisationEtCapacitéLoader,
} from "../entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { EntitéJuridiqueNonTrouvée } from "../entities/EntitéJuridiqueNonTrouvée";
import { EntitéJuridiqueLoader } from "../gateways/EntitéJuridiqueLoader";

export class RécupèreLEntitéJuridiqueUseCase {
  constructor(private entitéJuridiqueLoader: EntitéJuridiqueLoader) {}

  async exécute(numéroFiness: string): Promise<EntitéJuridique> {
    const entitéJuridiqueIdentitéOuErreur = await this.entitéJuridiqueLoader.chargeIdentité(numéroFiness);
    const activités = await this.entitéJuridiqueLoader.chargeActivités(numéroFiness);
    const budgetFinance = await this.entitéJuridiqueLoader.chargeBudgetFinance(numéroFiness);
    const autorisationsEtCapacites = await this.entitéJuridiqueLoader.chargeAutorisationsEtCapacités(numéroFiness);

    if (entitéJuridiqueIdentitéOuErreur instanceof EntitéJuridiqueNonTrouvée) {
      throw entitéJuridiqueIdentitéOuErreur;
    }

    const autorisationsActivites = this.mapAutorisationSanitaireToAutorisationActivites(autorisationsEtCapacites);

    return {
      ...entitéJuridiqueIdentitéOuErreur,
      activités,
      budgetFinance,
      autorisationsEtCapacites: { ...autorisationsEtCapacites, autorisationsActivités: autorisationsActivites },
    };
  }

  private mapAutorisationSanitaireToAutorisationActivites(autorisationsEtCapacites: EntitéJuridiqueAutorisationEtCapacitéLoader): AutorisationActivites[] {
    const autorisationActivites: AutorisationActivites[] = [];

    autorisationsEtCapacites.autorisationsSanitaire.forEach((autorisationSanitaire) => {
      let activite = autorisationActivites.find((a) => a.code === autorisationSanitaire.codeActivité);
      if (!activite) {
        activite = {
          modalités: [],
          libelle: autorisationSanitaire.libelléActivité,
          code: autorisationSanitaire.codeActivité,
        };
        autorisationActivites.push(activite);
      }

      let modalite = activite.modalités.find((modalite) => modalite.code === autorisationSanitaire.codeModalité);
      if (!modalite) {
        modalite = {
          formes: [],
          code: autorisationSanitaire.codeModalité,
          libelle: autorisationSanitaire.libelléModalité,
        };
        activite.modalités.push(modalite);
      }

      let forme = modalite.formes.find((forme) => forme.code === autorisationSanitaire.codeForme);
      if (!forme) {
        forme = {
          autorisationEtablissements: [],
          code: autorisationSanitaire.codeForme,
          libelle: autorisationSanitaire.libelléForme,
        };
        modalite.formes.push(forme);
      }

      let etablissement = forme.autorisationEtablissements.find(
        (autorisationEtablissement) => autorisationEtablissement.numeroFiness === autorisationSanitaire.numéroFinessÉtablissementTerritorial
      );
      if (!etablissement) {
        etablissement = {
          numeroFiness: autorisationSanitaire.numéroFinessÉtablissementTerritorial,
          nom: autorisationSanitaire.établissementTerritorial.raisonSocialeCourte,
          autorisation: [],
        };
        forme.autorisationEtablissements.push(etablissement);
      }

      const autorisation: Autorisation[] = [
        { nom: "Numéro ARHGOS", valeur: autorisationSanitaire.numéroAutorisationArhgos },
        { nom: "Date d'autorisation", valeur: autorisationSanitaire.dateAutorisation },
        { nom: "Date de mise en oeuvre", valeur: autorisationSanitaire.dateMiseEnOeuvre },
        { nom: "Date de fin", valeur: autorisationSanitaire.dateFin },
      ];
      etablissement.autorisation.push(...autorisation);
    });

    return autorisationActivites;
  }
}
