import { AutorisationMédicoSocialModel } from '../models/AutorisationMédicoSocialModel'

export class ÉtablissementTerritorialAutorisationModelTestBuilder {
  public static créeMédicoSocial(
    champsSurchargés?: Partial<AutorisationMédicoSocialModel>
  ): AutorisationMédicoSocialModel {
    const autorisationMédicoSocialModel = new AutorisationMédicoSocialModel()
    autorisationMédicoSocialModel.activité = champsSurchargés?.activité || '11'
    autorisationMédicoSocialModel.capacitéAutoriséeTotale = champsSurchargés?.capacitéAutoriséeTotale || 10
    autorisationMédicoSocialModel.capacitéInstalléeTotale = champsSurchargés?.capacitéInstalléeTotale || 10
    autorisationMédicoSocialModel.clientèle = champsSurchargés?.clientèle || '702'
    autorisationMédicoSocialModel.dateDAutorisation = champsSurchargés?.dateDAutorisation || '2020-01-01'
    autorisationMédicoSocialModel.dateDeDernièreInstallation = champsSurchargés?.dateDeDernièreInstallation || '2020-01-01'
    autorisationMédicoSocialModel.dateDeMiseÀJourDAutorisation = champsSurchargés?.dateDeMiseÀJourDAutorisation || '2020-01-01'
    autorisationMédicoSocialModel.disciplineDÉquipement = champsSurchargés?.disciplineDÉquipement || '657'
    autorisationMédicoSocialModel.estInstallée = champsSurchargés?.estInstallée || true
    autorisationMédicoSocialModel.libelléActivité = champsSurchargés?.libelléActivité || 'Hébergement Complet Internat'
    autorisationMédicoSocialModel.libelléClientèle = champsSurchargés?.libelléClientèle || 'PH vieillissantes'
    autorisationMédicoSocialModel.libelléDisciplineDÉquipement = champsSurchargés?.libelléDisciplineDÉquipement || 'Accueil temporaire pour Personnes Âgées'
    autorisationMédicoSocialModel.numéroFinessÉtablissementTerritorial = champsSurchargés?.numéroFinessÉtablissementTerritorial || '590782553'
    return autorisationMédicoSocialModel
  }
}
