import { AutorisationSanitaireModel } from "../../../../../database/models/AutorisationSanitaireModel";
import { CapacitéSanitaire } from "../établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";

export type CapacitéSanitaireEntitéJuridique = CapacitéSanitaire;

export type EntitéJuridiqueAutorisationEtCapacité = Readonly<{
  numéroFinessEntitéJuridique: string;
  capacités: CapacitéSanitaireEntitéJuridique[];
  autorisationsActivités: AutorisationActivites[];
}>;

export type EntitéJuridiqueAutorisationEtCapacitéLoader = Readonly<{
  numéroFinessEntitéJuridique: string;
  capacités: CapacitéSanitaireEntitéJuridique[];
  autorisationsSanitaire: AutorisationSanitaireModel[];
}>;

export type Autorisation = {
  nom: string;
  valeur: string;
};
export type AutorisationEtablissement = {
  numeroFiness: string;
  autorisation: Autorisation[];
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
  modalités: Modalite[];
  libelle: string;
  code: string;
};
