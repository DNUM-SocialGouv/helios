import { ÉtablissementTerritorialMédicoSocialActivité } from '../métier/entities/établissement-territorial-médico-social/ÉtablissementTerritorialMédicoSocialActivité'

export class ÉtablissementTerritorialMédicoSocialActivitéTestFactory {
  private static activité: ÉtablissementTerritorialMédicoSocialActivité = {
    année: 2019,
    duréeMoyenneSéjourDesPersonnesSortiesDéfinitivement: 80,
    fileActiveDesPersonnesAccompagnésSurPériode: 80,
    nombreMoyenJournéeAbsenceDesPersonnesAccompagnésSurPériode: 80,
    numéroFinessÉtablissementTerritorial: '123456789',
    tauxDOccupationDesLitsAutorisésEnAccueil: 80,
    tauxDOccupationDesLitsAutorisésEnHébergementTemporaire: 80,
    tauxDOccupationDesPlacesAutoriséesEnHébergementPermanent: 80,
    tauxDeRéalisationDeLActivité: 80,
  }
  public static créeÉtablissementTerritorialMédicoSocialActivité(champsSurchargés?: Partial<ÉtablissementTerritorialMédicoSocialActivité>): ÉtablissementTerritorialMédicoSocialActivité {
    return {
      ...ÉtablissementTerritorialMédicoSocialActivitéTestFactory.activité,
      ...champsSurchargés,
    }
  }
}
