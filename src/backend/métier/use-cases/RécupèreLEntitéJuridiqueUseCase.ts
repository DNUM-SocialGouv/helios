import { StringFormater } from "../../../frontend/ui/commun/StringFormater";
import { AutorisationsFactory } from "../entities/entité-juridique/AutorisationsFactory";
import { EntitéJuridique } from "../entities/entité-juridique/EntitéJuridique";
import { AutorisationActivites } from "../entities/entité-juridique/EntitéJuridiqueAutorisationEtCapacité";
import { EntitéJuridiqueNonTrouvée } from "../entities/EntitéJuridiqueNonTrouvée";
import { EntitéJuridiqueLoader } from "../gateways/EntitéJuridiqueLoader";

function sortAutorisationActivites(data: AutorisationActivites[]): AutorisationActivites[] {
  return data
    .sort((a, b) => a.code.localeCompare(b.code))
    .map((autorisationActivite) => ({
      ...autorisationActivite,
      modalites: autorisationActivite.modalites
        .sort((a, b) => a.code.localeCompare(b.code))
        .map((modalite) => ({
          ...modalite,
          formes: modalite.formes
            .sort((a, b) => a.code.localeCompare(b.code))
            .map((forme) => {
              return {
                ...forme,
                autorisationEtablissements: forme.autorisationEtablissements.sort((a, b) => a.numeroFiness.localeCompare(b.numeroFiness)),
              };
            }),
        })),
    }));
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

    const autorisationsActivites = AutorisationsFactory.createFromAutorisationsSanitaire(autorisationsEtCapacites.autorisationsSanitaire.autorisations);
    const autresActivites = AutorisationsFactory.createFromAutresActivitesSanitaire(autorisationsEtCapacites.autresActivitesSanitaire.autorisations);
    const reconnaissanceContractuellesActivites = AutorisationsFactory.createFromReconnaissanceContractuellesSanitaire(
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
          autorisations: sortAutorisationActivites(autorisationsActivites),
          dateMiseÀJourSource: StringFormater.formatDate(autorisationsEtCapacites.autorisationsSanitaire.dateMiseÀJourSource),
        },
        autresActivités: {
          autorisations: sortAutorisationActivites(autresActivites),
          dateMiseÀJourSource: StringFormater.formatDate(autorisationsEtCapacites.autresActivitesSanitaire.dateMiseÀJourSource),
        },
        reconnaissanceContractuelleActivités: {
          autorisations: sortAutorisationActivites(reconnaissanceContractuellesActivites),
          dateMiseÀJourSource: StringFormater.formatDate(autorisationsEtCapacites.reconnaissanceContractuellesSanitaire.dateMiseÀJourSource),
        },
      },
    };
  }
}
