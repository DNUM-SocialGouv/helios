import { ÉtablissementTerritorialMédicoSocialActivité } from '../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'

// TODO: à mettre dans ÉtablissementTerritorialTestFactory
export class ÉtablissementTerritorialMédicoSocialActivitéTestFactory {
  private static activité: ÉtablissementTerritorialMédicoSocialActivité = {
    année: 2019,
    duréeMoyenneSéjourAccompagnementPersonnesSorties: 80,
    fileActivePersonnesAccompagnées: 80,
    nombreMoyenJournéesAbsencePersonnesAccompagnées: 80,
    numéroFinessÉtablissementTerritorial: '123456789',
    tauxOccupationAccueilDeJour: 80,
    tauxOccupationHébergementPermanent: 80,
    tauxOccupationHébergementTemporaire: 80,
    tauxRéalisationActivité: 80,
  }

  public static créeÉtablissementTerritorialMédicoSocialActivité(
    champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocialActivité>
  ): ÉtablissementTerritorialMédicoSocialActivité {
    return {
      ...ÉtablissementTerritorialMédicoSocialActivitéTestFactory.activité,
      ...champsSurchargés,
    }
  }
}
