import { ÉtablissementTerritorialSanitaireIdentité } from '../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireIdentité'
import { Wording } from '../configuration/wording/Wording'
import { ÉtablissementTerritorialSanitaireViewModel } from '../ui/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireViewModel'

export class ÉtablissementTerritorialSanitaireViewModelTestFactory {
  private static établissementTerritorial: ÉtablissementTerritorialSanitaireIdentité = {
    adresseAcheminement: '01130 NANTUA',
    adresseNuméroVoie : '50',
    adresseTypeVoie : 'R',
    adresseVoie : 'PAUL PAINLEVE',
    catégorieÉtablissement : '355',
    courriel : 'a@example.com',
    dateMiseAJourSource : '2021-07-07',
    libelléCatégorieÉtablissement : 'Centre Hospitalier (C.H.)',
    numéroFinessEntitéJuridique : '010008407',
    numéroFinessÉtablissementPrincipal : '010045057',
    numéroFinessÉtablissementTerritorial: '010000040',
    raisonSociale : 'CH NANTUA',
    raisonSocialeDeLEntitéDeRattachement : 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
    statutJuridique : 'Société Anonyme (S.A.)',
    typeÉtablissement : 'S',
    téléphone : '0474754800',
  }

  public static crée(
    wording: Wording, champsSurchargés?: Partial<ÉtablissementTerritorialSanitaireIdentité>
  ): ÉtablissementTerritorialSanitaireViewModel {
    return new ÉtablissementTerritorialSanitaireViewModel({
      ...ÉtablissementTerritorialSanitaireViewModelTestFactory.établissementTerritorial,
      ...champsSurchargés,
    }, wording)
  }
}
