import { ÉtablissementTerritorialMédicoSocial } from "../entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial";
import { ÉtablissementTerritorialMédicoSocialNonTrouvée } from "../entities/ÉtablissementTerritorialMédicoSocialNonTrouvée";
import { EntitéJuridiqueLoader } from "../gateways/EntitéJuridiqueLoader";
import { ÉtablissementTerritorialMédicoSocialLoader } from "../gateways/ÉtablissementTerritorialMédicoSocialLoader";

export class RécupèreLÉtablissementTerritorialMédicoSocialUseCase {
  constructor(
    private établissementTerritorialMédicoSocialLoader: ÉtablissementTerritorialMédicoSocialLoader,
    private entitéJuridiqueLoader: EntitéJuridiqueLoader
  ) { }

  async exécute(numéroFinessÉtablissementTerritorial: string): Promise<ÉtablissementTerritorialMédicoSocial> {
    const établissementTerritorialMédicoSocialOuErreur = await this.établissementTerritorialMédicoSocialLoader.chargeIdentité(
      numéroFinessÉtablissementTerritorial
    );

    if (établissementTerritorialMédicoSocialOuErreur instanceof ÉtablissementTerritorialMédicoSocialNonTrouvée) {
      throw établissementTerritorialMédicoSocialOuErreur;
    }

    const { estMonoÉtablissement } = await this.établissementTerritorialMédicoSocialLoader.estUnMonoÉtablissement(
      établissementTerritorialMédicoSocialOuErreur.numéroFinessEntitéJuridique.value
    );

    const entitéJuridiqueDeRattachement = await this.entitéJuridiqueLoader.chargeRattachement(
      établissementTerritorialMédicoSocialOuErreur.numéroFinessEntitéJuridique.value
    );

    const établissementTerritorialMédicoSocialActivité = await this.établissementTerritorialMédicoSocialLoader.chargeActivité(
      numéroFinessÉtablissementTerritorial
    );

    const établissementTerritorialMédicoSocialAutorisation = await this.établissementTerritorialMédicoSocialLoader.chargeAutorisationsEtCapacités(
      numéroFinessÉtablissementTerritorial
    );

    const établissementTerritorialMédicoSocialBudgetEtFinances = await this.établissementTerritorialMédicoSocialLoader.chargeBudgetEtFinances(
      numéroFinessÉtablissementTerritorial
    );

    const établissementTerritorialMédicoSocialRessourcesHumaines = await this.établissementTerritorialMédicoSocialLoader.chargeRessourcesHumaines(
      numéroFinessÉtablissementTerritorial
    );

    const établissementTerritorialMédicoSocialQualite = {
      2019: {
        total_clotures: 389,
        total_encours: 297,
        date_miseAJourSource: "20/10/2019",
        details: [
          {
            motif: "MOTIF_10",
            clot: 10,
            encours: 10,
          },
          {
            motif: "MOTIF_11",
            clot: 7,
            encours: 10,
          },
          {
            motif: "MOTIF_12",
            clot: 11,
            encours: 70,
          },
          {
            motif: "MOTIF_13",
            clot: 40,
            encours: 10,
          },
          {
            motif: "MOTIF_14",
            clot: 76,
            encours: 45,
          },
          {
            motif: "MOTIF_15",
            clot: 28,
            encours: 10,
          },
          {
            motif: "MOTIF_16",
            clot: 18,
            encours: 4,
          },
          {
            motif: "MOTIF_17",
            clot: 62,
            encours: 22,
          },
          {
            motif: "MOTIF_18",
            clot: 1,
            encours: 9,
          },
          {
            motif: "MOTIF_19",
            clot: 15,
            encours: 7,
          },
          {
            motif: "MOTIF_155",
            clot: 59,
            encours: 88,
          },
          {
            motif: "MOTIF_156",
            clot: 62,
            encours: 12,
          },
        ],
      },
      2020: {
        total_clotures: 1389,
        total_encours: 797,
        date_miseAJourSource: "20/10/2020",
        details: [
          {
            motif: "MOTIF_10",
            clot: 10,
            encours: 10,
          },
          {
            motif: "MOTIF_11",
            clot: 7,
            encours: 10,
          },
          {
            motif: "MOTIF_12",
            clot: 11,
            encours: 170,
          },
          {
            motif: "MOTIF_13",
            clot: 140,
            encours: 210,
          },
          {
            motif: "MOTIF_14",
            clot: 76,
            encours: 45,
          },
          {
            motif: "MOTIF_15",
            clot: 28,
            encours: 10,
          },
          {
            motif: "MOTIF_16",
            clot: 18,
            encours: 4,
          },
          {
            motif: "MOTIF_17",
            clot: 162,
            encours: 122,
          },
          {
            motif: "MOTIF_18",
            clot: 101,
            encours: 109,
          },
          {
            motif: "MOTIF_19",
            clot: 15,
            encours: 7,
          },
          {
            motif: "MOTIF_155",
            clot: 259,
            encours: 88,
          },
          {
            motif: "MOTIF_156",
            clot: 562,
            encours: 12,
          },
        ],
      },
    }

    return {
      activités: établissementTerritorialMédicoSocialActivité,
      autorisationsEtCapacités: établissementTerritorialMédicoSocialAutorisation,
      budgetEtFinances: établissementTerritorialMédicoSocialBudgetEtFinances,
      identité: {
        ...établissementTerritorialMédicoSocialOuErreur,
        ...entitéJuridiqueDeRattachement,
        estMonoÉtablissement,
      },
      ressourcesHumaines: établissementTerritorialMédicoSocialRessourcesHumaines,
      qualite: établissementTerritorialMédicoSocialQualite,
    };
  }
}
