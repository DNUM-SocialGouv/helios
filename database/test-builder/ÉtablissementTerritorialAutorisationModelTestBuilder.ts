import { AutorisationMédicoSocialModel } from '../models/AutorisationMédicoSocialModel'
import { AutorisationSanitaireModel } from '../models/AutorisationSanitaireModel'
import { AutreActivitéSanitaireModel } from '../models/AutreActivitéSanitaireModel'
import { CapacitéAutorisationSanitaireModel } from '../models/CapacitéAutorisationSanitaireModel'
import { ReconnaissanceContractuelleSanitaireModel } from '../models/ReconnaissanceContractuelleSanitaireModel'
import { ÉquipementMatérielLourdSanitaireModel } from '../models/ÉquipementMatérielLourdSanitaireModel'

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
    autorisationSanitaireModel.codeActivité = champsSurchargés?.codeActivité || '16'
    autorisationSanitaireModel.dateAutorisation = champsSurchargés?.dateAutorisation || '2005-10-11'
    autorisationSanitaireModel.dateFin = champsSurchargés?.dateFin || '2026-05-03'
    autorisationSanitaireModel.dateMiseEnOeuvre = champsSurchargés?.dateMiseEnOeuvre || '2008-12-04'
    autorisationSanitaireModel.codeForme = champsSurchargés?.codeForme || '00'
    autorisationSanitaireModel.libelléActivité = champsSurchargés?.libelléActivité || "Traitement de l'insuffisance rénale chronique par épuration extrarénale"
    autorisationSanitaireModel.libelléForme = champsSurchargés?.libelléForme || 'Pas de forme'
    autorisationSanitaireModel.libelléModalité = champsSurchargés?.libelléModalité || 'Hémodialyse en unité médicalisée'
    autorisationSanitaireModel.codeModalité = champsSurchargés?.codeModalité || '42'
    autorisationSanitaireModel.numéroAutorisationArhgos = champsSurchargés?.numéroAutorisationArhgos || '01-00-000'
    autorisationSanitaireModel.numéroFinessÉtablissementTerritorial = champsSurchargés?.numéroFinessÉtablissementTerritorial || '670799667'
    return autorisationSanitaireModel
  }

  public static créeAutreActivitéSanitaire(
    champsSurchargés?: Partial<AutreActivitéSanitaireModel>
  ): AutreActivitéSanitaireModel {
    const autreActivitéSanitaireModel = new AutreActivitéSanitaireModel()
    autreActivitéSanitaireModel.codeActivité = champsSurchargés?.codeActivité || 'A1'
    autreActivitéSanitaireModel.dateAutorisation = champsSurchargés?.dateAutorisation || '2019-06-03'
    autreActivitéSanitaireModel.dateFin = champsSurchargés?.dateFin || '2024-08-31'
    autreActivitéSanitaireModel.dateMiseEnOeuvre = champsSurchargés?.dateMiseEnOeuvre || '2019-06-03'
    autreActivitéSanitaireModel.codeForme = champsSurchargés?.codeForme || '00'
    autreActivitéSanitaireModel.libelléActivité = champsSurchargés?.libelléActivité || 'Dépôt de sang'
    autreActivitéSanitaireModel.libelléForme = champsSurchargés?.libelléForme || 'Pas de forme'
    autreActivitéSanitaireModel.libelléModalité = champsSurchargés?.libelléModalité || 'Dépôt relais'
    autreActivitéSanitaireModel.codeModalité = champsSurchargés?.codeModalité || 'M2'
    autreActivitéSanitaireModel.numéroFinessÉtablissementTerritorial = champsSurchargés?.numéroFinessÉtablissementTerritorial || '670799667'
    return autreActivitéSanitaireModel
  }

  public static créeReconnaissanceContractuelleSanitaire(
    champsSurchargés?: Partial<ReconnaissanceContractuelleSanitaireModel>
  ): ReconnaissanceContractuelleSanitaireModel {
    const reconnaissanceContractuelleSanitaireModel = new ReconnaissanceContractuelleSanitaireModel()
    reconnaissanceContractuelleSanitaireModel.codeActivité = champsSurchargés?.codeActivité || 'A1'
    reconnaissanceContractuelleSanitaireModel.capacitéAutorisée = champsSurchargés?.capacitéAutorisée || 4
    reconnaissanceContractuelleSanitaireModel.dateEffetAsr = champsSurchargés?.dateEffetAsr || '2013-11-30'
    reconnaissanceContractuelleSanitaireModel.dateEffetCpom = champsSurchargés?.dateEffetCpom || '2012-12-01'
    reconnaissanceContractuelleSanitaireModel.dateFinCpom = champsSurchargés?.dateFinCpom || '2018-11-30'
    reconnaissanceContractuelleSanitaireModel.codeForme = champsSurchargés?.codeForme || '00'
    reconnaissanceContractuelleSanitaireModel.numéroCpom = champsSurchargés?.numéroCpom || '01-00-C00000'
    reconnaissanceContractuelleSanitaireModel.libelléActivité = champsSurchargés?.libelléActivité || 'Dépôt de sang'
    reconnaissanceContractuelleSanitaireModel.libelléForme = champsSurchargés?.libelléForme || 'Pas de forme'
    reconnaissanceContractuelleSanitaireModel.libelléModalité = champsSurchargés?.libelléModalité || 'Dépôt relais'
    reconnaissanceContractuelleSanitaireModel.codeModalité = champsSurchargés?.codeModalité || 'M2'
    reconnaissanceContractuelleSanitaireModel.numéroAutorisationArhgos = champsSurchargés?.numéroAutorisationArhgos || '01-00-RC00000'
    reconnaissanceContractuelleSanitaireModel.numéroFinessÉtablissementTerritorial = champsSurchargés?.numéroFinessÉtablissementTerritorial || '670799667'
    return reconnaissanceContractuelleSanitaireModel
  }

  public static créeÉquipementMatérielLourdSanitaire(
    champsSurchargés?: Partial<ÉquipementMatérielLourdSanitaireModel>
  ): ÉquipementMatérielLourdSanitaireModel {
    const équipementMatérielLourdModel = new ÉquipementMatérielLourdSanitaireModel()
    équipementMatérielLourdModel.dateAutorisation = champsSurchargés?.dateAutorisation || '2007-11-06'
    équipementMatérielLourdModel.dateFin = champsSurchargés?.dateFin || '2029-01-01'
    équipementMatérielLourdModel.dateMiseEnOeuvre = champsSurchargés?.dateMiseEnOeuvre || '2011-10-19'
    équipementMatérielLourdModel.codeÉquipementMatérielLourd = champsSurchargés?.codeÉquipementMatérielLourd || '05602'
    équipementMatérielLourdModel.libelléÉquipementMatérielLourd = champsSurchargés?.libelléÉquipementMatérielLourd || 'Scanographe à utilisation médicale'
    équipementMatérielLourdModel.numéroAutorisationArhgos = champsSurchargés?.numéroAutorisationArhgos || '01-00-0000'
    équipementMatérielLourdModel.numéroFinessÉtablissementTerritorial = champsSurchargés?.numéroFinessÉtablissementTerritorial || '670799667'
    return équipementMatérielLourdModel
  }

  public static créeCapacitéSanitaire(
    champsSurchargés?: Partial<CapacitéAutorisationSanitaireModel>
  ): CapacitéAutorisationSanitaireModel {
    const capacitéAutorisationSanitaireModel = new CapacitéAutorisationSanitaireModel()
    capacitéAutorisationSanitaireModel.nombreDeLitsEnChirurgie = champsSurchargés?.nombreDeLitsEnChirurgie || 20
    capacitéAutorisationSanitaireModel.nombreDeLitsEnMédecine = champsSurchargés?.nombreDeLitsEnMédecine || 35
    capacitéAutorisationSanitaireModel.nombreDeLitsEnObstétrique = champsSurchargés?.nombreDeLitsEnObstétrique || 12
    capacitéAutorisationSanitaireModel.nombreDeLitsEnSsr = champsSurchargés?.nombreDeLitsEnSsr || 3
    capacitéAutorisationSanitaireModel.nombreDePlacesEnChirurgie = champsSurchargés?.nombreDePlacesEnChirurgie || 25
    capacitéAutorisationSanitaireModel.nombreDePlacesEnMédecine = champsSurchargés?.nombreDePlacesEnMédecine || 40
    capacitéAutorisationSanitaireModel.nombreDePlacesEnObstétrique = champsSurchargés?.nombreDePlacesEnObstétrique || 12
    capacitéAutorisationSanitaireModel.nombreDePlacesEnSsr = champsSurchargés?.nombreDePlacesEnSsr || 3
    capacitéAutorisationSanitaireModel.numéroFinessÉtablissementTerritorial = champsSurchargés?.numéroFinessÉtablissementTerritorial || '670799667'
    return capacitéAutorisationSanitaireModel
  }
}
