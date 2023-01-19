import { DomaineÉtablissementTerritorial } from "../../backend/métier/entities/DomaineÉtablissementTerritorial";
import { ÉtablissementTerritorialRattaché } from "../../backend/métier/entities/entité-juridique/ÉtablissementTerritorialRattaché";
import { Wording } from "../configuration/wording/Wording";
import { ÉtablissementTerritorialRattachéViewModel } from "../ui/entité-juridique/liste-des-établissements/ÉtablissementTerritorialRattachéViewModel";

export class ÉtablissementTerritorialRattachéViewModelTestBuilder {
  public static établissementTerritorialMédicoSocialRattaché: ÉtablissementTerritorialRattaché = {
    domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
    numéroFiness: "010000040",
    raisonSocialeCourte: "CH NANTUA",
  };

  public static établissementTerritorialSanitaireRattaché: ÉtablissementTerritorialRattaché = {
    domaine: DomaineÉtablissementTerritorial.SANITAIRE,
    numéroFiness: "590782553",
    raisonSocialeCourte: "HP VILLENEUVE DASCQ",
  };

  public static créeÉtablissementTerritorialMédicoSocialRattaché(
    wording: Wording,
    champsSurchargés?: Partial<ÉtablissementTerritorialRattaché>
  ): ÉtablissementTerritorialRattachéViewModel {
    return new ÉtablissementTerritorialRattachéViewModel(
      {
        ...ÉtablissementTerritorialRattachéViewModelTestBuilder.établissementTerritorialMédicoSocialRattaché,
        ...champsSurchargés,
      },
      wording
    );
  }

  public static créeÉtablissementTerritorialSanitaireRattaché(
    wording: Wording,
    champsSurchargés?: Partial<ÉtablissementTerritorialRattaché>
  ): ÉtablissementTerritorialRattachéViewModel {
    return new ÉtablissementTerritorialRattachéViewModel(
      {
        ...ÉtablissementTerritorialRattachéViewModelTestBuilder.établissementTerritorialSanitaireRattaché,
        ...champsSurchargés,
      },
      wording
    );
  }
}
