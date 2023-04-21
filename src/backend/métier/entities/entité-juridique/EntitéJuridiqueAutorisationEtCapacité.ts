import { AutorisationSanitaireModel } from "../../../../../database/models/AutorisationSanitaireModel";
import { AutreActivitéSanitaireModel } from "../../../../../database/models/AutreActivitéSanitaireModel";
import { ReconnaissanceContractuelleSanitaireModel } from "../../../../../database/models/ReconnaissanceContractuelleSanitaireModel";
import { CapacitéSanitaire } from "../établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";

export type CapacitéSanitaireEntitéJuridique = CapacitéSanitaire;

export type AutorisationsActivités = { autorisations: AutorisationActivites[]; dateMiseÀJourSource: string };
export type AutresActivités = { autorisations: AutorisationActivites[]; dateMiseÀJourSource: string };
export type ReconnaissanceContractuelleActivités = { autorisations: AutorisationActivites[]; dateMiseÀJourSource: string };

export type EntitéJuridiqueAutorisationEtCapacité = Readonly<{
  numéroFinessEntitéJuridique: string;
  capacités: CapacitéSanitaireEntitéJuridique[];
  autorisationsActivités: AutorisationsActivités;
  autresActivités: AutresActivités;
  reconnaissanceContractuelleActivités: ReconnaissanceContractuelleActivités;
}>;

export type EntitéJuridiqueAutorisationEtCapacitéLoader = Readonly<{
  numéroFinessEntitéJuridique: string;
  capacités: CapacitéSanitaireEntitéJuridique[];
  autorisationsSanitaire: { autorisations: AutorisationSanitaireModel[]; dateMiseÀJourSource: string };
  autresActivitesSanitaire: { autorisations: AutreActivitéSanitaireModel[]; dateMiseÀJourSource: string };
  reconnaissanceContractuellesSanitaire: { autorisations: ReconnaissanceContractuelleSanitaireModel[]; dateMiseÀJourSource: string };
}>;

export type Autorisation = {
  nom: string;
  valeur: string;
};
export type AutorisationEtablissement = {
  numeroFiness: string;
  nomEtablissement: string;
  autorisations: Autorisation[];
};
export type Forme = {
  autorisationEtablissements: AutorisationEtablissement[];
  code: string;
  libelle: string;
};
export type Modalite = {
  formes: Forme[];
  code: string;
  libelle: string;
};
export type AutorisationActivites = {
  modalites: Modalite[];
  libelle: string;
  code: string;
};

export type EquipementLourds = {
  equipementEtablissements: EquipementEtablissement[];
  libelle: string;
  code: string;
};

export type EquipementEtablissement = {
  numeroFiness: string;
  nomEtablissement: string;
  etablissements: Equipements[];
};

export type Equipements = {
  autorisations: Autorisation[];
};
