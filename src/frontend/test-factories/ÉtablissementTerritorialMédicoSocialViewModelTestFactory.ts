import { ÉtablissementTerritorialMédicoSocial } from '../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { Wording } from '../configuration/wording/Wording'
import { ÉtablissementTerritorialMédicoSocialViewModel } from '../ui/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialViewModel'

export class ÉtablissementTerritorialMédicoSocialViewModelTestFactory {
  private static établissementTerritorial1: ÉtablissementTerritorialMédicoSocial['identité'] = {
    adresseAcheminement: '01117 OYONNAX CEDEX',
    adresseNuméroVoie : '1',
    adresseTypeVoie : 'RTE',
    adresseVoie : 'DE VEYZIAT',
    catégorieÉtablissement : '300',
    courriel : 'a@example.com',
    dateMiseAJourSource : '2021-07-07',
    estMonoÉtablissement: false,
    libelléCatégorieÉtablissement : 'Ecoles Formant aux Professions Sanitaires',
    numéroFinessEntitéJuridique : '010008407',
    numéroFinessÉtablissementPrincipal : '010005239',
    numéroFinessÉtablissementTerritorial: '010003598',
    raisonSociale : 'IFAS CH DU HAUT BUGEY',
    raisonSocialeDeLEntitéDeRattachement : 'CH DU HAUT BUGEY',
    statutJuridique : 'Etablissement Public Intercommunal d’Hospitalisation',
    typeÉtablissement : 'S',
    téléphone : '0123456789',
  }

  public static crée(
    wording: Wording, champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocial>
  ): ÉtablissementTerritorialMédicoSocialViewModel {
    return new ÉtablissementTerritorialMédicoSocialViewModel({
      ...ÉtablissementTerritorialMédicoSocialViewModelTestFactory.établissementTerritorial1,
      ...champsSurchargés,
    }, wording)
  }
}
