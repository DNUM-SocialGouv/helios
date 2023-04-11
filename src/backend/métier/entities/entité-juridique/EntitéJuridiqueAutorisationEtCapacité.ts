import { CapacitéSanitaire } from "../établissement-territorial-sanitaire/ÉtablissementTerritorialSanitaireAutorisation";

export type CapacitéSanitaireEntitéJuridique = CapacitéSanitaire;

export type PrimaryLabel = {
  libellé: string;
  code: string;
  secondaryLabel: SecondaryLabel[];
};

export type SecondaryLabel = {
  libellé: string;
  code: string;
  formDetails: FormDetails[];
};

export type FormDetails = {
  entityTerritorialNumber: string;
  libellé: string;
  code: string;
  formName: {
    name: string | null;
    value: string | null;
  }[];
};

export type EntitéJuridiqueAutorisationEtCapacité = Readonly<{
  numéroFinessEntitéJuridique: string;
  capacités: CapacitéSanitaireEntitéJuridique[];
  autreActivities: PrimaryLabel[];
}>;
