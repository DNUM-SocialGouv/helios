import { ActivitéMédicoSocialModel } from '../models/ActivitéMédicoSocialModel'

export class ÉtablissementTerritorialActivitéModelTestBuilder {
  public static crée(
    champsSurchargés?: Partial<ActivitéMédicoSocialModel>
  ): ActivitéMédicoSocialModel {
    const activitéMédicoSocialModel = new ActivitéMédicoSocialModel()
    activitéMédicoSocialModel.année = champsSurchargés?.année || 2019
    activitéMédicoSocialModel.numéroFinessÉtablissementTerritorial = champsSurchargés?.numéroFinessÉtablissementTerritorial || '590782553'
    activitéMédicoSocialModel.tauxOccupationAccueilDeJour = champsSurchargés?.tauxOccupationAccueilDeJour || 80
    activitéMédicoSocialModel.tauxOccupationHébergementTemporaire = champsSurchargés?.tauxOccupationHébergementTemporaire || 80
    activitéMédicoSocialModel.tauxOccupationHébergementPermanent = champsSurchargés?.tauxOccupationHébergementPermanent || 80
    activitéMédicoSocialModel.tauxRéalisationActivité = champsSurchargés?.tauxRéalisationActivité || 80
    activitéMédicoSocialModel.fileActivePersonnesAccompagnées = champsSurchargés?.fileActivePersonnesAccompagnées || 80
    activitéMédicoSocialModel.nombreMoyenJournéesAbsencePersonnesAccompagnées = champsSurchargés?.nombreMoyenJournéesAbsencePersonnesAccompagnées || 80
    activitéMédicoSocialModel.duréeMoyenneSéjourAccompagnementPersonnesSorties = champsSurchargés?.duréeMoyenneSéjourAccompagnementPersonnesSorties || 80
    return activitéMédicoSocialModel
  }
}
