import { CatégorisationEnum, EntitéJuridique } from "../../../backend/métier/entities/entité-juridique/EntitéJuridique";
import { Wording } from "../../configuration/wording/Wording";
import { EntiteJuridiqueViewModel } from "../../ui/entité-juridique/EntitéJuridiqueViewModel";


const autorisationsMockData = {
  budgetEtFinance: {
    tauxDeCafNette: "ok",
    compteRésultats: "ok",
    résultatNetComptable: "ok",
    ratioDépendanceFinancière: "ok",
    allocationDeRessources: "ok",
  },
  budgetEtFinances: {
    tauxDeCafNette: "ok",
    compteRésultats: "ok",
    fondsDeRoulement: "ok",
    résultatNetComptable: "ok",
    tauxDeVétustéConstruction: "ok",
    contributionAuxFraisDeSiège: "ok",
  },
};

export class EntitéJuridiqueViewModelTestBuilder {
  static entitéJuridique: EntitéJuridique = {
    adresseAcheminement: {
      dateMiseÀJourSource: "2021-07-07",
      value: "22023 ST BRIEUC CEDEX 1",
    },
    adresseNuméroVoie: {
      dateMiseÀJourSource: "2021-07-07",
      value: "10",
    },
    adresseTypeVoie: {
      dateMiseÀJourSource: "2021-07-07",
      value: "Rue",
    },
    adresseVoie: {
      dateMiseÀJourSource: "2021-07-07",
      value: "Marcel Proust",
    },
    catégorisation: CatégorisationEnum.PRIVE_LUCRATIF,
    libelléStatutJuridique: {
      dateMiseÀJourSource: "2021-07-07",
      value: "Public",
    },
    numéroFinessEntitéJuridique: {
      dateMiseÀJourSource: "2021-07-07",
      value: "220000020",
    },
    raisonSociale: {
      dateMiseÀJourSource: "2021-07-07",
      value: "CENTRE HOSPITALIER DE SAINT BRIEUC",
    },
    raisonSocialeCourte: {
      dateMiseÀJourSource: "2021-07-07",
      value: "CH SAINT BRIEUC",
    },
    siren: {
      dateMiseÀJourSource: "2021-07-07",
      value: "262200090",
    },
    téléphone: {
      dateMiseÀJourSource: "2021-07-07",
      value: "0296017123",
    },
    dateOuverture: {
      dateMiseÀJourSource: "2022-02-02",
      value: "2001-01-01",
    },
    codeRegion: '84',
    activités: [],
    budgetFinance: [],
    allocationRessource: {
      dateMiseÀJourSource: "",
      data: []
    },
    autorisationsEtCapacites: {
      numéroFinessEntitéJuridique: "",
      capacités: [],
      autorisationsActivités: { autorisations: [], dateMiseÀJourSource: "" },
      autorisationsAmmSanitaire: { autorisations: [], dateMiseÀJourSource: "" },
      autresActivités: { autorisations: [], dateMiseÀJourSource: "" },
      reconnaissanceContractuelleActivités: { autorisations: [], dateMiseÀJourSource: "" },
      equipementMaterielLourdsActivités: { autorisations: [], dateMiseÀJourSource: "" },
    },
    activitésMensuels: {
      activitesSanitaireMensuelList: [],
      dateDeMiseAJour: "11/12/12"
    }
  };

  public static crée(wording: Wording, champsSurchargés?: Partial<EntitéJuridique>): EntiteJuridiqueViewModel {
    return new EntiteJuridiqueViewModel(
      {
        ...EntitéJuridiqueViewModelTestBuilder.entitéJuridique,
        ...champsSurchargés,
      },
      wording,
      autorisationsMockData
    );
  }
}
