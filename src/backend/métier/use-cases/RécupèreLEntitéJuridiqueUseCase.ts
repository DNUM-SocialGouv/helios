import { StringFormater } from "../../../frontend/ui/commun/StringFormater";
import { AutorisationActivitesFactory } from "../entities/entité-juridique/AutorisationActivitesFactory";
import { EntitéJuridique } from "../entities/entité-juridique/EntitéJuridique";
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

    const autorisationsActivites = AutorisationActivitesFactory.createFromAutorisationsSanitaire(autorisationsEtCapacites.autorisationsSanitaire.autorisations);
    const autresActivites = AutorisationActivitesFactory.createFromAutresActivitesSanitaire(autorisationsEtCapacites.autresActivitesSanitaire.autorisations);
    const reconnaisanceContractuellesActivites = AutorisationActivitesFactory.createFromReconnaissanceContractuellesSanitaire(
      autorisationsEtCapacites.reconnaissanceContractuellesSanitaire.autorisations
    );

    return {
      ...entitéJuridiqueIdentitéOuErreur,
      activités,
      budgetFinance,
      autorisationsEtCapacites: {
        numéroFinessEntitéJuridique: autorisationsEtCapacites.numéroFinessEntitéJuridique,
        capacités: autorisationsEtCapacites.capacités,
        autorisationsActivités: {
          autorisations: autorisationsActivites,
          dateMiseÀJourSource: StringFormater.formatDate(autorisationsEtCapacites.autorisationsSanitaire.dateMiseÀJourSource),
        },
        autresActivités: {
          autorisations: autresActivites,
          dateMiseÀJourSource: StringFormater.formatDate(autorisationsEtCapacites.autresActivitesSanitaire.dateMiseÀJourSource),
        },
        reconnaissanceContractuelleActivités: {
          autorisations: reconnaisanceContractuellesActivites,
          dateMiseÀJourSource: StringFormater.formatDate(autorisationsEtCapacites.reconnaissanceContractuellesSanitaire.dateMiseÀJourSource),
        },
      },
    };
  }
}
