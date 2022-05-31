import { ÉtablissementTerritorialRattaché } from '../../backend/métier/entities/entité-juridique/ÉtablissementTerritorialRattaché'
import { DomaineÉtablissementTerritorial } from '../../data-crawler/métier/entities/DomaineÉtablissementTerritorial'
import { Wording } from '../configuration/wording/Wording'
import { ÉtablissementTerritorialRattachéViewModel } from '../ui/entité-juridique/ÉtablissementTerritorialRattachéViewModel'

export class ÉtablissementTerritorialRattachéViewModelTestFactory {
  private static établissementTerritorialRattaché1: ÉtablissementTerritorialRattaché = {
    domaine: DomaineÉtablissementTerritorial.MÉDICO_SOCIAL,
    numéroFiness: '010000040',
    raisonSociale: 'CH NANTUA',
  }

  private static établissementTerritorialRattaché2: ÉtablissementTerritorialRattaché = {
    domaine: DomaineÉtablissementTerritorial.SANITAIRE,
    numéroFiness: '590782553',
    raisonSociale: 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
  }

  public static créeÉtablissementTerritorialRattaché(
    wording: Wording,
    champsSurchargés?: Partial<ÉtablissementTerritorialRattaché>
  ): ÉtablissementTerritorialRattachéViewModel {
    return new ÉtablissementTerritorialRattachéViewModel({
      ...ÉtablissementTerritorialRattachéViewModelTestFactory.établissementTerritorialRattaché1,
      ...champsSurchargés,
    }, wording)
  }

  public static créeAutreÉtablissementTerritorialRattaché(
    wording: Wording,
    champsSurchargés?: Partial<ÉtablissementTerritorialRattaché>
  ): ÉtablissementTerritorialRattachéViewModel {
    return new ÉtablissementTerritorialRattachéViewModel({
      ...ÉtablissementTerritorialRattachéViewModelTestFactory.établissementTerritorialRattaché2,
      ...champsSurchargés,
    }, wording)
  }
}
