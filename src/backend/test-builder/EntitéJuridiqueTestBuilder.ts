import { CatégorisationEnum, EntitéJuridique } from "../métier/entities/entité-juridique/EntitéJuridique";

export class EntitéJuridiqueTestBuilder {
  private static entitéJuridique: EntitéJuridique = {
    adresseAcheminement: {
      dateMiseÀJourSource: "2022-05-14",
      value: "01117 OYONNAX CEDEX",
    },
    adresseNuméroVoie: {
      dateMiseÀJourSource: "2022-05-14",
      value: "1",
    },
    adresseTypeVoie: {
      dateMiseÀJourSource: "2022-05-14",
      value: "RTE",
    },
    adresseVoie: {
      dateMiseÀJourSource: "2022-05-14",
      value: "DE VEYZIAT",
    },
    catégorisation: CatégorisationEnum.PUBLIC,
    libelléStatutJuridique: {
      dateMiseÀJourSource: "2022-05-14",
      value: "Etablissement Public Intercommunal dHospitalisation",
    },
    numéroFinessEntitéJuridique: {
      dateMiseÀJourSource: "2022-05-14",
      value: "010018407",
    },
    raisonSociale: {
      dateMiseÀJourSource: "2022-05-14",
      value: "CENTRE HOSPITALIER DU HAUT BUGEY",
    },
    raisonSocialeCourte: {
      dateMiseÀJourSource: "2022-05-14",
      value: "CH DU HAUT BUGEY",
    },
    siren: {
      dateMiseÀJourSource: "2022-05-14",
      value: "260104631",
    },
    téléphone: {
      dateMiseÀJourSource: "2022-05-14",
      value: "0102030406",
    },
  };

  public static créeEntitéJuridique(champsSurchargés?: Partial<EntitéJuridique>): EntitéJuridique {
    return {
      ...EntitéJuridiqueTestBuilder.entitéJuridique,
      ...champsSurchargés,
    };
  }
}
