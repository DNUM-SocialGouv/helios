import { RessourcesHumainesEtablissementSanitaireModel } from "../models/RessourcesHumainesEtablissementSanitaireModel";
import { RessourcesHumainesMédicoSocialModel } from "../models/RessourcesHumainesMédicoSocialModel";

export class ÉtablissementTerritorialRessourcesHumainesModelTestBuilder {
  public static créeMédicoSocial(champsSurchargés?: Partial<RessourcesHumainesMédicoSocialModel>): RessourcesHumainesMédicoSocialModel {
    const ressourcesHumainesMédicoSocialModel = new RessourcesHumainesMédicoSocialModel();
    ressourcesHumainesMédicoSocialModel.année = champsSurchargés?.année || 2019;
    ressourcesHumainesMédicoSocialModel.numéroFinessÉtablissementTerritorial = champsSurchargés?.numéroFinessÉtablissementTerritorial || "590782553";
    ressourcesHumainesMédicoSocialModel.nombreDeCddDeRemplacement = champsSurchargés?.nombreDeCddDeRemplacement || 45;
    ressourcesHumainesMédicoSocialModel.nombreDEtpRéalisés = champsSurchargés?.nombreDEtpRéalisés || 47.42;
    ressourcesHumainesMédicoSocialModel.tauxDAbsentéismePourMaladieCourteDurée = champsSurchargés?.tauxDAbsentéismePourMaladieCourteDurée || 0.0003;
    ressourcesHumainesMédicoSocialModel.tauxDAbsentéismePourMaladieMoyenneDurée = champsSurchargés?.tauxDAbsentéismePourMaladieMoyenneDurée || 0.0057;
    ressourcesHumainesMédicoSocialModel.tauxDAbsentéismePourMaladieLongueDurée = champsSurchargés?.tauxDAbsentéismePourMaladieLongueDurée || 0.0381;
    ressourcesHumainesMédicoSocialModel.tauxDAbsentéismePourMaternitéPaternité = champsSurchargés?.tauxDAbsentéismePourMaternitéPaternité || 0.0064;
    ressourcesHumainesMédicoSocialModel.tauxDAbsentéismePourAccidentEtMaladieProfessionelle =
      champsSurchargés?.tauxDAbsentéismePourAccidentEtMaladieProfessionelle || 0.0042;
    ressourcesHumainesMédicoSocialModel.tauxDAbsentéismePourCongésSpéciaux = champsSurchargés?.tauxDAbsentéismePourCongésSpéciaux || 0.022;
    ressourcesHumainesMédicoSocialModel.tauxDAbsentéismeHorsFormation = champsSurchargés?.tauxDAbsentéismeHorsFormation || 0.0767;
    ressourcesHumainesMédicoSocialModel.tauxDEtpVacants = champsSurchargés?.tauxDEtpVacants || 0.652;
    ressourcesHumainesMédicoSocialModel.tauxDePrestationsExternes = champsSurchargés?.tauxDePrestationsExternes || 0.659;
    ressourcesHumainesMédicoSocialModel.tauxDeRotationDuPersonnel = champsSurchargés?.tauxDeRotationDuPersonnel || 0.667;
    return ressourcesHumainesMédicoSocialModel;
  }

  public static creeEtablissementSanitaire(champsSurchargés?: Partial<RessourcesHumainesEtablissementSanitaireModel>): RessourcesHumainesEtablissementSanitaireModel {
    const ressourcesHumainesEtablissementSanitaireModel = new RessourcesHumainesEtablissementSanitaireModel();
    ressourcesHumainesEtablissementSanitaireModel.annee = champsSurchargés?.annee || 2019;
    ressourcesHumainesEtablissementSanitaireModel.numeroFinessEtablissementTerritorial = champsSurchargés?.numeroFinessEtablissementTerritorial || "590782553";
    ressourcesHumainesEtablissementSanitaireModel.nombreEtpPm = champsSurchargés?.nombreEtpPm || 10;
    ressourcesHumainesEtablissementSanitaireModel.nombreEtpPnm = champsSurchargés?.nombreEtpPnm || 20;
    ressourcesHumainesEtablissementSanitaireModel.joursAbsenteismePm = champsSurchargés?.joursAbsenteismePm || 30;
    ressourcesHumainesEtablissementSanitaireModel.joursAbsenteismePnm = champsSurchargés?.joursAbsenteismePnm || 40;
    ressourcesHumainesEtablissementSanitaireModel.depensesInterimPm = champsSurchargés?.depensesInterimPm || 5000;
    return ressourcesHumainesEtablissementSanitaireModel;
  }
}
