import { DomaineÉtablissementTerritorial } from '../../backend/métier/entities/DomaineÉtablissementTerritorial'
import { ÉtablissementTerritorialRattaché } from '../../backend/métier/entities/entité-juridique/ÉtablissementTerritorialRattaché'
import { Wording } from '../configuration/wording/Wording'
import { ÉtablissementTerritorialRattachéViewModel } from '../ui/entité-juridique/liste-des-établissements/ÉtablissementTerritorialRattachéViewModel'

export class ÉtablissementTerritorialRattachéViewModelTestBuilder {
  private static établissementTerritorialRattaché1: ÉtablissementTerritorialRattaché = {
    domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
    numéroFiness: '010000040',
    raisonSocialeCourte: 'CH NANTUA',
  }

  private static établissementTerritorialRattaché2: ÉtablissementTerritorialRattaché = {
    domaine: DomaineÉtablissementTerritorial.SANITAIRE,
    numéroFiness: '590782553',
    raisonSocialeCourte: 'HP VILLENEUVE DASCQ',
  }

  public static créeÉtablissementTerritorialRattaché(
    wording: Wording,
    champsSurchargés?: Partial<ÉtablissementTerritorialRattaché>
  ): ÉtablissementTerritorialRattachéViewModel {
    return new ÉtablissementTerritorialRattachéViewModel({
      ...ÉtablissementTerritorialRattachéViewModelTestBuilder.établissementTerritorialRattaché1,
      ...champsSurchargés,
    }, wording)
  }

  public static créeAutreÉtablissementTerritorialRattaché(
    wording: Wording,
    champsSurchargés?: Partial<ÉtablissementTerritorialRattaché>
  ): ÉtablissementTerritorialRattachéViewModel {
    return new ÉtablissementTerritorialRattachéViewModel({
      ...ÉtablissementTerritorialRattachéViewModelTestBuilder.établissementTerritorialRattaché2,
      ...champsSurchargés,
    }, wording)
  }
}
