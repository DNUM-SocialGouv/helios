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

  private static activité: ÉtablissementTerritorialMédicoSocial['activités'] = [
    {
      année: 2019,
      dateMiseAJourSource: '2021-07-07',
      duréeMoyenneSéjourAccompagnementPersonnesSorties: 1013,
      fileActivePersonnesAccompagnées: 340,
      nombreMoyenJournéesAbsencePersonnesAccompagnées: 87,
      numéroFinessÉtablissementTerritorial: '010003598',
      tauxOccupationAccueilDeJour: 0.004,
      tauxOccupationHébergementPermanent: 0.944,
      tauxOccupationHébergementTemporaire: 0.704,
      tauxRéalisationActivité: 1.004,
    },
    {
      année: 2020,
      dateMiseAJourSource: '2021-07-07',
      duréeMoyenneSéjourAccompagnementPersonnesSorties: 994,
      fileActivePersonnesAccompagnées: 280,
      nombreMoyenJournéesAbsencePersonnesAccompagnées: 90,
      numéroFinessÉtablissementTerritorial: '010003598',
      tauxOccupationAccueilDeJour: 0.155,
      tauxOccupationHébergementPermanent: 0.975,
      tauxOccupationHébergementTemporaire: 1.215,
      tauxRéalisationActivité: 0.945,
    },
    {
      année: 2021,
      dateMiseAJourSource: '2021-07-07',
      duréeMoyenneSéjourAccompagnementPersonnesSorties: 990,
      fileActivePersonnesAccompagnées: 300,
      nombreMoyenJournéesAbsencePersonnesAccompagnées: 22,
      numéroFinessÉtablissementTerritorial: '010003598',
      tauxOccupationAccueilDeJour: 0.206,
      tauxOccupationHébergementPermanent: 1.016,
      tauxOccupationHébergementTemporaire: 0.676,
      tauxRéalisationActivité: 0.966,
    },
  ]

  public static crée(
    wording: Wording,
    champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocial['identité']>
  ): ÉtablissementTerritorialMédicoSocialViewModel {
    return new ÉtablissementTerritorialMédicoSocialViewModel({
      activités: ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.activité,
      identité: {
        ...ÉtablissementTerritorialMédicoSocialViewModelTestBuilder.identité,
        ...champsSurchargés,
      },
    }, wording)
  }
}
