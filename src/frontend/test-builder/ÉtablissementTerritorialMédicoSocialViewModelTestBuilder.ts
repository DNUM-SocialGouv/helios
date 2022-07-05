import { ÉtablissementTerritorialMédicoSocial } from '../../backend/métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocial'
import { Wording } from '../configuration/wording/Wording'
import { ÉtablissementTerritorialMédicoSocialViewModel } from '../ui/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialViewModel'

export class ÉtablissementTerritorialMédicoSocialViewModelTestBuilder {
  private static identité: ÉtablissementTerritorialMédicoSocial['identité'] = {
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

  private static activité: ÉtablissementTerritorialMédicoSocial['activité'] = [
    {
      année: 2019,
      dateMiseAJourSource: 'string',
      duréeMoyenneSéjourAccompagnementPersonnesSorties: 80,
      fileActivePersonnesAccompagnées: 80,
      nombreMoyenJournéesAbsencePersonnesAccompagnées: 80,
      numéroFinessÉtablissementTerritorial: 'string',
      tauxOccupationAccueilDeJour: 80,
      tauxOccupationHébergementPermanent: 80,
      tauxOccupationHébergementTemporaire: 80,
      tauxRéalisationActivité: 80,
    },
    {
      année: 2020,
      dateMiseAJourSource: 'string',
      duréeMoyenneSéjourAccompagnementPersonnesSorties: 80,
      fileActivePersonnesAccompagnées: 80,
      nombreMoyenJournéesAbsencePersonnesAccompagnées: 80,
      numéroFinessÉtablissementTerritorial: 'string',
      tauxOccupationAccueilDeJour: 80,
      tauxOccupationHébergementPermanent: 80,
      tauxOccupationHébergementTemporaire: 80,
      tauxRéalisationActivité: 80,
    },
    {
      année: 2021,
      dateMiseAJourSource: 'string',
      duréeMoyenneSéjourAccompagnementPersonnesSorties: 80,
      fileActivePersonnesAccompagnées: 80,
      nombreMoyenJournéesAbsencePersonnesAccompagnées: 80,
      numéroFinessÉtablissementTerritorial: 'string',
      tauxOccupationAccueilDeJour: 80,
      tauxOccupationHébergementPermanent: 80,
      tauxOccupationHébergementTemporaire: 80,
      tauxRéalisationActivité: 80,
    },
  ]

  public static crée(
    wording: Wording, champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocial['identité']>
  ): ÉtablissementTerritorialMédicoSocialViewModel {
    return new ÉtablissementTerritorialMédicoSocialViewModel({
      activité: {
        ...ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.activité,
        ...champsSurchargés,
      },
      identité: {
        ...ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
        ...champsSurchargés,
      },
    }, wording)
  }
}
