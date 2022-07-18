import { ActivitéMédicoSocialModel } from '../models/ActivitéMédicoSocialModel'
import { ActivitéSanitaireModel } from '../models/ActivitéSanitaireModel'

export class ÉtablissementTerritorialActivitéModelTestBuilder {
  public static créeMédicoSocial(
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

  public static créeSanitaire(
    champsSurchargés?: Partial<ActivitéSanitaireModel>
  ): ActivitéSanitaireModel {
    const activitéSanitaireModel = new ActivitéSanitaireModel()
    activitéSanitaireModel.année = champsSurchargés?.année || 2019
    activitéSanitaireModel.numéroFinessÉtablissementTerritorial = champsSurchargés?.numéroFinessÉtablissementTerritorial || '210987665'
    activitéSanitaireModel.nombreDePassagesAuxUrgences = champsSurchargés?.nombreDePassagesAuxUrgences || 60_000
    activitéSanitaireModel.nombreSéjoursPartielsMédecine = champsSurchargés?.nombreSéjoursPartielsMédecine || 60
    activitéSanitaireModel.nombreSéjoursPartielsObstétrique = champsSurchargés?.nombreSéjoursPartielsObstétrique || 60
    activitéSanitaireModel.nombreSéjoursPartielsChirurgie = champsSurchargés?.nombreSéjoursPartielsChirurgie || 60
    activitéSanitaireModel.nombreSéjoursCompletsMédecine = champsSurchargés?.nombreSéjoursCompletsMédecine || 60
    activitéSanitaireModel.nombreSéjoursCompletsObstétrique = champsSurchargés?.nombreSéjoursCompletsObstétrique || 60
    activitéSanitaireModel.nombreSéjoursCompletsChirurgie = champsSurchargés?.nombreSéjoursCompletsChirurgie || 60
    activitéSanitaireModel.nombreJournéesCompletesSsr = champsSurchargés?.nombreJournéesCompletesSsr || 60
    activitéSanitaireModel.nombreJournéesPartielsSsr = champsSurchargés?.nombreJournéesPartielsSsr || 60
    activitéSanitaireModel.nombreJournéesCompletePsy = champsSurchargés?.nombreJournéesCompletePsy || 60
    activitéSanitaireModel.nombreJournéesPartiellesPsy = champsSurchargés?.nombreJournéesPartiellesPsy || 60
    return activitéSanitaireModel
  }
}
