import { CatégorisationEnum, EntitéJuridiqueIdentité } from "../métier/entities/entité-juridique/EntitéJuridique";

export class EntitéJuridiqueTestBuilder {
  private static entitéJuridiqueIdentité: EntitéJuridiqueIdentité = {
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
    codeRegion: '84',
  };

  public static créeEntitéJuridiqueIdentité(champsSurchargés?: Partial<EntitéJuridiqueIdentité>): EntitéJuridiqueIdentité {
    return {
      ...EntitéJuridiqueTestBuilder.entitéJuridiqueIdentité,
      ...champsSurchargés,
    };
  }
}
