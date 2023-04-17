import { AutorisationSanitaireModel } from "../../../../database/models/AutorisationSanitaireModel";
import { EntitéJuridique } from "../entities/entité-juridique/EntitéJuridique";
import {
  AutorisationActivites,
  AutorisationEtablissement,
  EntitéJuridiqueAutorisationEtCapacitéLoader,
  Forme,
  Modalite,
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

    const autorisationsActivites = this.grouperLesAutorisationsParActivités(autorisationsEtCapacites.autorisationsSanitaire);
    this.grouperLesAutorisationsParModalités(autorisationsEtCapacites.autorisationsSanitaire, autorisationsActivites);
    this.grouperLesAutorisationsParForme(autorisationsEtCapacites, autorisationsActivites);
    this.grouperLesAutorisationsParEtablissements(autorisationsEtCapacites, autorisationsActivites);

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

  private grouperLesAutorisationsParEtablissements(
    autorisationsEtCapacites: EntitéJuridiqueAutorisationEtCapacitéLoader,
    autorisationsActivites: AutorisationActivites[]
  ) {
    autorisationsEtCapacites.autorisationsSanitaire.forEach((autorisationSanitaire) => {
      const currentEtablissement: AutorisationEtablissement = {
        numeroFiness: autorisationSanitaire.numéroFinessÉtablissementTerritorial,
        nom: autorisationSanitaire.établissementTerritorial.raisonSocialeCourte,
        autorisation: [],
      };
      const activité = autorisationsActivites.find((autorisation) => autorisation.code === autorisationSanitaire.codeActivité) as AutorisationActivites;
      const modalité = activité.modalités.find((modalité) => modalité.code === autorisationSanitaire.codeModalité) as Modalite;
      const formeExiste = modalité.formes.find((forme) => forme.code === autorisationSanitaire.codeForme) as Forme;

      const etablissementExiste = formeExiste.autorisationEtablissements.find(
        (autorisationEtablissement) => autorisationEtablissement.numeroFiness === autorisationSanitaire.numéroFinessÉtablissementTerritorial
      );
      const currentAutorisation = [
        {
          nom: "numéroAutorisationArhgos",
          valeur: autorisationSanitaire.numéroAutorisationArhgos,
        },
        {
          nom: "dateDAutorisation",
          valeur: autorisationSanitaire.dateAutorisation,
        },
        {
          nom: "dateDeFin",
          valeur: autorisationSanitaire.dateFin,
        },
        {
          nom: "dateDeMiseEnOeuvre",
          valeur: autorisationSanitaire.dateMiseEnOeuvre,
        },
      ];
      etablissementExiste ? (etablissementExiste.autorisation = currentAutorisation) : (currentEtablissement.autorisation = currentAutorisation);
      if (!etablissementExiste) {
        formeExiste.autorisationEtablissements.push(currentEtablissement);
      }
    });
  }

  private grouperLesAutorisationsParForme(
    autorisationsEtCapacites: EntitéJuridiqueAutorisationEtCapacitéLoader,
    autorisationsActivites: AutorisationActivites[]
  ) {
    autorisationsEtCapacites.autorisationsSanitaire.forEach((autorisationSanitaire) => {
      const currentForme: Forme = {
        libelle: autorisationSanitaire.libelléForme,
        code: autorisationSanitaire.codeForme,
        autorisationEtablissements: [],
      };
      const activité = autorisationsActivites.find((autorisation) => autorisation.code === autorisationSanitaire.codeActivité) as AutorisationActivites;
      const modalité = activité.modalités.find((modalité) => modalité.code === autorisationSanitaire.codeModalité) as Modalite;
      const formeExiste = modalité.formes.find((forme) => forme.code === autorisationSanitaire.codeForme);
      if (!formeExiste) {
        modalité.formes.push(currentForme);
      }
    });
  }

  private grouperLesAutorisationsParModalités(autorisationsEntities: AutorisationSanitaireModel[], autorisationsActivites: AutorisationActivites[]) {
    autorisationsEntities.forEach((autorisationEntity) => {
      const currentModalité: Modalite = {
        code: autorisationEntity.codeModalité,
        libelle: autorisationEntity.libelléModalité,
        formes: [],
      };
      const activité = autorisationsActivites.find((autorisation) => autorisation.code === autorisationEntity.codeActivité) as AutorisationActivites;
      const modalitéExiste = activité.modalités.find((modalité) => modalité.code === currentModalité.code);
      if (!modalitéExiste) {
        activité.modalités.push(currentModalité);
      }
    });
  }

  private grouperLesAutorisationsParActivités(autorisationsEntities: AutorisationSanitaireModel[]) {
    const autorisationsActivites: AutorisationActivites[] = [];
    autorisationsEntities.forEach((autorisationEntity) => {
      const currentActivité = {
        code: autorisationEntity.codeActivité,
        libelle: autorisationEntity.libelléActivité,
      };
      const existingActivité = autorisationsActivites.find((autorisation) => autorisation.code === currentActivité.code);
      if (existingActivité === undefined) {
        autorisationsActivites.push({
          ...currentActivité,
          modalités: [],
        });
      }
    });
    return autorisationsActivites;
  }
}
