import { AutorisationSanitaireModel } from "../../../../../database/models/AutorisationSanitaireModel";
import { AutreActivitéSanitaireModel } from "../../../../../database/models/AutreActivitéSanitaireModel";
import { CapacitéSanitaire } from "../établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";

export type CapacitéSanitaireEntitéJuridique = CapacitéSanitaire;

export type AutorisationsActivités = { autorisations: AutorisationActivites[]; dateMiseÀJourSource: string };
export type AutresActivités = { autorisations: AutorisationActivites[]; dateMiseÀJourSource: string };

export type EntitéJuridiqueAutorisationEtCapacité = Readonly<{
  numéroFinessEntitéJuridique: string;
  capacités: CapacitéSanitaireEntitéJuridique[];
  autorisationsActivités: AutorisationsActivités;
  autresActivités: AutresActivités;
}>;

export type EntitéJuridiqueAutorisationEtCapacitéLoader = Readonly<{
  numéroFinessEntitéJuridique: string;
  capacités: CapacitéSanitaireEntitéJuridique[];
  autorisationsSanitaire: { autorisations: AutorisationSanitaireModel[]; dateMiseÀJourSource: string };
  autresActivitesSanitaire: { autorisations: AutreActivitéSanitaireModel[]; dateMiseÀJourSource: string };
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
