import { ÉtablissementTerritorialMédicoSocialIdentité } from '../../backend/métier/entities/ÉtablissementTerritorialMédicoSocial/ÉtablissementTerritorialMédicoSocialIdentité'
import { Wording } from '../configuration/wording/Wording'
import { ÉtablissementTerritorialMédicoSocialViewModel } from '../ui/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialViewModel'

export class ÉtablissementTerritorialMédicoSocialViewModelTestFactory {
  private static établissementTerritorial1: ÉtablissementTerritorialMédicoSocialIdentité = {
    adresseAcheminement: '01130 NANTUA',
    adresseNuméroVoie : '50',
    adresseTypeVoie : 'R',
    adresseVoie : 'PAUL PAINLEVE',
    catégorieÉtablissement : '355',
    courriel : 'a@example.com',
    dateMiseAJourSource : '2021-07-07',
    estMonoÉtablissement: true,
    libelléCatégorieÉtablissement : 'Centre Hospitalier (C.H.)',
    numéroFinessEntitéJuridique : '010008407',
    numéroFinessÉtablissementPrincipal : '010000057',
    numéroFinessÉtablissementTerritorial: '010000040',
    raisonSociale : 'CH NANTUA',
    raisonSocialeDeLEntitéDeRattachement : 'HOPITAL PRIVE DE VILLENEUVE DASCQ',
    statutJuridique : 'Société Anonyme (S.A.)',
    typeÉtablissement : 'S',
    téléphone : '0474754800',
  }

  public static créeÉtablissementTerritorialViewModel(
    wording: Wording, champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocialIdentité>
  ): ÉtablissementTerritorialMédicoSocialViewModel {
    return new ÉtablissementTerritorialMédicoSocialViewModel({
      ...ÉtablissementTerritorialMédicoSocialViewModelTestFactory.établissementTerritorial1,
      ...champsSurchargés,
    }, wording)
  }
}
