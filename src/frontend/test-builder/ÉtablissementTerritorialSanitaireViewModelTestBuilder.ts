import { ÉtablissementTerritorialMédicoSocial } from '../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { ÉtablissementTerritorialSanitaire } from '../../backend/métier/entities/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaire'
import { Wording } from '../configuration/wording/Wording'
import { ÉtablissementTerritorialSanitaireViewModel } from '../ui/établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireViewModel'

export class ÉtablissementTerritorialSanitaireViewModelTestBuilder {
  private static établissementTerritorial: ÉtablissementTerritorialSanitaire['identité'] = {
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
    wording: Wording, champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocial['identité']>
  ): ÉtablissementTerritorialSanitaireViewModel {
    return new ÉtablissementTerritorialSanitaireViewModel({
      activités: [],
      identité: {
        ...ÉtablissementTerritorialSanitaireViewModelTestBuilder.établissementTerritorial,
        ...champsSurchargés,
      },
    }, wording)
  }
}
