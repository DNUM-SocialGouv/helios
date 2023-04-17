import { AutorisationSanitaireModel } from "../../../../database/models/AutorisationSanitaireModel";
import { EntitéJuridique } from "../entities/entité-juridique/EntitéJuridique";
import {
  Autorisation,
  AutorisationActivites,
  AutorisationEtablissement,
  Forme,
  Modalite,
} from "../entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { EntitéJuridiqueNonTrouvée } from "../entities/EntitéJuridiqueNonTrouvée";
import { EntitéJuridiqueLoader } from "../gateways/EntitéJuridiqueLoader";

class AutorisationActivitesFactory {
  static createFromAutorisationsSanitaire(autorisationsSanitaire: AutorisationSanitaireModel[]): AutorisationActivites[] {
    return autorisationsSanitaire.reduce((autorisationsActivites: AutorisationActivites[], autorisationSanitaire) => {
      const activite = this.findOrAddActivité(autorisationsActivites, autorisationSanitaire);
      const modalite = this.findOrAddModalité(activite, autorisationSanitaire);
      const forme = this.findOrAddForme(modalite, autorisationSanitaire);
      const etablissement = this.findOrAddEtablissement(forme, autorisationSanitaire);
      const autorisation = this.addAutorisation(autorisationSanitaire);

      etablissement.autorisation.push(...autorisation);
      return autorisationsActivites;
    }, []);
  }

  private static findOrAddActivité(autorisationActivites: AutorisationActivites[], autorisationSanitaire: AutorisationSanitaireModel): AutorisationActivites {
    let activite = autorisationActivites.find((a) => a.code === autorisationSanitaire.codeActivité);

    if (!activite) {
      activite = {
        modalités: [],
        libelle: autorisationSanitaire.libelléActivité,
        code: autorisationSanitaire.codeActivité,
      };
      autorisationActivites.push(activite);
    }

    return activite;
  }

  private static findOrAddModalité(activite: AutorisationActivites, autorisationSanitaire: AutorisationSanitaireModel): Modalite {
    let modalite = activite.modalités.find((m) => m.code === autorisationSanitaire.codeModalité);

    if (!modalite) {
      modalite = {
        formes: [],
        code: autorisationSanitaire.codeModalité,
        libelle: autorisationSanitaire.libelléModalité,
      };
      activite.modalités.push(modalite);
    }

    return modalite;
  }

  private static findOrAddForme(modalite: Modalite, autorisationSanitaire: AutorisationSanitaireModel): Forme {
    let forme = modalite.formes.find((f) => f.code === autorisationSanitaire.codeForme);

    if (!forme) {
      forme = {
        autorisationEtablissements: [],
        code: autorisationSanitaire.codeForme,
        libelle: autorisationSanitaire.libelléForme,
      };
      modalite.formes.push(forme);
    }

    return forme;
  }

  private static findOrAddEtablissement(forme: Forme, autorisationSanitaire: AutorisationSanitaireModel): AutorisationEtablissement {
    let etablissement = forme.autorisationEtablissements.find((e) => e.numeroFiness === autorisationSanitaire.numéroFinessÉtablissementTerritorial);

    if (!etablissement) {
      etablissement = {
        numeroFiness: autorisationSanitaire.numéroFinessÉtablissementTerritorial,
        nom: autorisationSanitaire.établissementTerritorial.raisonSocialeCourte,
        autorisation: [],
      };
      forme.autorisationEtablissements.push(etablissement);
    }

    return etablissement;
  }

  private static addAutorisation(autorisationSanitaire: AutorisationSanitaireModel): Autorisation[] {
    return [
      { nom: "Numéro ARHGOS", valeur: autorisationSanitaire.numéroAutorisationArhgos },
      { nom: "Date d'autorisation", valeur: autorisationSanitaire.dateAutorisation },
      { nom: "Date de mise en oeuvre", valeur: autorisationSanitaire.dateMiseEnOeuvre },
      { nom: "Date de fin", valeur: autorisationSanitaire.dateFin },
    ];
  }
}

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

    const autorisationsActivites = AutorisationActivitesFactory.createFromAutorisationsSanitaire(autorisationsEtCapacites.autorisationsSanitaire);

    return {
      ...entitéJuridiqueIdentitéOuErreur,
      activités,
      budgetFinance,
      autorisationsEtCapacites: {
        numéroFinessEntitéJuridique: autorisationsEtCapacites.numéroFinessEntitéJuridique,
        capacités: autorisationsEtCapacites.capacités,
        autorisationsActivités: autorisationsActivites,
      },
    };
  }
}
