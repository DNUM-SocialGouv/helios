import { AutorisationMédicoSocialModel } from '../models/AutorisationMédicoSocialModel'
import { AutorisationSanitaireModel } from '../models/AutorisationSanitaireModel'

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
    autorisationMédicoSocialModel.estInstallée = champsSurchargés?.estInstallée ?? true
    autorisationMédicoSocialModel.libelléActivité = champsSurchargés?.libelléActivité || 'Hébergement Complet Internat'
    autorisationMédicoSocialModel.libelléClientèle = champsSurchargés?.libelléClientèle || 'PH vieillissantes'
    autorisationMédicoSocialModel.libelléDisciplineDÉquipement = champsSurchargés?.libelléDisciplineDÉquipement || 'Accueil temporaire pour Personnes Âgées'
    autorisationMédicoSocialModel.numéroFinessÉtablissementTerritorial = champsSurchargés?.numéroFinessÉtablissementTerritorial || '590782553'
    return autorisationMédicoSocialModel
  }

  public static créeAutorisationSanitaire(
    champsSurchargés?: Partial<AutorisationSanitaireModel>
  ): AutorisationSanitaireModel {
    const autorisationSanitaireModel = new AutorisationSanitaireModel()
    autorisationSanitaireModel.activité = champsSurchargés?.activité || '16'
    autorisationSanitaireModel.dateAutorisation = champsSurchargés?.dateAutorisation || '2005-10-11'
    autorisationSanitaireModel.dateFin = champsSurchargés?.dateFin || '2026-05-03'
    autorisationSanitaireModel.dateMiseEnOeuvre = champsSurchargés?.dateMiseEnOeuvre || '2008-12-04'
    autorisationSanitaireModel.forme = champsSurchargés?.forme || '00'
    autorisationSanitaireModel.libelléActivité = champsSurchargés?.libelléActivité || "Traitement de l'insuffisance rénale chronique par épuration extrarénale"
    autorisationSanitaireModel.libelléForme = champsSurchargés?.libelléForme || 'Pas de forme'
    autorisationSanitaireModel.libelléModalité = champsSurchargés?.libelléModalité || 'Hémodialyse en unité médicalisée'
    autorisationSanitaireModel.modalité = champsSurchargés?.modalité || '42'
    autorisationSanitaireModel.numéroAutorisationArhgos = champsSurchargés?.numéroAutorisationArhgos || '01-00-000'
    autorisationSanitaireModel.numéroFinessÉtablissementTerritorial = champsSurchargés?.numéroFinessÉtablissementTerritorial || '670799667'
    return autorisationSanitaireModel
  }
}
