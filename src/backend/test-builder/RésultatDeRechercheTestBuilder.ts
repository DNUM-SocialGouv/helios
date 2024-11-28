import { Résultat } from "../métier/entities/RésultatDeRecherche";

export class RésultatDeRechercheTestBuilder {
  private static résultatDeRechercheEntité: Résultat = {
    commune: "OYONNAX",
    département: "AIN",
    numéroFiness: "010018407",
    raisonSocialeCourte: "CH DU HAUT BUGEY",
    type: "Entité juridique",
    rattachement: "",
  };
  private static résultatDeRechercheÉtablissementMédicoSocial: Résultat = {
    commune: "NANTUA",
    département: "AIN",
    numéroFiness: "010000040",
    raisonSocialeCourte: "CH NANTUA",
    type: "Médico-social",
    rattachement: "010018407",
  };
  private static résultatDeRechercheÉtablissementSanitaire: Résultat = {
    commune: "VILLENEUVE D ASCQ",
    département: "NORD",
    numéroFiness: "590782553",
    raisonSocialeCourte: "HP VILLENEUVE DASCQ",
    type: "Sanitaire",
    rattachement: "010018407",
  };

  public static créeUnRésultatDeRechercheEntité(champsSurchargés?: Partial<Résultat>): Résultat {
    return {
      ...RésultatDeRechercheTestBuilder.résultatDeRechercheEntité,
      ...champsSurchargés,
    };
  }

  public static créeUnRésultatDeRechercheÉtablissementMédicoSocial(champsSurchargés?: Partial<Résultat>): Résultat {
    return {
      ...RésultatDeRechercheTestBuilder.résultatDeRechercheÉtablissementMédicoSocial,
      ...champsSurchargés,
    };
  }

  public static créeUnRésultatDeRechercheÉtablissementSanitaire(champsSurchargés?: Partial<Résultat>): Résultat {
    return {
      ...RésultatDeRechercheTestBuilder.résultatDeRechercheÉtablissementSanitaire,
      ...champsSurchargés,
    };
  }
}
