import { AutorisationSanitaireModel } from "../../../../../database/models/AutorisationSanitaireModel";
import { AutreActivitéSanitaireModel } from "../../../../../database/models/AutreActivitéSanitaireModel";
import { ReconnaissanceContractuelleSanitaireModel } from "../../../../../database/models/ReconnaissanceContractuelleSanitaireModel";
import { ÉquipementMatérielLourdSanitaireModel } from "../../../../../database/models/ÉquipementMatérielLourdSanitaireModel";
import { AutorisationsAMMMEJQueryResult, CapacitéSanitaire } from "../établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";

export type CapacitéSanitaireEntitéJuridique = CapacitéSanitaire;

export type AutorisationsActivités = { autorisations: AutorisationActivites[]; dateMiseÀJourSource: string };
export type AutorisationActivitesAmm = { autorisations: AutorisationDActivitesAmm[]; dateMiseÀJourSource: string }
export type AutresActivités = { autorisations: AutorisationActivites[]; dateMiseÀJourSource: string };
export type ReconnaissanceContractuelleActivités = { autorisations: AutorisationActivites[]; dateMiseÀJourSource: string };
export type EquipementsMateriauxLourdsActivités = { autorisations: EquipementLourds[]; dateMiseÀJourSource: string };

export type EntitéJuridiqueAutorisationEtCapacité = Readonly<{
  numéroFinessEntitéJuridique: string;
  capacités: CapacitéSanitaireEntitéJuridique[];
  autorisationsActivités: AutorisationsActivités;
  autorisationsAmmSanitaire: AutorisationActivitesAmm;
  autresActivités: AutresActivités;
  reconnaissanceContractuelleActivités: ReconnaissanceContractuelleActivités;
  equipementMaterielLourdsActivités: EquipementsMateriauxLourdsActivités;
}>;

export type EntitéJuridiqueAutorisationEtCapacitéLoader = Readonly<{
  numéroFinessEntitéJuridique: string;
  capacités: CapacitéSanitaireEntitéJuridique[];
  autorisationsSanitaire: { autorisations: AutorisationSanitaireModel[]; dateMiseÀJourSource: string };
  autorisationsAmmSanitaire: { autorisations: AutorisationsAMMMEJQueryResult[]; dateMiseAJourSource: string };
  autresActivitesSanitaire: { autorisations: AutreActivitéSanitaireModel[]; dateMiseÀJourSource: string };
  reconnaissanceContractuellesSanitaire: { autorisations: ReconnaissanceContractuelleSanitaireModel[]; dateMiseÀJourSource: string };
  equipementMaterielLourdSanitaire: { autorisations: ÉquipementMatérielLourdSanitaireModel[]; dateMiseÀJourSource: string };
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

export type AutorisationDActivitesAmm = {
  modalites: AutorisationsAMMModalite[];
  libelle: string;
  code: string;
};

export type AutorisationsAMMModalite = Readonly<{
  libelle: string;
  code: string;
  mentions: AutorisationsAMMMention[];
}>;

export type AutorisationsAMMMention = Readonly<{
  libelle: string;
  code: string;
  pratiques: AutorisationsAMMPratique[];
}>;

export type AutorisationsAMMPratique = Readonly<{
  libelle: string;
  code: string;
  declarations: AutorisationsAMMDeclaration[];
}>;

export type AutorisationsAMMDeclaration = Readonly<{
  libelle: string;
  code: string;
  autorisationAmmEtablissments: autorisationAmmEtablissment[]
}>;

export type autorisationAmmEtablissment = Readonly<{
  numeroFiness: string;
  nomEtablissement: string;
  autorisations: Autorisation[];
}>;

export type EquipementLourds = {
  equipementEtablissements: EquipementEtablissement[];
  libelle: string;
  code: string;
};

export type EquipementEtablissement = {
  numeroFiness: string;
  nomEtablissement: string;
  equipements: Equipements[];
};

export type Equipements = {
  autorisations: Autorisation[];
};
