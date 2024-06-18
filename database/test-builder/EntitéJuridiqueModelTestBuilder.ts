import { AllocationRessourceModel } from "../models/AllocationRessourceModel";
import { CapacitesSanitaireEntiteJuridiqueModel } from "../models/CapacitesSanitaireEntiteJuridiqueModel";
import { EntitéJuridiqueModel } from "../models/EntitéJuridiqueModel";

export class EntitéJuridiqueModelTestBuilder {
  public static crée(champsSurchargés?: Partial<EntitéJuridiqueModel>): EntitéJuridiqueModel {
    const entitéJuridique = new EntitéJuridiqueModel();
    entitéJuridique.adresseAcheminement = champsSurchargés?.adresseAcheminement || "01117 OYONNAX CEDEX";
    entitéJuridique.adresseNuméroVoie = champsSurchargés?.adresseNuméroVoie || "1";
    entitéJuridique.adresseTypeVoie = champsSurchargés?.adresseTypeVoie || "RTE";
    entitéJuridique.adresseVoie = champsSurchargés?.adresseVoie || "DE VEYZIAT";
    entitéJuridique.commune = champsSurchargés?.commune || "OYONNAX"; ''
    entitéJuridique.département = champsSurchargés?.département || "AIN";
    entitéJuridique.libelléStatutJuridique = champsSurchargés?.libelléStatutJuridique || "Etablissement Public Intercommunal dHospitalisation";
    entitéJuridique.numéroFinessEntitéJuridique = champsSurchargés?.numéroFinessEntitéJuridique || "010018407";
    entitéJuridique.raisonSociale = champsSurchargés?.raisonSociale || "CENTRE HOSPITALIER DU HAUT BUGEY";
    entitéJuridique.raisonSocialeCourte = champsSurchargés?.raisonSocialeCourte || "CH DU HAUT BUGEY";
    entitéJuridique.siren = champsSurchargés?.siren || "260104631";
    entitéJuridique.téléphone = champsSurchargés?.téléphone || "0102030406";
    entitéJuridique.catégorisation = champsSurchargés?.catégorisation || "public";
    entitéJuridique.codeRégion = champsSurchargés?.codeRégion || "84";
    entitéJuridique.dateOuverture = champsSurchargés?.dateOuverture || "1901-02-02";
    return entitéJuridique;
  }

  public static créeCapacitéSanitaireEntiteJuridique(
    champsSurchargés?: Partial<CapacitesSanitaireEntiteJuridiqueModel>
  ): CapacitesSanitaireEntiteJuridiqueModel {
    const capacitéAutorisationSanitaireModel = new CapacitesSanitaireEntiteJuridiqueModel();
    capacitéAutorisationSanitaireModel.année = champsSurchargés?.année || 2022;
    capacitéAutorisationSanitaireModel.nombreDeLitsEnChirurgie = champsSurchargés?.nombreDeLitsEnChirurgie || 20;
    capacitéAutorisationSanitaireModel.nombreDeLitsEnMédecine = champsSurchargés?.nombreDeLitsEnMédecine || 35;
    capacitéAutorisationSanitaireModel.nombreDeLitsEnObstétrique = champsSurchargés?.nombreDeLitsEnObstétrique || 12;
    capacitéAutorisationSanitaireModel.nombreDeLitsEnSsr = champsSurchargés?.nombreDeLitsEnSsr || 3;
    capacitéAutorisationSanitaireModel.nombreDePlacesEnChirurgie = champsSurchargés?.nombreDePlacesEnChirurgie || 25;
    capacitéAutorisationSanitaireModel.nombreDePlacesEnMédecine = champsSurchargés?.nombreDePlacesEnMédecine || 40;
    capacitéAutorisationSanitaireModel.nombreDePlacesEnObstétrique = champsSurchargés?.nombreDePlacesEnObstétrique || 12;
    capacitéAutorisationSanitaireModel.nombreDePlacesEnSsr = champsSurchargés?.nombreDePlacesEnSsr || 3;
    capacitéAutorisationSanitaireModel.nombreDeLitsEnUsld = champsSurchargés?.nombreDeLitsEnUsld || 15;
    capacitéAutorisationSanitaireModel.nombreDeLitsOuPlacesEnPsyHospitalisationComplète =
      champsSurchargés?.nombreDeLitsOuPlacesEnPsyHospitalisationComplète || 5;
    capacitéAutorisationSanitaireModel.nombreDePlacesEnPsyHospitalisationPartielle = champsSurchargés?.nombreDePlacesEnPsyHospitalisationPartielle || 13;
    capacitéAutorisationSanitaireModel.numéroFinessEntitéJuridique = champsSurchargés?.numéroFinessEntitéJuridique || "670799667";
    return capacitéAutorisationSanitaireModel;
  }

  public static créeAllocationRessourceEntiteJuridique(
    champsSurchargés?: Partial<AllocationRessourceModel>
  ): AllocationRessourceModel {
    const allocationRessourceModel = new AllocationRessourceModel();
    allocationRessourceModel.année = champsSurchargés?.année || 2022;
    allocationRessourceModel.mois = champsSurchargés?.mois || "1/2022";
    allocationRessourceModel.enveloppe = champsSurchargés?.enveloppe || "FIR";
    allocationRessourceModel.sousEnveloppe = champsSurchargés?.sousEnveloppe || "Sanitaire";
    allocationRessourceModel.modeDelegation = champsSurchargés?.modeDelegation || "Intervention (Ex. cour.)";
    allocationRessourceModel.montant = champsSurchargés?.montant || 3300;
    allocationRessourceModel.numéroFinessEntitéJuridique = champsSurchargés?.numéroFinessEntitéJuridique || "010018407";

    return allocationRessourceModel;
  }
}
