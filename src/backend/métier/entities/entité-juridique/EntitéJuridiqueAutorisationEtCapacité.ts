import { CapacitéSanitaire } from "../établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";

export type CapacitéSanitaireEntitéJuridique = CapacitéSanitaire;

export type EntitéJuridiqueAutorisationEtCapacité = Readonly<{
  numéroFinessEntitéJuridique: string;
  capacités: CapacitéSanitaireEntitéJuridique[];
  autorisationsActivités: AutorisationActivites[];
}>;

export type AutorisationActivites = {
  modalités: { code: string }[];
  libelle: string;
  code: string;
};
